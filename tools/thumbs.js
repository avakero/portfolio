#!/usr/bin/env node
'use strict';

/**
 * デモサイトのサムネイル（800x560 WebP）を生成する。
 *
 *   node tools/thumbs.js                 thumbs/ にある分だけ撮り直す
 *   node tools/thumbs.js 42_xxx          指定したデモだけ
 *   node tools/thumbs.js --all           demos/ 配下すべて
 *   node tools/thumbs.js --list          対象になりうるデモ名を一覧表示
 *
 * デモは起動アニメーションとスクロール連動の出現演出を持つものが多いため、
 * 読み込み後に待機 → ページ全体をスクロール往復 → トップに戻してから撮影する。
 * これをやらないとヒーローが白飛び・空白の状態で撮れてしまう。
 *
 * 外部パッケージには依存せず、chrome-headless-shell を CDP で直接操作する。
 * （リポジトリに package.json を置くと Vercel が Node プロジェクトとして
 *   ビルドしようとするため、あえて素の Node だけで完結させている）
 */

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const DEMOS = path.join(ROOT, 'demos');
const THUMBS = path.join(ROOT, 'thumbs');

const VIEW_W = 1440;          // 撮影時のビューポート幅
const VIEW_H = 1010;
const OUT_W = 800;            // 出力サイズ（本体側の card と同じ 10:7）
const OUT_H = 560;
const QUALITY = 86;

const SETTLE_MS = 3500;       // 起動アニメーションの待ち時間
const AFTER_SWEEP_MS = 2000;  // スクロール往復後の待ち時間

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Chrome の場所を探す ---------- */

function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const home = os.homedir();
  const versioned = [
    path.join(home, '.cache', 'puppeteer', 'chrome-headless-shell'),
    path.join(home, 'AppData', 'Local', 'ms-playwright'),
  ];

  for (const dir of versioned) {
    if (!fs.existsSync(dir)) continue;
    for (const version of fs.readdirSync(dir).sort().reverse()) {
      const exe = path.join(dir, version, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
      if (fs.existsSync(exe)) return exe;
    }
  }

  // 最後の手段。chrome.exe でも撮れるが --window-size を無視することがある
  for (const exe of [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]) {
    if (fs.existsSync(exe)) return exe;
  }

  throw new Error(
    'chrome-headless-shell が見つかりません。CHROME_PATH に実行ファイルのパスを指定するか、\n' +
    '  npx @puppeteer/browsers install chrome-headless-shell@stable\n' +
    'でインストールしてください。'
  );
}

/* ---------- 最小限の CDP クライアント ---------- */

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = [];

    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== undefined) {
        const slot = this.pending.get(msg.id);
        if (!slot) return;
        this.pending.delete(msg.id);
        msg.error ? slot.reject(new Error(msg.error.message)) : slot.resolve(msg.result);
        return;
      }
      for (const w of [...this.waiters]) {
        if (w.method === msg.method && (!w.sessionId || w.sessionId === msg.sessionId)) {
          this.waiters.splice(this.waiters.indexOf(w), 1);
          w.resolve(msg.params);
        }
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  once(method, sessionId, timeoutMs = 30000) {
    return new Promise(resolve => {
      const waiter = { method, sessionId, resolve };
      this.waiters.push(waiter);
      setTimeout(() => {
        const i = this.waiters.indexOf(waiter);
        if (i >= 0) { this.waiters.splice(i, 1); resolve(null); }
      }, timeoutMs);
    });
  }
}

/* ---------- ブラウザ起動 ---------- */

async function launch() {
  const exe = findChrome();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pc-thumbs-'));

  const child = spawn(exe, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const endpoint = await new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => reject(new Error('Chrome の起動がタイムアウトしました')), 30000);
    child.stderr.on('data', chunk => {
      buf += chunk.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); resolve(m[1]); }
    });
    child.on('exit', code => { clearTimeout(timer); reject(new Error(`Chrome が終了しました (code ${code})`)); });
  });

  const ws = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('CDP に接続できませんでした')), { once: true });
  });

  return {
    cdp: new CDP(ws),
    async close() {
      try { ws.close(); } catch {}
      child.kill();
      try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
    },
  };
}

/* ---------- 1枚撮る ---------- */

// スプラッシュゲート（ENTER 画面）を踏み越える
const CLICK_GATE = `(() => {
  const re = /^(ENTER|Enter|enter|入場|入る|はい|YES|SKIP|OPEN|START)$/;
  const hit = [...document.querySelectorAll('button, a, div, span, p')].find(el => {
    if (!re.test((el.textContent || '').trim())) return false;
    const r = el.getBoundingClientRect();
    return r.width > 20 && r.height > 10 && r.top < window.innerHeight;
  });
  if (!hit) return false;
  hit.click();
  return true;
})()`;

// スクロール連動の出現演出を発火させ、トップに戻す
const SWEEP = `(async () => {
  const step = window.innerHeight * 0.8;
  const max = document.body.scrollHeight;
  for (let y = 0; y < max; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
})()`;

async function capture(cdp, file, outPath) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });

  try {
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEW_W, height: VIEW_H, deviceScaleFactor: 1, mobile: false,
    }, sessionId);

    const evaluate = async expression => {
      const r = await cdp.send('Runtime.evaluate', {
        expression, awaitPromise: true, returnByValue: true,
      }, sessionId);
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
      return r.result.value;
    };

    const loaded = cdp.once('Page.loadEventFired', sessionId, 45000);
    await cdp.send('Page.navigate', { url: pathToFileURL(file).href }, sessionId);
    await loaded;

    await sleep(SETTLE_MS);
    if (await evaluate(CLICK_GATE)) await sleep(3000);
    await evaluate(SWEEP);
    await sleep(AFTER_SWEEP_MS);

    const { data } = await cdp.send('Page.captureScreenshot', {
      format: 'webp',
      quality: QUALITY,
      clip: {
        x: 0,
        y: 0,
        width: VIEW_W,
        height: Math.round(VIEW_W * OUT_H / OUT_W),
        scale: OUT_W / VIEW_W,
      },
      captureBeyondViewport: false,
    }, sessionId);

    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  } finally {
    await cdp.send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

/* ---------- 対象の解決 ---------- */

function allDemos() {
  const list = fs.readdirSync(DEMOS)
    .filter(f => f.endsWith('.html'))
    .map(f => ({ name: path.basename(f, '.html'), file: path.join(DEMOS, f) }));

  // leafia のようにサブディレクトリ構成のデモも拾う
  for (const entry of fs.readdirSync(DEMOS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const index = path.join(DEMOS, entry.name, 'index.html');
    if (fs.existsSync(index)) list.push({ name: entry.name, file: index });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

function resolveTargets(args) {
  const demos = allDemos();
  const byName = new Map(demos.map(d => [d.name, d]));

  if (args.includes('--all')) return demos;

  const names = args.filter(a => !a.startsWith('--'));
  if (names.length) {
    return names.map(n => {
      const hit = byName.get(n) || byName.get(n.replace(/\.(html|webp)$/, ''));
      if (!hit) throw new Error(`demos/ に見つかりません: ${n}`);
      return hit;
    });
  }

  // 引数なし = 本体サイトが参照している分（thumbs/ にある分）だけ撮り直す
  if (!fs.existsSync(THUMBS)) return [];
  return fs.readdirSync(THUMBS)
    .filter(f => f.endsWith('.webp'))
    .map(f => {
      const name = path.basename(f, '.webp');
      const hit = byName.get(name);
      if (!hit) console.warn(`  skip ${name}（対応するデモが demos/ にありません）`);
      return hit;
    })
    .filter(Boolean);
}

/* ---------- main ---------- */

(async () => {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].split('/**')[1].trim());
    return;
  }

  if (args.includes('--list')) {
    allDemos().forEach(d => console.log(d.name));
    return;
  }

  const targets = resolveTargets(args);
  if (!targets.length) {
    console.log('対象がありません。--all を付けるか、デモ名を指定してください。');
    return;
  }

  fs.mkdirSync(THUMBS, { recursive: true });
  console.log(`${targets.length} 件を撮影します（1件あたり約8秒）`);

  const browser = await launch();
  const failed = [];

  try {
    for (const { name, file } of targets) {
      const out = path.join(THUMBS, `${name}.webp`);
      try {
        await capture(browser.cdp, file, out);
        console.log(`  ok   ${name}.webp  ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
      } catch (e) {
        failed.push(name);
        console.log(`  FAIL ${name}: ${e.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  if (failed.length) {
    console.log(`\n失敗: ${failed.join(', ')}`);
    process.exitCode = 1;
  }

  console.log(
    '\n撮れた画像は必ず目視で確認してください。' +
    '\nスプラッシュゲートや長い暗転を持つデモは真っ黒・空白で撮れることがあります' +
    '\n（既知: 23_neon_abyss / 27_void_head_spa）。'
  );
})();
