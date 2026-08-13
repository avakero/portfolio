# tools

デモギャラリー（works.pixelcraft.jp）のメンテナンス用スクリプト。
このディレクトリは `.vercelignore` で公開対象から外してある。

## thumbs.js — サムネイル生成

pixelcraft.jp 本体の実績ページ／サービスページに載せているデモのサムネイル
（`thumbs/*.webp`、800×560）を生成する。

```sh
node tools/thumbs.js                # thumbs/ にある分だけ撮り直す
node tools/thumbs.js 42_xxx         # 指定したデモだけ
node tools/thumbs.js --all          # demos/ 配下すべて
node tools/thumbs.js --list         # デモ名の一覧
```

外部パッケージには依存しない（`package.json` を置くと Vercel が Node プロジェクトと
してビルドしようとするため）。Chrome は以下の順で自動的に探す。

1. 環境変数 `CHROME_PATH`
2. `~/.cache/puppeteer/chrome-headless-shell/*/`
3. `~/AppData/Local/ms-playwright/chromium_headless_shell-*/`
4. インストール済みの `chrome.exe`（`--window-size` を無視することがあるので非推奨）

見つからない場合は次でインストールする。

```sh
npx @puppeteer/browsers install chrome-headless-shell@stable
```

### 撮影がうまくいかないとき

デモの多くは起動アニメーションとスクロール連動の出現演出を持つため、
読み込み直後に撮ると**ヒーローが白飛び・空白**になる。スクリプトは

読み込み → 3.5秒待機 → スプラッシュゲート（ENTER 画面）をクリック →
ページ全体をスクロール往復 → トップに戻して 2秒待機 → 撮影

という手順を踏んでいる。それでも撮れないものがある。

| デモ | 症状 |
|---|---|
| `23_neon_abyss` | ENTER スプラッシュゲートを越えられない |
| `27_void_head_spa` | 暗転が長く、ほぼ真っ黒で撮れる |

待ち時間が足りない場合は `SETTLE_MS` / `AFTER_SWEEP_MS` を延ばす。
**生成後は必ず目視で確認すること。**

## デモを追加・変更したときの手順

1. `demos/NN_name.html` を追加・編集する（1ファイル完結、ビルドなし）
2. `index.html` の `projects` 配列に1件足す
   （`id` / `title` / `subtitle` / `category` / `tags` / `emoji` / `bg` /
   `desc` / `colors` / `copy` / `file`、明るい背景なら `textDark: true`）
   - `category` は `luxury` / `tech` / `creative` / `service` / `lifestyle`
   - `file` は `demos/` からの相対パス（サブディレクトリ可）
3. 件数表示を更新する（下記）
4. `node tools/thumbs.js <name>` でサムネイルを生成（本体に載せる場合のみ）
5. commit → push。Vercel が自動デプロイする

### 件数がハードコードされている箇所

このリポジトリ:

- `index.html` の `meta name="description"`
- `index.html` の `og:description`
- `index.html` の `data-count="41"`（STATS セクション）

GitPress リポジトリ（`content/page/` の本番と `pixelcraft/` の作業用で対になっている）:

- `pixelcraft-works.html` / `works.html` … セクション見出しの説明文と CTA ボタン
- `pixelcraft-service.html` / `service.html` … デモ導線バナーの本文

**本体側は `https://works.pixelcraft.jp/thumbs/*.webp` を直参照しているため、
このリポジトリを先にデプロイしないと本体で画像が 404 する。**
