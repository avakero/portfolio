---
name: homepage-builder
description: |
  ホームページ（Webサイト）をゼロから制作するスキル。ユーザーへの対話型ヒアリングで要件を整理し、構造化されたプロンプトを組み立て、完成度の高いHTML/CSS/JSファイルを生成する。
  このスキルは以下のケースで必ず使用すること：ユーザーが「ホームページを作りたい」「Webサイトを作って」「LPを作成して」「サイト制作」「ウェブページ」「HTMLでサイトを作って」「コーポレートサイト」「店舗サイト」「ポートフォリオサイト」などと言った場合。1ページ完結のHTMLサイトを作るリクエスト全般に対応する。デザイン、コーディング、コピーライティングまで一貫して行う。
---

# Homepage Builder スキル

ユーザーとの対話を通じてホームページの要件をヒアリングし、プロフェッショナルなHTML/CSS/JSの1ファイル完結サイトを生成するスキル。

## 全体フロー

```
1. ヒアリング（AskUserQuestion）
2. ヒアリング結果を構造化プロンプトに変換
3. HTML/CSS/JSコードを生成
4. ファイルを保存して提供
```

---

## Phase 1: ヒアリング

ユーザーにAskUserQuestionツールを使って段階的に質問する。一度に大量の質問を投げると圧倒するので、**3〜4つのセクションに分けて**順番に聞く。ユーザーが既に会話中で情報を提供している場合は、その内容を活用して重複する質問はスキップする。

### ヒアリング1回目: 基本情報

以下を聞く：

- **サイトの種類**: コーポレート / 店舗（飲食・サロンなど） / サービスサイト・LP / SaaS・Webアプリ / EC・ブランドサイト / ポートフォリオ / その他
- **サイト名・ブランド名**: 例）懐石 月白（つきしろ）、FlowTalk、CODE GARDEN
- **業種・ビジネスの内容**: 短い説明文。例）京都・祇園の完全予約制懐石料理店。季節の食材を使ったおまかせコースのみ。

### ヒアリング2回目: デザイン

以下を聞く：

- **デザインの方向性**（複数選択可）: シンプル/ミニマル、高級感/ラグジュアリー、ナチュラル/オーガニック、ポップ/カラフル、テック/近未来、和風/ジャパニーズ、ダーク/シネマティック、かわいい/やわらかい、クール/スタイリッシュ、自由記述
- **カラーパレット**: おまかせ or ブランドカラー指定（3〜5色）
- **フォントの雰囲気**: 明朝体ベース / ゴシック体ベース / 太め / 細め / 英字重視 など
- **参考サイト**（任意）: URLやイメージの言葉

### ヒアリング3回目: コンテンツ・構成

以下を聞く：

- **ターゲット**: 例）30〜40代の女性。仕事帰りに自分へのご褒美で来店する方が多い。
- **サイトの目的**（複数選択可）: 予約増加 / 問い合わせ増加 / ブランドイメージ向上 / 採用 / 商品説明 / 資料請求 / その他
- **必ず伝えたいこと**: 例）「完全予約制でゆったり過ごせること」と「季節ごとのコース内容」
- **キャッチコピー案**（任意）: 例）「一杯に、物語がある。」 ※「おまかせ」ならこちらで提案

### ヒアリング4回目: セクション・演出・トーン

以下を聞く：

- **必要なセクション**（複数選択可）:
  - Hero（トップビジュアル）
  - サービス/メニュー紹介
  - こだわり・フィロソフィー
  - 実績/作品/メニュー一覧
  - お客様の声
  - 料金プラン/メニュー表
  - スタッフ紹介/会社概要
  - 予約/お問い合わせ
  - よくある質問
  - ブログ/お知らせ一覧
  - アクセス/マップ

- **アニメーションの強さ**: 控えめ / ほどほど / しっかり
- **やってみたい動き**（複数選択可）: スクロールアニメーション / 背景グラデーション / カレンダーUI / チャットUI / カウントアップ / ギャラリー・スライダー / パララックス / おまかせ

- **文章のトーン**: かっちり・フォーマル / 丁寧だけど柔らかい / フレンドリー / ポップ / シリアス

---

## Phase 2: プロンプト構築

ヒアリング結果を以下の構造化フォーマットに組み立てる。これはコード生成の指示書になる。

```
【サイト種別】{サイトの種類}
【サイト名】{サイト名・ブランド名}
【業種・内容】{業種の説明}
【ターゲット】{ターゲット}
【サイト目的】{目的のリスト}
【キャッチコピー】{キャッチコピー or 自動生成}
【伝えたいこと】{必ず伝えたいこと}

【デザインテイスト】{選択されたデザイン方向性}
【カラーパレット】{指定色 or おまかせ時は業種・テイストに合った配色を生成}
【フォントイメージ】{フォントの方向性}
【参考サイト】{URL or イメージの説明}

【セクション構成】Hero → {選択されたセクションを順番に} → Footer
【各セクションメモ】{ユーザーが追加したメモがあれば}

【アニメーション強度】{控えめ / ほどほど / しっかり}
【特徴的な演出】{選択されたアニメーション}

【文体・トーン】{選択されたトーン}
【禁止表現】{あれば}
```

ユーザーにこの組み立て結果を見せて確認を取る。修正があれば反映する。

---

## Phase 3: HTML生成

構造化プロンプトを元に、**1ファイル完結のHTML**（HTML + CSS + JS全てインライン）を生成する。

### 技術要件

- **1ファイル完結**: `<style>` と `<script>` を1つのHTMLファイル内に含める
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応。メディアクエリを使用
- **外部CDN利用可**:
  - Google Fonts（日本語フォント: Noto Sans JP, Noto Serif JP, Zen Kaku Gothic New, Shippori Mincho など）
  - Font Awesome（アイコン）
  - AOS (Animate On Scroll) ライブラリ（アニメーション指定時）
  - Swiper.js（スライダー指定時）
- **画像**: placeholder画像として `https://placehold.co/` を使用。サイズと色をコンテキストに合わせる
- **SEO基本対応**: meta description, viewport, og:tags
- **アクセシビリティ**: alt属性、セマンティックHTML、適切なaria属性

### 必須HTMLテンプレート構造

生成するHTMLは以下の構造を必ず含める。これにより品質が安定し、ブラウザでの表示が確実になる：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{サイトの説明文}">
    <meta property="og:title" content="{サイト名}">
    <meta property="og:description" content="{サイトの説明}">
    <meta property="og:type" content="website">
    <title>{サイト名}</title>

    <!-- Google Fonts（必ずpreconnect付きで読み込む） -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family={日本語フォント}&family={英字フォント}&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- AOS（アニメーション指定時のみ） -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">

    <style>
        /* CSS変数 → リセット → レイアウト → コンポーネント → レスポンシブの順に記述 */
    </style>
</head>
<body>
    <!-- ヘッダー・ナビゲーション -->
    <!-- 各セクション -->
    <!-- フッター -->

    <!-- AOS初期化 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script>
        // JS はbody閉じタグ直前に配置
    </script>
</body>
</html>
```

### モバイルナビゲーション（ハンバーガーメニュー）

レスポンシブサイトには必ずモバイル用のハンバーガーメニューを実装する。以下のパターンを使う：

```html
<!-- ナビゲーション内にハンバーガーボタン -->
<button class="nav__hamburger" aria-label="メニューを開く" aria-expanded="false">
    <span></span><span></span><span></span>
</button>
```

```css
/* ハンバーガーメニュー */
.nav__hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
}
.nav__hamburger span {
    width: 24px;
    height: 2px;
    background: currentColor;
    transition: all 0.3s ease;
}
/* 開いた状態 */
.nav__hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.nav__hamburger.active span:nth-child(2) { opacity: 0; }
.nav__hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

@media (max-width: 768px) {
    .nav__hamburger { display: flex; }
    .nav__menu {
        position: fixed;
        top: 0; right: -100%;
        width: 75%; height: 100vh;
        background: var(--color-bg);
        flex-direction: column;
        padding: 5rem 2rem;
        transition: right 0.3s ease;
        z-index: 999;
    }
    .nav__menu.active { right: 0; }
}
```

```javascript
// ハンバーガーメニュートグル
const hamburger = document.querySelector('.nav__hamburger');
const navMenu = document.querySelector('.nav__menu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded',
        hamburger.classList.contains('active'));
});
// メニューリンクのクリックで閉じる
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});
```

### プレースホルダー画像のガイドライン

`https://placehold.co/` を使い、サイトの色調に合わせたプレースホルダーを生成する：

- **Hero背景**: `https://placehold.co/1920x1080/{背景色hex}/{テキスト色hex}?text={サイト名}`
- **カード画像**: `https://placehold.co/600x400/{色hex}/{テキスト色hex}?text=Photo`
- **人物アイコン**: `https://placehold.co/100x100/{色hex}/{テキスト色hex}?text=User`
- **ギャラリー**: `https://placehold.co/400x400/{色hex}/{テキスト色hex}?text=Gallery+{番号}`

色はCSS変数で指定したカラーパレットの色（#を除いたhex値）を使う。例: 黒金テイストなら `https://placehold.co/1920x1080/1a1a1a/d4af37?text=月白`

### デザイン品質基準

生成するHTMLは「テンプレートっぽさ」を出さないことが重要。プロのWebデザイナーが作ったかのような完成度を目指す：

- **余白を大胆に使う**: セクション間は十分なpadding（80px〜120px程度）。要素同士も窮屈にしない
- **タイポグラフィの階層**: h1 > h2 > h3 > p のサイズ・ウェイトに明確な差をつける。キャッチコピーは特に大きく印象的に
- **カラーの使い方**: 背景色を交互に変えてセクションにリズムをつける。アクセントカラーは控えめに効かせる
- **ホバーエフェクト**: ボタンやリンクに自然なトランジション（0.3s ease）
- **画像の扱い**: aspect-ratio や object-fit を使って画像が崩れないように
- **CTA（行動喚起）ボタン**: サイトの目的に応じた明確なCTAを適切な場所に配置
- **ファーストビュー**: Heroセクションは画面の100vhを使い切り、強いインパクトを与える
- **セクション間のトランジション**: 背景色の切り替え、斜線区切り（clip-path）、SVGウェーブなどでセクション間に視覚的な流れを作る

### CSS設計パターン

CSS変数はこの構造で定義する。一貫した命名により保守性が上がる：

```css
:root {
    /* カラーパレット */
    --color-primary: #xxx;       /* メインカラー */
    --color-secondary: #xxx;     /* サブカラー */
    --color-accent: #xxx;        /* アクセントカラー */
    --color-bg: #xxx;            /* 背景色 */
    --color-bg-alt: #xxx;        /* 交互セクション背景色 */
    --color-text: #xxx;          /* 本文テキスト色 */
    --color-text-light: #xxx;    /* 薄いテキスト色 */
    --color-border: #xxx;        /* ボーダー色 */

    /* タイポグラフィ */
    --font-heading: 'xxx', serif;    /* 見出しフォント */
    --font-body: 'xxx', sans-serif;  /* 本文フォント */
    --font-accent: 'xxx', sans-serif; /* アクセントフォント（英字など） */

    /* スペーシング */
    --section-padding: 100px 0;
    --container-width: 1200px;
    --gap-sm: 1rem;
    --gap-md: 2rem;
    --gap-lg: 4rem;
}
```

### アニメーション実装

アニメーション強度に応じて実装する：

**控えめ**:
- AOS の `fade-up` のみ。duration: 800ms, once: true
- ヘッダーのスクロール時に背景色を変える（透明→不透明）

**ほどほど**:
- AOS の `fade-up`, `fade-in`, `zoom-in` をミックス
- ボタンの hover で transform: scale(1.05)
- ヘッダーのスクロール時背景変化 + box-shadow追加
- カードのホバーで浮き上がりエフェクト（translateY + shadow）

**しっかり**:
- 上記に加えてパララックス風の背景（CSS transform3d or IntersectionObserver）
- カウントアップ（IntersectionObserverで表示時に発火）
- スムーススクロール
- ギャラリーにSwiper.js
- テキストの1文字ずつ出現アニメーション
- グラデーション背景のアニメーション（background-size + animation）
- セクション間のSVGウェーブ区切り

### コード品質

- CSSはBEMライクなクラス命名（例: `.hero__title`, `.service__card`, `.pricing__plan--featured`）
- CSS変数を使ってカラーパレットを管理（`:root` で定義）
- CSSの記述順序: リセット → タイポグラフィ → レイアウト → コンポーネント → ユーティリティ → メディアクエリ
- JSは最小限にし、必要な機能のみ。body閉じタグ直前に配置
- コメントは日本語で要所に入れる（セクション区切りは `/* ===== セクション名 ===== */` 形式）
- `max-width: var(--container-width); margin: 0 auto;` でコンテナを統一

---

## Phase 4: 納品

1. 生成したHTMLファイルを保存する
2. ファイル名は `index.html` とする（ユーザーが別名を希望した場合はそちらに従う）
3. ユーザーにファイルリンクを提供する
4. 「画像はプレースホルダーになっているので、実際の写真に差し替えてお使いください」と伝える
5. カスタマイズのヒント（色の変更方法、セクションの追加・削除方法など）を簡潔に添える

---

## 補足: カラーパレット自動生成ルール

「おまかせ」の場合、以下の組み合わせルールで配色を決める：

| デザインテイスト | 推奨配色パターン |
|---|---|
| シンプル/ミニマル | 白基調 + グレー + 1アクセント色 |
| 高級感/ラグジュアリー | 黒 or 深色基調 + 金 or シャンパン + アイボリー |
| ナチュラル/オーガニック | アースカラー（ベージュ、グリーン、ブラウン） |
| ポップ/カラフル | 明るい多色（但し3色メインに絞る） |
| テック/近未来 | ダーク基調 + ネオン系アクセント（青/紫/緑） |
| 和風/ジャパニーズ | 和色（藍、朱、金、墨色、白磁） |
| ダーク/シネマティック | 黒基調 + 赤 or ゴールドのアクセント |
| かわいい/やわらかい | パステルカラー（ピンク、ラベンダー、ミントなど） |
| クール/スタイリッシュ | モノトーン + 1アクセント色 |

## 補足: フォント選定ガイド

Google Fontsから必ずロードする。システムフォントのみに頼らない：

| テイスト | 日本語フォント | 英字フォント |
|---|---|---|
| 高級感・和風 | Noto Serif JP, Shippori Mincho | Cormorant Garamond, Playfair Display |
| シンプル・テック | Noto Sans JP, Zen Kaku Gothic New | Inter, Space Grotesk |
| ナチュラル | Noto Sans JP (light weight) | Poppins, Quicksand |
| ポップ | Zen Maru Gothic | Nunito, Fredoka |
| クール | Noto Sans JP (medium weight) | Montserrat, Outfit |

---

## 重要な注意点

- ヒアリングの各フェーズは**AskUserQuestion**ツールを使って対話的に行う。テキストで長々と質問しない
- ユーザーが「おまかせ」「お任せ」と言ったら、業種やテイストから最適な選択をこちらで判断する
- キャッチコピーが「おまかせ」の場合は、業種・ターゲット・伝えたいことから3案程度提案して選んでもらう
- HTMLは必ず**実際にブラウザで表示して見栄えのするレベル**のものを生成する。中途半端なものは出さない
- 日本語サイトなので、`lang="ja"` の設定と日本語フォントの読み込みを忘れない
- モバイル表示（768px以下）では必ずハンバーガーメニューを実装する
- フッターには著作権表記、ナビゲーションリンク、SNSアイコンを含める
