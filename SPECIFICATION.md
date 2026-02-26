# Breeder Flow — システム仕様書

> **バージョン**: 0.7.0
> **最終更新**: 2026-02-26
> **プロジェクト名**: breeder-flow

---

## 1. 概要

### 1.1 システムの目的

ブリーダー向けHP制作・運用プラットフォーム。WordPress を使わず、LINE LIFF + Cloudflare エコシステム（Workers / D1 / R2 / Pages）で構築する。

ブリーダーは LINE からフォームを開き、子犬・子猫の情報を登録するだけで、静的サイトとして自動生成・デプロイされたHPに掲載される。

### 1.2 設計思想

| 原則 | 説明 |
|------|------|
| **WordPress不要** | 管理画面をブリーダーが使わないため、WordPressのオーバーヘッドを排除 |
| **LINE完結** | ブリーダーの操作はすべてLINE内で完結。パソコン不要 |
| **静的サイト** | 生成されたHTMLをCDN配信。高速・安全・低コスト |
| **ゼロに近いインフラコスト** | Cloudflare無料枠で30サイト以上を運用可能 |
| **自動化優先** | サイト追加・更新・デプロイをすべて自動化 |

### 1.3 旧システム（breeder-hp-creation）との比較

| 項目 | 旧（WordPress） | 新（breeder-flow） |
|------|-----------------|-------------------|
| CMS | WordPress + SWELL | 静的サイトジェネレーター（自作） |
| サーバー | お名前.com 共用サーバー（サイトごと） | Cloudflare Pages（全サイト共通） |
| DB | WordPress MySQL | Cloudflare D1（SQLite） |
| 画像 | WordPress Media Library | Cloudflare R2 |
| フォーム | Google Forms + GAS | LINE LIFF アプリ |
| 通知 | GAS → LINE Messaging API | Workers → LINE Messaging API |
| デプロイ | SSH + WP-CLI スクリプト | Workers → Pages Deploy API |
| コスト/30サイト | 月40,000〜65,000円 | **月1,000〜2,000円** |
| 保守工数/月 | 10〜15時間 | **1〜2時間** |

---

## 2. システムアーキテクチャ

### 2.1 全体構成図

```
┌─────────────────────────────────────────────────────────┐
│  ブリーダー（スマートフォン）                               │
│                                                           │
│  LINE アプリ                                              │
│   ├─ リッチメニュー「子犬を登録」                           │
│   │   └─ LIFF アプリが開く（LINE内ブラウザ）               │
│   │       ├─ 犬種/性別/誕生日/価格/説明文 を入力           │
│   │       ├─ 写真を選択（最大5枚）                         │
│   │       └─ 「登録」ボタン → API に送信                  │
│   │                                                       │
│   └─ 完了通知を受信（LINE メッセージ）                     │
└────────────────────────┬──────────────────────────────────┘
                         │ HTTPS POST
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Workers（API）                                │
│                                                           │
│  POST /api/animals       → 子犬/子猫の登録・更新・取り下げ │
│  POST /api/webhook/line  → LINE Webhook 受信               │
│  GET  /api/breeders/:id  → ブリーダー情報取得（管理用）     │
│  POST /api/sites/build   → サイト再ビルド・デプロイ         │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ D1 Database  │  │ R2 Storage   │  │ LINE API       │  │
│  │ (SQLite)     │  │ (画像)        │  │ (通知送信)      │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────────┘  │
└─────────┼─────────────────┼──────────────────────────────┘
          │                 │
          └────────┬────────┘
                   ▼
┌─────────────────────────────────────────────────────────┐
│  サイトジェネレーター                                      │
│                                                           │
│  テンプレート（HTML/CSS）                                  │
│    + D1 のデータ                                          │
│    + R2 の画像URL                                         │
│    → 静的HTML を生成                                      │
│    → Cloudflare Pages にデプロイ                           │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│  管理者ダッシュボード（Admin）                              │
│                                                           │
│  Cloudflare Pages にデプロイ                               │
│   ├─ ブリーダー管理（一覧・作成・詳細）                     │
│   ├─ サイト設定エディタ（テーマ・色・フォント・SEO）         │
│   ├─ お知らせエディタ                                      │
│   ├─ お客様の声エディタ                                    │
│   └─ デプロイログ                                          │
└─────────────────────────────────────────────────────────┘
          │ HTTPS (ADMIN_API_KEY)
          ▼
      Workers API
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Pages（ブリーダーHP）                          │
│                                                           │
│  https://xxx-kennel.com                                   │
│  ├─ index.html              （トップページ — 10セクション）│
│  ├─ about.html              （犬舎/猫舎紹介）             │
│  ├─ parents.html            （親犬・親猫紹介）             │
│  ├─ puppies/index.html      （子犬一覧 *breeder_type条件） │
│  ├─ puppies/xxx.html        （子犬詳細）                   │
│  ├─ kittens/index.html      （子猫一覧 *breeder_type条件） │
│  ├─ kittens/xxx.html        （子猫詳細）                   │
│  ├─ parents/xxx.html        （親犬/親猫詳細）              │
│  ├─ news/index.html         （お知らせ一覧）               │
│  ├─ flow.html               （お迎えの流れ・見学案内）      │
│  ├─ contact.html            （お問い合わせ）               │
│  ├─ testimonials/index.html （お客様の声）                 │
│  ├─ faq/index.html          （よくある質問 *条件付き）      │
│  ├─ legal.html              （動物取扱業者表記 *条件付き）  │
│  ├─ privacy.html            （プライバシーポリシー）        │
│  ├─ terms.html              （利用規約）                   │
│  ├─ 404.html                （エラーページ）               │
│  ├─ sitemap.xml / robots.txt                              │
│  ├─ _redirects              （/access.html → /flow.html） │
│  └─ _headers                （セキュリティヘッダー）        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技術スタック

| レイヤー | 技術 | 理由 |
|---------|------|------|
| 言語 | TypeScript | 型安全性、全コンポーネントで統一 |
| パッケージ管理 | pnpm + Turborepo | モノレポ管理 |
| API | Cloudflare Workers (Hono) | 軽量WebフレームワークでWorkers最適化 |
| DB | Cloudflare D1 (SQLite) | 無料、Workers統合、リレーショナル |
| 画像 | Cloudflare R2 | 安価、転送料なし、Workers統合 |
| サイト生成 | Mustache テンプレートエンジン | 軽量、高速、ロジックレスで安全 |
| ホスティング | Cloudflare Pages | 無料、グローバルCDN |
| フォーム | LINE LIFF v2 + React | LINE内で完結するWebアプリ |
| 管理画面 | React + Vite | ブリーダー管理・サイト設定 |
| 通知 | LINE Messaging API | プッシュ通知 |
| CI/CD | GitHub Actions | テスト、ビルド、デプロイ |

---

## 3. ディレクトリ構成

```
breeder-flow/
├── packages/
│   ├── api/                    # Cloudflare Workers API
│   │   ├── src/
│   │   │   ├── index.ts        # エントリーポイント (Hono)
│   │   │   ├── bindings.ts     # Workers バインディング型定義
│   │   │   ├── routes/
│   │   │   │   ├── animals.ts            # 子犬/子猫 CRUD（LIFF用）
│   │   │   │   ├── admin-animals.ts      # 管理者用動物 CRUD
│   │   │   │   ├── breeders.ts           # ブリーダー管理
│   │   │   │   ├── sites.ts              # サイトビルド・デプロイ・画像管理
│   │   │   │   ├── webhook.ts            # LINE Webhook
│   │   │   │   ├── announcements.ts      # お知らせ CRUD（管理者用）
│   │   │   │   ├── liff-announcements.ts # お知らせ CRUD（LIFF用）
│   │   │   │   ├── testimonials.ts       # お客様の声 CRUD
│   │   │   │   ├── faqs.ts              # FAQ CRUD
│   │   │   │   ├── pages.ts             # 固定ページ CRUD
│   │   │   │   ├── migration.ts         # 旧サイト移行ツール
│   │   │   │   ├── demo-scrape.ts       # デモサイトスクレイプ
│   │   │   │   └── animal-scrape.ts     # ポータルサイト動物情報スクレイプ
│   │   │   ├── services/
│   │   │   │   ├── line.ts           # LINE Messaging API
│   │   │   │   ├── builder.ts        # サイトビルダー
│   │   │   │   ├── deployer.ts       # Cloudflare Pages Deploy
│   │   │   │   ├── deploy-trigger.ts # ビルド・デプロイ共通トリガー
│   │   │   │   └── image.ts          # R2 画像アップロード・リサイズ
│   │   │   ├── lib/
│   │   │   │   ├── crypto.ts   # AES-256-GCM PII 暗号化
│   │   │   │   ├── mask.ts     # PII マスキング
│   │   │   │   └── retry.ts    # リトライ（指数バックオフ）
│   │   │   ├── db/
│   │   │   │   ├── schema.sql  # D1 スキーマ
│   │   │   │   └── queries.ts  # DB操作
│   │   │   └── middleware/
│   │   │       ├── auth.ts         # LIFF/Admin 認証
│   │   │       └── rate-limit.ts   # レート制限
│   │   ├── wrangler.toml       # Workers設定
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── liff/                   # LINE LIFF フォームアプリ
│   │   ├── src/
│   │   │   ├── App.tsx         # メインコンポーネント
│   │   │   ├── main.tsx        # エントリーポイント
│   │   │   ├── components/
│   │   │   │   ├── AnimalForm.tsx        # 動物登録フォーム
│   │   │   │   ├── AnimalList.tsx        # 動物一覧（更新/取り下げ選択）
│   │   │   │   ├── ImageUpload.tsx       # 画像アップロード
│   │   │   │   ├── StatusUpdate.tsx      # ステータス更新
│   │   │   │   ├── AnnouncementForm.tsx  # お知らせ作成フォーム
│   │   │   │   ├── AnnouncementList.tsx  # お知らせ一覧
│   │   │   │   ├── AnnouncementEdit.tsx  # お知らせ編集フォーム
│   │   │   │   ├── CompletionScreen.tsx  # 完了画面
│   │   │   │   └── ErrorBoundary.tsx     # エラーハンドリング
│   │   │   └── lib/
│   │   │       ├── liff.ts     # LIFF SDK初期化
│   │   │       └── api.ts      # API呼び出し
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── admin/                  # 管理者ダッシュボード
│   │   ├── src/
│   │   │   ├── App.tsx         # メインコンポーネント
│   │   │   ├── main.tsx        # エントリーポイント
│   │   │   ├── components/
│   │   │   │   ├── LoginScreen.tsx         # ログイン
│   │   │   │   ├── Dashboard.tsx           # ダッシュボード
│   │   │   │   ├── BreederList.tsx         # ブリーダー一覧
│   │   │   │   ├── BreederForm.tsx         # ブリーダー作成
│   │   │   │   ├── BreederDetail.tsx       # ブリーダー詳細（6タブ構成）
│   │   │   │   ├── SiteConfigEditor.tsx    # サイト設定エディタ
│   │   │   │   ├── SectionOrderEditor.tsx  # トップページセクション並び替え
│   │   │   │   ├── NavOrderEditor.tsx      # ナビゲーション項目並び替え
│   │   │   │   ├── AnnouncementEditor.tsx  # お知らせエディタ
│   │   │   │   ├── TestimonialEditor.tsx   # お客様の声エディタ
│   │   │   │   ├── FaqEditor.tsx           # FAQ エディタ
│   │   │   │   ├── AnimalEditor.tsx        # 動物情報 CRUD
│   │   │   │   ├── AnimalImageUpload.tsx   # 動物画像アップロード
│   │   │   │   ├── MigrationWizard.tsx     # 旧サイト移行ウィザード
│   │   │   │   ├── DeployLogList.tsx       # デプロイ履歴
│   │   │   │   └── ErrorBoundary.tsx       # エラーハンドリング
│   │   │   └── lib/
│   │   │       ├── auth.ts     # 認証管理
│   │   │       └── api.ts      # API呼び出し
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── generator/              # 静的サイトジェネレーター
│   │   ├── src/
│   │   │   ├── index.ts             # エントリーポイント（generateSite）
│   │   │   ├── engine.ts            # テンプレートヘルパー・動物データ加工
│   │   │   ├── pages.ts             # ページ生成ロジック
│   │   │   ├── seo.ts               # SEO（メタタグ・JSON-LD・サイトマップ）
│   │   │   ├── section-reorder.ts   # セクション並び替えエンジン
│   │   │   ├── template-registry.ts # テーマ選択・テンプレート取得
│   │   │   └── template-bundle.ts   # バンドル済みテンプレート（自動生成）
│   │   ├── scripts/
│   │   │   └── bundle-templates.ts  # テンプレートバンドルスクリプト
│   │   ├── templates/               # 3テーマ（後述 3.1）
│   │   │   ├── default/
│   │   │   ├── modern/
│   │   │   └── warm/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # 共通型定義・ユーティリティ
│       ├── src/
│       │   ├── index.ts        # エクスポート
│       │   ├── types.ts        # 共通型定義
│       │   ├── constants.ts    # 定数（ラベル、上限値、デフォルト設定）
│       │   └── validators.ts   # Zod バリデーションスキーマ
│       ├── package.json
│       └── tsconfig.json
│
├── SPECIFICATION.md            # 本ファイル（仕様書）
├── package.json                # ルートpackage.json（Turborepo）
├── pnpm-workspace.yaml
├── turbo.json
└── .github/
    └── workflows/
        └── deploy.yml          # CI/CD（lint・typecheck・デプロイ）
```

### 3.1 テンプレート構成（各テーマ共通）

```
templates/{theme}/
├── layout.html               # 共通レイアウト（head, header, footer）
├── partials/
│   ├── header.html           # ヘッダー・ナビゲーション（動的）
│   ├── footer.html           # フッター
│   ├── animal-card.html      # 動物カードコンポーネント
│   ├── breadcrumb.html       # パンくずナビ
│   ├── cookie-banner.html    # Cookie 同意バナー
│   └── custom-section.html   # カスタムセクション
├── pages/
│   ├── index.html            # トップページ（13セクション）
│   ├── about.html            # 犬舎/猫舎紹介
│   ├── animals.html          # 子犬一覧
│   ├── animal.html           # 子犬/子猫詳細
│   ├── kittens.html          # 子猫一覧
│   ├── parents.html          # 親犬・親猫紹介
│   ├── parent.html           # 親犬/親猫詳細（個別ページ）
│   ├── news.html             # お知らせ一覧
│   ├── flow.html             # お迎えの流れ・見学案内
│   ├── contact.html          # お問い合わせ
│   ├── testimonials.html     # お客様の声
│   ├── faq.html              # よくある質問
│   ├── legal.html            # 動物取扱業者表記
│   ├── privacy.html          # プライバシーポリシー
│   ├── terms.html            # 利用規約
│   ├── access.html           # アクセス（flow.html へのリダイレクト用）
│   └── 404.html              # エラーページ
└── assets/
    ├── css/
    │   └── style.css          # テーマ固有CSS
    └── js/
        └── main.js            # ハンバーガーメニュー・コンタクトフォーム自動入力・ヒーロースライドショー
```

---

## 4. データベース設計（D1）

### 4.1 テーブル一覧

#### breeders（ブリーダー）
```sql
CREATE TABLE breeders (
  id           TEXT PRIMARY KEY,           -- BREEDER001 等
  name         TEXT NOT NULL,              -- 犬舎名/キャッテリー名
  owner_name   TEXT,                       -- オーナー名（暗号化）
  email        TEXT,                       -- メールアドレス（暗号化）
  email_hash   TEXT,                       -- メールアドレスの SHA-256 ハッシュ（O(1)検索用）
  phone        TEXT,                       -- 電話番号（暗号化）
  line_user_id TEXT,                       -- LINE User ID
  breeder_type TEXT NOT NULL DEFAULT 'dog-only',  -- dog-only / cat-only / both
  license_no   TEXT,                       -- 動物取扱業登録番号（暗号化）
  license_type TEXT,                       -- 第一種動物取扱業（販売）等
  address      TEXT,                       -- 住所（暗号化）
  description  TEXT,                       -- 犬舎紹介文
  site_domain  TEXT UNIQUE,               -- xxx-kennel.com
  site_config  TEXT,                       -- JSON: テーマ設定、色、フォント等
  migration_checklist TEXT,               -- JSON: 移行チェックリスト
  status       TEXT NOT NULL DEFAULT 'active',  -- active / suspended / cancelled
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### animals（子犬/子猫/親犬/親猫）
```sql
CREATE TABLE animals (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id     TEXT NOT NULL REFERENCES breeders(id),
  animal_type    TEXT NOT NULL,             -- puppy / kitten / parent_dog / parent_cat
  animal_id      TEXT NOT NULL,             -- 個体識別名（ブリーダー内でユニーク）
  name           TEXT,                      -- 表示名（親犬/親猫用、最大50文字）
  breed          TEXT,                      -- 犬種/猫種
  sex            TEXT,                      -- male / female
  birth_date     TEXT,                      -- YYYY-MM-DD
  color          TEXT,                      -- 毛色
  price          INTEGER,                   -- 価格（円）、親犬は NULL
  description    TEXT,                      -- 説明文
  status         TEXT NOT NULL DEFAULT 'available',  -- available / reserved / sold / retired
  slug           TEXT,                      -- URLスラッグ（自動生成）
  published_at   TEXT,                      -- 公開日時
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(breeder_id, animal_id)
);
```

#### images（画像）
```sql
CREATE TABLE images (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id       INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  r2_key          TEXT NOT NULL,              -- R2 オブジェクトキー
  thumbnail_r2_key TEXT,                      -- サムネイル R2 オブジェクトキー
  filename        TEXT NOT NULL,              -- 元ファイル名
  mime_type       TEXT NOT NULL,              -- image/jpeg 等
  size_bytes      INTEGER,                    -- ファイルサイズ
  width           INTEGER,                    -- 画像幅
  height          INTEGER,                    -- 画像高さ
  sort_order      INTEGER NOT NULL DEFAULT 0, -- 表示順
  is_thumbnail    BOOLEAN NOT NULL DEFAULT 0, -- サムネイルフラグ
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### pages（固定ページ）
```sql
CREATE TABLE pages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id   TEXT NOT NULL REFERENCES breeders(id),
  slug         TEXT NOT NULL,              -- about, contact 等
  title        TEXT NOT NULL,              -- ページタイトル
  content      TEXT,                       -- HTMLコンテンツ
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(breeder_id, slug)
);
```

#### announcements（お知らせ）
```sql
CREATE TABLE announcements (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id   TEXT NOT NULL REFERENCES breeders(id),
  title        TEXT NOT NULL CHECK(length(title) <= 200),
  content      TEXT CHECK(length(content) <= 2000),
  published_at TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### testimonials（お客様の声）
```sql
CREATE TABLE testimonials (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id    TEXT NOT NULL REFERENCES breeders(id),
  customer_name TEXT NOT NULL CHECK(length(customer_name) <= 100),
  animal_name   TEXT CHECK(length(animal_name) <= 100),
  content       TEXT NOT NULL CHECK(length(content) <= 2000),
  rating        INTEGER CHECK(rating >= 1 AND rating <= 5),
  is_published  INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  received_at   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### faqs（よくある質問）
```sql
CREATE TABLE faqs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id  TEXT NOT NULL REFERENCES breeders(id),
  question    TEXT NOT NULL CHECK(length(question) <= 200),
  answer      TEXT NOT NULL CHECK(length(answer) <= 2000),
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### deploy_logs（デプロイ履歴）
```sql
CREATE TABLE deploy_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id   TEXT NOT NULL REFERENCES breeders(id),
  trigger_type TEXT NOT NULL,              -- animal_create / animal_update / manual / page_update / announcement_update
  trigger_id   TEXT,                       -- 契機となったanimal_id等
  status       TEXT NOT NULL DEFAULT 'pending',  -- pending / building / deployed / failed
  pages_url    TEXT,                       -- デプロイ先URL
  error        TEXT,                       -- エラー詳細
  retry_count  INTEGER NOT NULL DEFAULT 0, -- リトライ回数
  started_at   TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);
```

#### audit_logs（監査ログ）
```sql
CREATE TABLE audit_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp  TEXT NOT NULL DEFAULT (datetime('now')),
  actor_type TEXT NOT NULL,              -- breeder / admin / system / webhook
  actor_id   TEXT NOT NULL,              -- breeder_id or 'system'
  action     TEXT NOT NULL,              -- animal.create, site.build 等
  resource   TEXT NOT NULL,              -- animals, breeders 等
  resource_id TEXT,
  ip_address TEXT,
  details    TEXT                        -- JSON 追加情報
);
```

#### subscriptions（サブスクリプション / Stripe 課金管理）
```sql
CREATE TABLE subscriptions (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  breeder_id             TEXT NOT NULL UNIQUE REFERENCES breeders(id),
  stripe_customer_id     TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_plan      TEXT NOT NULL DEFAULT 'standard'
    CHECK(subscription_plan IN ('standard', 'premium')),
  subscription_status    TEXT NOT NULL DEFAULT 'incomplete'
    CHECK(subscription_status IN ('incomplete', 'active', 'past_due', 'canceled', 'unpaid', 'trialing')),
  current_period_start   TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### webhook_events（Webhook重複防止）
```sql
CREATE TABLE webhook_events (
  message_id  TEXT PRIMARY KEY,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 4.2 インデックス

```sql
CREATE INDEX idx_animals_breeder ON animals(breeder_id, animal_type, status);
CREATE INDEX idx_animals_slug ON animals(breeder_id, slug);
CREATE INDEX idx_images_animal ON images(animal_id, sort_order);
CREATE INDEX idx_pages_breeder ON pages(breeder_id, slug);
CREATE INDEX idx_deploy_breeder ON deploy_logs(breeder_id, started_at DESC);
CREATE INDEX idx_announcements_breeder ON announcements(breeder_id, is_published);
CREATE INDEX idx_testimonials_breeder ON testimonials(breeder_id, is_published);
CREATE INDEX idx_faqs_breeder ON faqs(breeder_id, is_published);
CREATE UNIQUE INDEX idx_breeders_line_user ON breeders(line_user_id)
  WHERE line_user_id IS NOT NULL;
CREATE INDEX idx_breeders_email_hash ON breeders(email_hash)
  WHERE email_hash IS NOT NULL;
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, timestamp DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_webhook_received ON webhook_events(received_at);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_subscriptions_status ON subscriptions(subscription_status);
```

---

## 5. API エンドポイント設計

### 5.1 動物登録 API

#### POST /api/animals
子犬/子猫/親犬/親猫を新規登録。

**認証**: LINE LIFF のアクセストークンで LINE User ID を検証 → breeder_id を特定

```json
// Request
{
  "action": "create",
  "animal_type": "puppy",
  "animal_id": "POODLE-2026-001",
  "breed": "トイプードル",
  "sex": "female",
  "birth_date": "2026-01-15",
  "color": "レッド",
  "price": 350000,
  "description": "おてんばな女の子です",
  "status": "available",
  "images": ["<base64>", "<base64>"]
}

// Response
{
  "success": true,
  "animal_id": 42,
  "slug": "poodle-2026-001",
  "message": "登録が完了しました",
  "deploy_status": "building"
}
```

#### PUT /api/animals/:id
情報の更新（ステータス変更、価格変更等）。

#### DELETE /api/animals/:id
取り下げ（ステータスを retired に変更、サイトから非表示）。

### 5.2 LINE Webhook

#### POST /api/webhook/line
LINE プラットフォームからの Webhook イベントを受信。

- **follow**: 友だち追加 → 案内メッセージ送信
- **message (text)**: メールアドレス送信 → ブリーダー照合 → LINE User ID 登録

### 5.2.5 Stripe Webhook

#### POST /api/webhook/stripe
Stripe からの Webhook イベントを受信・処理。

**認証**: `Stripe-Signature` ヘッダーで HMAC-SHA256 署名検証。タイムスタンプが5分以上古いイベントは拒否。

**処理するイベント**:
| イベント | 処理内容 |
|---------|---------|
| `checkout.session.completed` | `client_reference_id` からブリーダーを特定し、サブスクリプションを作成 |
| `customer.subscription.created` | サブスクリプション情報を upsert |
| `customer.subscription.updated` | ステータス・期間を更新、ブリーダーステータス連動 |
| `customer.subscription.deleted` | サブスクを `canceled` に更新、ブリーダーを `cancelled` に |
| `invoice.payment_succeeded` | サブスクを `active` に復帰 |
| `invoice.payment_failed` | 監査ログ記録（Stripe のリトライに任せる） |

**リプレイ攻撃防止**: `webhook_events` テーブルで `event.id` の重複を検知。

**実装ファイル**: `packages/api/src/routes/stripe-webhook.ts`

#### GET /api/breeders/:id/subscription
ブリーダーのサブスクリプション情報を取得。

### 5.3 サイト管理 API（管理者用）

#### POST /api/breeders
ブリーダーの新規登録。

#### GET /api/breeders/:id
ブリーダー情報の取得（PII マスキング済み）。

#### PUT /api/breeders/:id
ブリーダー情報の更新。

#### POST /api/sites/build
手動でサイトの再ビルドをトリガー。

#### GET /api/sites/:breederId/status
デプロイ状況の確認。

#### GET /api/sites/deploy-logs
デプロイログ一覧の取得。

**クエリパラメータ**: `status`, `breeder_id`, `limit`（デフォルト: 50）, `offset`（デフォルト: 0）

#### POST /api/sites/:breederId/upload-image
サイト画像（ヒーロー/ロゴ/挨拶写真）のアップロード。

```json
// Request
{
  "image_type": "hero",
  "base64": "<base64エンコードされた画像データ>"
}

// Response
{
  "success": true,
  "data": { "r2_key": "BREEDER001/site/hero/uuid.jpg" },
  "message": "画像をアップロードしました"
}
```

| 項目 | 仕様 |
|------|------|
| 許可する image_type | `hero`, `logo`, `greeting`, `facility` |
| R2 キー形式 | `{breederId}/site/{imageType}/{uuid}.{ext}` |
| サイズ上限 | 10MB（Base64 デコード後） |
| MIME 検証 | マジックバイト（JPEG, PNG, WebP） |
| EXIF 除去 | JPEG の場合は自動除去（GPS 位置情報漏洩防止） |
| 旧画像削除 | 同じ image_type の既存画像を自動削除 |
| site_config 更新 | `{imageType}_r2_key` フィールドを自動更新 |

#### DELETE /api/sites/:breederId/image/:imageType
サイト画像の削除。R2 から削除し、`site_config` から該当キーを除去する。

#### ヒーロー画像スライドショー

複数のヒーロー画像をスライドショーとして管理する。

##### POST /api/sites/:breederId/hero-images
ヒーロー画像の追加（最大 `MAX_HERO_IMAGES` = 5 枚）。

```json
// Request
{ "base64": "<base64エンコードされた画像データ>" }

// Response
{
  "success": true,
  "data": { "r2_key": "...", "hero_r2_keys": ["key1.jpg", "key2.jpg"] },
  "message": "ヒーロー画像を追加しました"
}
```

##### DELETE /api/sites/:breederId/hero-images/:index
ヒーロー画像の削除（インデックス指定）。R2 からも削除する。

##### PUT /api/sites/:breederId/hero-images/order
ヒーロー画像の並び替え。

```json
// Request
{ "hero_r2_keys": ["key2.jpg", "key1.jpg"] }
```

キーの構成が現在の画像と一致していること（並び替えのみ）をバリデーション。

#### 施設画像

施設の写真を複数管理する。

##### POST /api/sites/:breederId/facility-images
施設画像の追加（最大 `MAX_FACILITY_IMAGES` = 3 枚）。

```json
// Request
{ "base64": "<base64エンコードされた画像データ>" }
```

##### DELETE /api/sites/:breederId/facility-images/:index
施設画像の削除（インデックス指定）。

### 5.4 お知らせ API（管理者用）

#### GET /api/announcements?breeder_id=XXX
ブリーダーのお知らせ一覧を取得。

#### POST /api/announcements
お知らせを新規作成。

```json
{
  "breeder_id": "BREEDER001",
  "title": "新しい子犬が生まれました",
  "content": "トイプードルの子犬が3匹誕生しました。",
  "published_at": "2026-02-15",
  "is_published": true
}
```

#### PUT /api/announcements/:id
お知らせの更新。

#### DELETE /api/announcements/:id
お知らせの削除。

### 5.5 お客様の声 API（管理者用）

#### GET /api/testimonials?breeder_id=XXX
ブリーダーのお客様の声一覧を取得。

#### POST /api/testimonials
お客様の声を新規作成。

```json
{
  "breeder_id": "BREEDER001",
  "customer_name": "田中太郎",
  "animal_name": "ポチ",
  "content": "元気で可愛い子犬をお迎えできました。",
  "rating": 5
}
```

#### PUT /api/testimonials/:id
お客様の声の更新。

#### DELETE /api/testimonials/:id
お客様の声の削除。

### 5.6 固定ページ API（管理者用）

#### GET /api/pages?breeder_id=XXX
ブリーダーの固定ページ一覧を取得。

#### POST /api/pages
固定ページを新規作成。

#### PUT /api/pages/:id
固定ページの更新。

#### DELETE /api/pages/:id
固定ページの削除。

### 5.7 FAQ API（管理者用）

#### GET /api/faqs?breeder_id=XXX
ブリーダーの FAQ 一覧を取得。

#### POST /api/faqs
FAQ を新規作成。

```json
{
  "breeder_id": "BREEDER001",
  "question": "子犬の見学は予約制ですか？",
  "answer": "はい、LINEまたはお電話でご予約ください。",
  "is_published": true,
  "sort_order": 0
}
```

#### PUT /api/faqs/:id
FAQ の更新。

#### DELETE /api/faqs/:id
FAQ の削除。

### 5.8 LIFF お知らせ API（ブリーダー用）

ブリーダーが LINE LIFF 経由で自身のお知らせを管理する。認証は LIFF トークンで行い、`breeder_id` は自動判定される。
お知らせの作成・更新・削除時に自動でサイト再ビルド・デプロイがトリガーされる。

#### GET /api/liff/announcements
自ブリーダーのお知らせ一覧を取得。

#### POST /api/liff/announcements
お知らせを新規作成。作成後にサイトを自動デプロイ。

```json
{
  "title": "新しい子犬が生まれました",
  "content": "トイプードルの子犬が3匹誕生しました。"
}
```

#### PUT /api/liff/announcements/:id
お知らせの更新。更新後にサイトを自動デプロイ。所有権チェックあり。

#### DELETE /api/liff/announcements/:id
お知らせの削除。削除後にサイトを自動デプロイ。所有権チェックあり。

### 5.9 管理者用動物 API

管理者が Admin UI から動物の登録・更新・削除を行う。認証は `ADMIN_API_KEY`。

#### GET /api/admin/animals?breeder_id=XXX&animal_type=&status=
ブリーダーの動物一覧を取得（画像情報付き）。`animal_type` と `status` でフィルタ可能。

#### POST /api/admin/animals
管理者による動物の新規登録。画像アップロード対応。登録後にサイトを自動デプロイ。

```json
{
  "breeder_id": "BREEDER001",
  "animal_type": "puppy",
  "animal_id": "POODLE-2026-001",
  "breed": "トイプードル",
  "sex": "female",
  "birth_date": "2026-01-15",
  "color": "レッド",
  "price": 350000,
  "description": "おてんばな女の子です",
  "images": ["<base64>"]
}
```

#### PUT /api/admin/animals/:id
管理者による動物情報の更新。画像の差し替え対応。更新後にサイトを自動デプロイ。

#### DELETE /api/admin/animals/:id
管理者による動物の削除。R2 の画像も削除し、サイトを自動デプロイ。

### 5.10 移行 API（管理者用）

旧サイト（WordPress 等）からの移行を支援するツール。

#### POST /api/migration/crawl
既存サイトをクロールしてコンテンツを抽出する。

```json
// Request
{ "url": "https://old-kennel.com" }

// Response
{
  "success": true,
  "data": {
    "siteInfo": { "title": "旧サイト名", "description": "メタディスクリプション" },
    "pages": [
      {
        "url": "https://old-kennel.com/about",
        "title": "犬舎紹介",
        "content": "テキストコンテンツ...",
        "images": ["https://old-kennel.com/img/photo.jpg"],
        "suggestedType": "about"
      }
    ],
    "suggestedRedirects": [
      { "from": "/about", "to": "/about.html", "status": 301 }
    ]
  }
}
```

| 項目 | 仕様 |
|------|------|
| 最大クロールページ数 | 50 |
| ページ種別自動判定 | about / puppies / news / testimonials / faq / contact / other |
| フェッチタイムアウト | 5秒 |
| リダイレクト提案 | URL パスパターンから自動生成 |

#### POST /api/migration/verify
移行完了後の検証を行う。DNS / HTTP、sitemap.xml、robots.txt、リダイレクトの正常性を確認。

```json
// Request
{ "breeder_id": "BREEDER001", "domain": "new-kennel.com" }

// Response
{
  "success": true,
  "data": {
    "checks": [
      { "name": "DNS / HTTP", "status": "pass", "detail": "https://new-kennel.com returned 200" },
      { "name": "sitemap.xml", "status": "pass", "detail": "..." },
      { "name": "robots.txt", "status": "warn", "detail": "..." },
      { "name": "Redirect /about", "status": "pass", "detail": "..." }
    ]
  }
}
```

### 5.11 デモスクレイプ API（管理者用）

デモサイト用のデータをポータルサイトからスクレイプする。

#### POST /api/demo-scrape/*
デモ用データの取得・生成。

### 5.12 動物情報スクレイプ API（管理者用）

ポータルサイト（みんなのブリーダー等）から動物情報を抽出する。

#### POST /api/animal-scrape/extract
指定 URL から動物情報（犬種、性別、誕生日、価格、画像等）を抽出する。

```json
// Request
{ "url": "https://www.min-breeder.com/dog/xxx" }

// Response
{
  "success": true,
  "data": {
    "breed": "トイプードル",
    "sex": "female",
    "birth_date": "2026-01-15",
    "color": "レッド",
    "price": 350000,
    "description": "...",
    "images": ["https://..."]
  }
}
```

---

## 6. LINE LIFF フォーム

### 6.1 概要

LINE アプリ内で開くWebアプリケーション（LIFF = LINE Front-end Framework）。
ブリーダーが子犬/子猫の情報を入力するためのフォーム。

### 6.2 画面遷移

```
LINEリッチメニュー
  └─ 「子犬/子猫を登録」タップ
       └─ LIFF アプリ起動
            ├─ 操作選択画面
            │   ├─ 新規登録 → 登録フォーム
            │   ├─ 情報更新 → 個体選択 → 更新フォーム
            │   ├─ 取り下げ → 個体選択 → 確認画面
            │   └─ お知らせ管理 → お知らせ一覧
            │       ├─ 新規作成 → お知らせ作成フォーム → 完了（自動デプロイ）
            │       ├─ 編集 → お知らせ編集フォーム → 完了（自動デプロイ）
            │       └─ 削除 → 確認画面 → 完了（自動デプロイ）
            │
            ├─ 登録フォーム
            │   ├─ 登録種別（子犬/子猫/親犬/親猫）
            │   ├─ 個体識別名
            │   ├─ 名前（親犬/親猫のみ表示）
            │   ├─ 犬種/猫種
            │   ├─ 性別（オス/メス）
            │   ├─ 誕生日
            │   ├─ 毛色
            │   ├─ 価格
            │   ├─ 説明文
            │   ├─ 写真アップロード（最大5枚）
            │   └─ 「登録する」ボタン
            │
            └─ 完了画面
                ├─ 「登録が完了しました！」
                ├─ 公開ページへのリンク
                └─ 「LINEに戻る」ボタン
```

### 6.3 技術仕様

| 項目 | 仕様 |
|------|------|
| LIFF SDK | v2.x |
| フレームワーク | React + Vite |
| UI | カスタム CSS |
| 画像プレビュー | ブラウザ側でリサイズ（max 1920px） |
| 認証 | LIFF のログイン情報から LINE User ID を取得 |
| API通信 | fetch → Workers API |

### 6.4 コンポーネント一覧

| コンポーネント | 役割 |
|--------------|------|
| `AnimalForm.tsx` | 動物登録フォーム（新規・更新兼用） |
| `AnimalList.tsx` | 動物一覧（更新/取り下げ対象の選択） |
| `ImageUpload.tsx` | 画像アップロード（プレビュー・複数枚対応） |
| `StatusUpdate.tsx` | ステータス更新 |
| `AnnouncementForm.tsx` | お知らせ作成フォーム |
| `AnnouncementList.tsx` | お知らせ一覧（更新/削除対象の選択） |
| `AnnouncementEdit.tsx` | お知らせ編集フォーム |
| `CompletionScreen.tsx` | 完了画面（成功メッセージ・リンク） |
| `ErrorBoundary.tsx` | エラーハンドリング |

---

## 6.5 管理者ダッシュボード

### 概要

ブリーダーの管理・サイト設定・コンテンツ編集を行う管理者専用のWebアプリケーション。
React + Vite で構築し、Cloudflare Pages にデプロイ。

### 認証方式

二重認証:
1. **Cloudflare Access**（メールOTP）で `admin.breeders-flow.com` へのアクセスを制限
2. **`ADMIN_API_KEY`** を Bearer トークンとしてログイン画面で入力し、ローカルストレージに保存

### 画面一覧

| 画面 | コンポーネント | 機能 |
|------|-------------|------|
| ログイン | `LoginScreen.tsx` | API キー入力・認証 |
| ダッシュボード | `Dashboard.tsx` | ブリーダー数・デプロイ統計・最近のアクティビティ |
| ブリーダー一覧 | `BreederList.tsx` | 全ブリーダーの一覧表示・検索 |
| ブリーダー作成 | `BreederForm.tsx` | 新規ブリーダー登録フォーム |
| ブリーダー詳細 | `BreederDetail.tsx` | 7タブ構成（基本情報/動物管理/サイト設定/コンテンツ/デプロイ/課金/移行） |
| サイト設定 | `SiteConfigEditor.tsx` | テーマ・色・フォント・ロゴ・SNS・SEO・挨拶文・こだわり・施設・お迎えの流れ |
| セクション順序 | `SectionOrderEditor.tsx` | トップページセクションの並び替え・表示/非表示・タイトルカスタマイズ |
| ナビ順序 | `NavOrderEditor.tsx` | ナビゲーション項目の並び替え・カスタマイズ |
| お知らせ | `AnnouncementEditor.tsx` | お知らせの CRUD |
| お客様の声 | `TestimonialEditor.tsx` | お客様の声の CRUD |
| FAQ | `FaqEditor.tsx` | よくある質問の CRUD |
| 動物管理 | `AnimalEditor.tsx` | 動物情報の CRUD（画像アップロード付き） |
| 動物画像 | `AnimalImageUpload.tsx` | 動物画像のアップロード・管理 |
| 移行ウィザード | `MigrationWizard.tsx` | 旧サイトクロール・検証・移行チェックリスト |
| デモスクレイプ | `DemoScrapeWizard.tsx` | ポータルサイトからのデモデータ取得 |
| デプロイ履歴 | `DeployLogList.tsx` | デプロイログの表示・手動リビルド |
| エラー | `ErrorBoundary.tsx` | エラーハンドリング |

### 課金タブ（Billing）

ブリーダー詳細画面の「課金」タブで以下を提供:

**サブスクリプション情報表示**:
- プラン（スタンダード / プレミアム）
- ステータス（有効 / 支払い遅延 / 解約済み 等）
- 請求期間（開始 / 終了）
- Stripe Customer ID（Stripe ダッシュボードへのリンク付き）

**決済リンク生成**（サブスクが未設定 or `incomplete` 時に表示）:
- プラン選択ボタン（スタンダード / プレミアム）
- `Stripe Payment Link URL + ?client_reference_id={breederId}` を自動生成
- ワンクリックでクリップボードにコピー
- 環境変数: `VITE_STRIPE_LINK_STANDARD`, `VITE_STRIPE_LINK_PREMIUM`

---

## 7. サイトジェネレーター

### 7.1 概要

テンプレート（HTML/CSS）+ データ（D1） + 画像（R2 URL）から、ブリーダーごとの静的サイト（HTML一式）を生成する。

テンプレートエンジンには **Mustache** を使用。ロジックレス設計により XSS リスクを低減。

### 7.2 生成フロー

```
1. D1 からブリーダー情報・動物情報・画像情報・お知らせ・お客様の声・FAQを取得
2. site_config からテーマ設定（色、フォント、レイアウト等）を読み込み
3. テンプレートバンドルからテーマのテンプレート一式を取得
4. データを加工（enrichAnimal: 年齢計算、ラベル変換、detail_path 等）
5. home_sections に基づいてセクション順序を決定（section-reorder.ts）
6. Mustache にデータをバインドして HTML を生成（16ページ + 詳細ページ）
7. CSS に色変数・カスタムCSS を注入
8. sitemap.xml, robots.txt, _headers, _redirects を生成
9. Cloudflare Pages Deploy API でデプロイ
```

### 7.3 テンプレートバンドルシステム

テンプレートファイル（HTML/CSS/JS）はビルド時にバンドルされ、TypeScript モジュールとして組み込まれる。

```
pnpm run prebuild
  └─ scripts/bundle-templates.ts が実行
       └─ templates/{theme}/ のファイルを読み込み
            └─ src/template-bundle.ts を自動生成
```

`template-registry.ts` が `site_config.template` に基づいてテーマを選択する。

### 7.4 テンプレート変数（Mustache 構文）

```html
<!-- 例: animal-card.html -->
<a href="{{detail_path}}" class="animal-card">
  {{#has_images}}
  <img src="{{thumbnail}}" alt="{{breed}}" loading="lazy">
  {{/has_images}}
  <div class="card-body">
    <h3>{{breed}} / {{animal_id}}</h3>
    <p class="meta">{{sex_label}} / {{age_label}}</p>
    {{#has_price}}<p class="price">{{formatted_price}}</p>{{/has_price}}
    <span class="status-badge status-{{status}}">{{status_label}}</span>
  </div>
</a>
```

条件分岐は `{{#flag}}...{{/flag}}`、否定は `{{^flag}}...{{/flag}}`。
Raw HTML 出力は `{{{variable}}}`（google_maps_embed 等の限定的な用途のみ）。

### 7.5 3テーマ対応

| テーマ | 日本語名 | 特徴 | デザイン |
|--------|---------|------|---------|
| `default` | デフォルト | プレミアム・ダーク | 黒背景(#0A0A0A)、金アクセント(#D4AF37)、明朝体(Shippori Mincho)、ミニマル(border-radius: 2px) |
| `modern` | モダン | ミニマル | 白背景(#ffffff)、インディゴアクセント(#6366f1)、ゴシック体(Noto Sans JP)、角型 |
| `warm` | ウォーム | やわらかい | クリーム背景(#fdfbf7)、セージグリーン(#84a98c)、丸ゴシック(Yomogi/Zen Maru Gothic)、丸角16px |

各テーマは同一の HTML 構造を持ち、CSS のみが異なる。

#### テンプレート定数

```typescript
// packages/shared/src/constants.ts

export const BUILT_IN_TEMPLATES = ['default', 'modern', 'warm'] as const;

export const TEMPLATE_LABELS: Record<string, string> = {
  default: 'デフォルト',
  modern: 'モダン',
  warm: 'ウォーム',
};

export const TEMPLATE_DEFAULTS: Record<string, {
  colors: { primary: string; secondary: string; accent: string; text: string; background: string };
  fonts: { heading: string; body: string };
}> = {
  default: {
    colors: { primary: '#D4AF37', secondary: '#1F1F1F', accent: '#D4AF37', text: '#E5E5E5', background: '#0A0A0A' },
    fonts: { heading: 'Shippori Mincho', body: 'Shippori Mincho' },
  },
  modern: {
    colors: { primary: '#1f2937', secondary: '#f3f4f6', accent: '#6366f1', text: '#1f2937', background: '#ffffff' },
    fonts: { heading: 'Noto Sans JP', body: 'Noto Sans JP' },
  },
  warm: {
    colors: { primary: '#84a98c', secondary: '#cad2c5', accent: '#d4a373', text: '#4a403a', background: '#fdfbf7' },
    fonts: { heading: 'Yomogi', body: 'Zen Maru Gothic' },
  },
};
```

#### テンプレート切替時の動作

テンプレートを変更した場合、colors / fonts はテンプレートデフォルトにリセットされる:

- **Admin UI** (`SiteConfigEditor.tsx`): テンプレートボタン押下時に `colors` / `fonts` state をリセット
- **API PUT /api/breeders/:id** (`breeders.ts`): `template` が変更された場合、`TEMPLATE_DEFAULTS` の colors / fonts を適用
- **ビルド時** (`builder.ts`): `TEMPLATE_DEFAULTS` をベースに `site_config` をマージ

### 7.6 カスタマイズ可能な項目（site_config）

```json
{
  "template": "default",
  "colors": {
    "primary": "#84a98c",
    "secondary": "#cad2c5",
    "accent": "#d4a373",
    "text": "#4a403a",
    "background": "#fdfbf7"
  },
  "fonts": {
    "heading": "Zen Maru Gothic",
    "body": "Noto Sans JP"
  },
  "logo_r2_key": "breeders/BREEDER001/logo.png",
  "hero_r2_key": "breeders/BREEDER001/hero.jpg",
  "hero_r2_keys": ["hero1.jpg", "hero2.jpg", "hero3.jpg"],
  "hero_show_description": false,
  "social": {
    "instagram": "https://instagram.com/xxx",
    "line_url": "https://line.me/xxx"
  },
  "google_maps_embed": "<iframe ...>",
  "ga4_id": "G-XXXXXXXX",
  "custom_css": "/* ブリーダー固有のCSS */",
  "seo": {
    "site_description": "手動で設定するサイト説明文",
    "keywords": "手動キーワード",
    "og_image_r2_key": "breeders/BREEDER001/og.jpg",
    "canonical_base_url": "https://xxx-kennel.com"
  },
  "greeting": {
    "message": "代表挨拶メッセージ",
    "representative_name": "代表者名",
    "photo_r2_key": "breeders/BREEDER001/greeting.jpg",
    "registration_number": "動物取扱業登録番号"
  },
  "commitments": [
    { "title": "健康第一", "description": "遺伝子検査を実施しています" }
  ],
  "facility": {
    "description": "施設の紹介文",
    "facility_r2_keys": ["facility1.jpg", "facility2.jpg"]
  },
  "adoption_flow": [
    { "step_number": 1, "title": "お問い合わせ", "description": "LINEでご連絡ください" },
    { "step_number": 2, "title": "見学", "description": "実際に会いに来てください" },
    { "step_number": 3, "title": "ご契約", "description": "書類の準備をお願いします" },
    { "step_number": 4, "title": "お迎え", "description": "新しい家族をお迎えください" }
  ],
  "sections": {
    "testimonials": true,
    "faq": true
  },
  "redirects": [
    { "from": "/old-page", "to": "/new-page", "status": 301 }
  ],
  "tokushoho": {
    "payment_methods": "銀行振込・クレジットカード",
    "payment_timing": "契約時",
    "delivery_timing": "見学当日〜1週間以内",
    "return_policy": "動物愛護法に基づきお受けできません",
    "additional_fees": "ワクチン接種費用等"
  },
  "home_sections": [
    { "id": "hero", "visible": true },
    { "id": "animals", "visible": true, "title": "子犬・子猫のご紹介" },
    { "id": "announcements", "visible": true },
    { "id": "welcome", "visible": true },
    { "id": "commitments", "visible": true },
    { "id": "greeting", "visible": true },
    { "id": "facility", "visible": true },
    { "id": "breeds", "visible": true },
    { "id": "flow", "visible": true },
    { "id": "faq", "visible": true },
    { "id": "testimonials", "visible": true },
    { "id": "map", "visible": true },
    { "id": "contact", "visible": true }
  ],
  "nav_order": [
    { "id": "animals", "label": "子犬・子猫", "href": "/#animals" },
    { "id": "about", "label": "ブリーダー紹介", "href": "/about.html" },
    { "id": "flow", "label": "お迎えの流れ", "href": "/#flow" },
    { "id": "contact", "label": "お問い合わせ", "href": "/contact.html" }
  ]
}
```

#### hero_r2_keys（ヒーロー画像スライドショー）

| 項目 | 仕様 |
|------|------|
| 最大枚数 | `MAX_HERO_IMAGES` = 5 |
| 後方互換 | `hero_r2_key`（単一）と `hero_r2_keys`（配列）を同期管理 |
| 表示 | テンプレートでスライドショー表示 |

#### facility.facility_r2_keys（施設画像）

| 項目 | 仕様 |
|------|------|
| 最大枚数 | `MAX_FACILITY_IMAGES` = 3 |
| 格納場所 | `facility` オブジェクト内 |

#### home_sections（セクション並び替え）

トップページの各セクションの表示順・表示/非表示・タイトルをカスタマイズする。

| 項目 | 仕様 |
|------|------|
| ビルトインセクション数 | 13（hero, animals, announcements, welcome, commitments, greeting, facility, breeds, flow, faq, testimonials, map, contact） |
| タイトルカスタマイズ | `title` フィールドで各セクションの見出しを変更可能 |
| 英語サブタイトル | `subtitle_en` フィールドで英語サブタイトルを設定可能 |
| 並び順 | 配列の順序で表示順を制御 |
| 表示制御 | `visible: false` で非表示 |

#### nav_order（ナビゲーションカスタマイズ）

ヘッダーナビゲーションの項目をカスタマイズする。

| 項目 | 仕様 |
|------|------|
| デフォルト | 子犬・子猫 / ブリーダー紹介 / お迎えの流れ / お問い合わせ |
| カスタマイズ | `id`, `label`, `href` で自由に設定可能 |

#### tokushoho（特定商取引法に基づく表記）

| フィールド | 説明 |
|-----------|------|
| `payment_methods` | 支払い方法 |
| `payment_timing` | 支払い時期 |
| `delivery_timing` | 引渡時期 |
| `return_policy` | 返品・交換について |
| `additional_fees` | 送料以外の追加費用 |

### 7.7 生成ページ一覧

| # | ページ | URL | 生成条件 | 主要データ |
|---|--------|-----|---------|-----------|
| 1 | トップ | `/` | 常時 | 子犬/子猫（各6件）、お知らせ（5件）、お客様の声（6件）、FAQ、挨拶、こだわり、施設、犬種/猫種 |
| 2 | 犬舎/猫舎紹介 | `/about.html` | 常時 | description、greeting、commitments、facility、breedGroups、license |
| 3 | 子犬一覧 | `/puppies/` | `hasDogs` | 全子犬 |
| 4 | 子猫一覧 | `/kittens/` | `hasCats` | 全子猫 |
| 5 | 子犬詳細 | `/puppies/{slug}.html` | 子犬ごと | 個体情報、画像一覧 |
| 6 | 子猫詳細 | `/kittens/{slug}.html` | 子猫ごと | 個体情報、画像一覧 |
| 7 | 親犬・親猫 | `/parents.html` | 常時 | parentDogs、parentCats |
| 7a | 親犬詳細 | `/parents/{slug}.html` | 親犬ごと | 個体情報（名前・犬種・画像等） |
| 7b | 親猫詳細 | `/parents/{slug}.html` | 親猫ごと | 個体情報（名前・猫種・画像等） |
| 8 | お知らせ | `/news/` | 常時 | 全お知らせ（日付降順） |
| 9 | お迎えの流れ | `/flow.html` | 常時 | adoption_flow、address、Google Maps |
| 10 | お問い合わせ | `/contact.html` | 常時 | LINE、電話、メール、Instagram |
| 11 | お客様の声 | `/testimonials/` | 常時 | 全お客様の声（星評価付き） |
| 12 | よくある質問 | `/faq/` | `hasFaqs` | 全FAQ（FAQ JSON-LD 構造化データ付き） |
| 13 | 動物取扱業者表記 | `/legal.html` | `hasLegal` | license_no、license_type、address 等 |
| 14 | プライバシーポリシー | `/privacy.html` | 常時 | 犬舎名、サイトドメイン |
| 15 | 利用規約 | `/terms.html` | 常時 | 犬舎名、サイトドメイン |
| 16 | 404エラー | `/404.html` | 常時 | ホームへのリンク |

**生成条件フラグ**:
- `hasDogs`: `breeder_type !== 'cat-only'`
- `hasCats`: `breeder_type !== 'dog-only'`
- `hasFaqs`: FAQ が1件以上存在
- `hasLegal`: `license_no` または `license_type` が存在

**ナビゲーション動的制御**:
- ヘッダーナビは `nav_order` でカスタマイズ可能（未設定時はデフォルト4項目）
- デフォルトナビ: 子犬・子猫 / ブリーダー紹介 / お迎えの流れ / お問い合わせ
- `hasDogs`, `hasCats`, `hasNewsPage` で表示を切り替え
- ラベルも `breeder_type` で変化: 犬舎紹介 / 猫舎紹介 / ブリーダー紹介

**パンくずナビ**:
- 全ページに `breadcrumb.html` パーシャルでパンくずを表示
- JSON-LD `BreadcrumbList` 構造化データも同時生成

#### コンタクトフォーム自動入力

動物詳細ページのお問い合わせリンクにクエリパラメータを付与し、コンタクトフォームの入力を自動補完する。

| パラメータ | 対象フィールド | 動作 |
|-----------|-------------|------|
| `breed` | 犬種/猫種フィールド（`#contact-breed`） | 値を自動入力 |
| `animal_id` | メッセージ欄（`#contact-message`） | `個体ID: {animal_id} について問い合わせます。` を自動入力 |

**リンク形式**:
- 子犬/子猫詳細: `/contact.html?breed={breed}&animal_id={animal_id}`
- 親犬/親猫詳細: `/contact.html?breed={breed}`

**実装ファイル**: `templates/{theme}/assets/js/main.js`

### 7.8 SEO 機能

#### メタタグ自動生成

`representative_name`（`config.greeting.representative_name`）が設定されている場合、指名検索対策としてタイトル・メタディスクリプション・キーワードに代表者名を含める。

| 項目 | 生成ロジック |
|------|------------|
| `<title>` (トップ) | `{犬舎名} \| {ブリーダー種別} {代表者名} \| {地域}` ※60文字制限内で段階的フォールバック |
| `<title>` (紹介) | `{紹介ラベル} {代表者名} \| {犬舎名}` ※紹介ラベルは breeder_type により動的生成（犬舎紹介/猫舎紹介/ブリーダー紹介） |
| `<title>` (その他) | `{ページ名} \| {犬舎名}` |
| `<meta name="description">` (トップ) | `{代表者名}が運営する{犬舎名}は{地域}の{ブリーダー種別}です。{犬種}の子犬・子猫をご紹介しています。` |
| `<meta name="description">` (紹介) | `{犬舎名}の代表、{代表者名}の{紹介ラベル}ページです。{description}` |
| `<meta name="keywords">` | 犬舎名、代表者名、犬種/猫種、地域、ブリーダー種別から自動生成（手動上書き可） |

**代表者名が未設定の場合**: 従来と同じ動作（名前なし）にフォールバック。
**カスタム `seo.site_description`**: 設定されている場合はトップ・紹介ページのメタディスクリプションを上書き。

#### OGP / Twitter Card

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="{犬舎名}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
```

#### JSON-LD 構造化データ

| ページ | スキーマ | 内容 |
|--------|---------|------|
| トップ | `LocalBusiness` / `PetStore` | 犬舎名、住所、電話番号、説明 |
| 動物詳細 | `Product` | 品種、価格、在庫状況、画像 |
| 一覧ページ | `ItemList` | 掲載動物のリスト |
| よくある質問 | `FAQPage` | 質問と回答の構造化データ |
| 全ページ | `BreadcrumbList` | パンくずナビ構造 |

#### サイトマップ・robots.txt

- `sitemap.xml`: 全ページを `<url>` で列挙、`<priority>` と `<changefreq>` 付き
- `robots.txt`: `Sitemap:` ヘッダーを含む
- 条件付きページ（puppies, kittens, legal）は生成時のみサイトマップに含む

---

## 8. デプロイメント

### 8.1 サイトのデプロイ方式

各ブリーダーのサイトは **Cloudflare Pages のプロジェクト** として管理。

```
動物登録/更新
    ↓
Workers API が受信
    ↓
D1 にデータ保存 / R2 に画像保存
    ↓
サイトジェネレーターが HTML 一式を生成
    ↓
Cloudflare Pages Direct Upload API でデプロイ
    ↓
LINE で完了通知（公開URL付き）
```

### 8.2 カスタムドメイン

各ブリーダーのサイトには独自ドメインを設定。
Cloudflare Pages のカスタムドメイン機能を利用。

```
xxx-kennel.com → Cloudflare Pages (breeder-xxx プロジェクト)
```

Cloudflare Registrar でドメインを取得・管理すると DNS 設定も自動化できる。

---

## 9. 開発ロードマップ

### Phase 1: MVP ✅ 完了
- [x] モノレポ構成・TypeScript設定
- [x] D1 スキーマ作成（10テーブル）
- [x] Workers API（動物登録・取得）
- [x] R2 画像アップロード・サムネイル生成
- [x] テンプレートエンジン（Mustache、default テンプレート）
- [x] サイト生成・デプロイ（Cloudflare Pages Direct Upload）
- [x] LINE LIFF フォーム（登録・更新・取り下げ）
- [x] LINE Webhook（友だち追加・User ID連携）
- [x] LINE 完了通知

### Phase 2: 運用準備 ✅ 完了
- [x] 管理者ダッシュボード（React + Vite、10画面）
- [x] ブリーダー追加の自動化
- [x] 画像リサイズ・最適化（Sharp）
- [x] エラーハンドリング・リトライ（指数バックオフ）
- [x] アクセス解析（GA4埋め込み対応）
- [x] PII 暗号化（AES-256-GCM）
- [x] 監査ログ
- [x] レート制限

### Phase 3: テンプレート拡充 ✅ 完了
- [x] テンプレートバリエーション追加（default, modern, warm の3テーマ）
- [x] カスタムCSS対応
- [x] SEO最適化（メタタグ、OGP、サイトマップ、JSON-LD 構造化データ）
- [x] トップページ 10セクション構成（ヒーロー、ウェルカム、子犬、子猫、お知らせ、挨拶、こだわり、お迎えの流れ、お客様の声、CTA）
- [x] 個別ページ 13ページ構成（子犬/子猫分離、お知らせ、お迎えの流れ、お客様の声、動物取扱業者表記、404）
- [x] お知らせ管理機能（DB + API + 管理画面 + サイト表示）
- [x] お客様の声管理機能（DB + API + 管理画面 + サイト表示）
- [x] breeder_type に応じた動的ナビゲーション
- [x] パンくずナビ（HTML + JSON-LD）

### Phase 4: テンプレート改良・画像管理・SEO 強化 ✅ 完了
- [x] デフォルトテンプレートのプレミアム・ダークテーマ化（黒背景 + 金アクセント + 明朝体）
- [x] `TEMPLATE_DEFAULTS` によるテンプレート別デフォルト色・フォント定義
- [x] テンプレート切替時の色・フォント自動リセット（Admin UI + API）
- [x] サイト画像アップロード API（ヒーロー / ロゴ / 挨拶写真）
- [x] Admin UI ヒーロー画像アップロード・削除・プレビュー UI
- [x] SEO: タイトル・メタディスクリプション・キーワードに代表者名（`representative_name`）追加
- [x] SEO: `breeder_type` に応じた紹介ページラベル動的生成（犬舎紹介/猫舎紹介/ブリーダー紹介）
- [x] サムネイル画像対応（`uploadImageWithThumbnail`）

### Phase 5: 機能拡充・移行支援 ✅ 完了
- [x] FAQ 管理機能（DB + API + 管理画面 + サイト表示 + JSON-LD FAQPage）
- [x] プライバシーポリシー / 利用規約ページ自動生成
- [x] LIFF お知らせ管理（ブリーダーが LINE から直接投稿・編集・削除 + 自動デプロイ）
- [x] ヒーロー画像スライドショー（最大5枚、並び替え対応）
- [x] 施設画像管理（最大3枚）
- [x] トップページセクション並び替え・表示制御（home_sections、13セクション対応）
- [x] ナビゲーション項目カスタマイズ（nav_order）
- [x] 管理者用動物 CRUD（Admin UI から直接登録・更新・削除 + 自動デプロイ）
- [x] 旧サイト移行ウィザード（クロール・ページ種別判定・リダイレクト提案）
- [x] 移行検証ツール（DNS/HTTP・sitemap・robots.txt・リダイレクト確認）
- [x] 移行チェックリスト（breeders.migration_checklist）
- [x] deploy-trigger サービス抽出（ビルド・デプロイの共通化）
- [x] 定期クリーンアップ（Cron: webhook_events / deploy_logs / audit_logs）
- [x] 特定商取引法に基づく表記対応（tokushoho）
- [x] Cookie 同意バナー（cookie-banner パーシャル）

### Phase 6: 親犬親猫詳細・スクレイプ機能 ✅ 完了
- [x] 親犬/親猫の個別詳細ページ生成（`/parents/{slug}.html`）
- [x] 親犬/親猫の名前（`name`）フィールド追加（LIFF・Admin 両対応）
- [x] 親犬/親猫一覧の見出しを名前で表示
- [x] コンタクトフォーム自動入力（動物詳細ページからクエリパラメータ連携）
- [x] デモサイトスクレイプ機能（`DemoScrapeWizard`）
- [x] ポータルサイト動物情報スクレイプ（`animal-scrape` API）

### Phase 7: Stripe 決済・セキュリティ強化 ✅ 完了
- [x] Stripe Billing 統合（サブスクリプション管理）
- [x] `subscriptions` テーブル追加（プラン・ステータス・Stripe ID 管理）
- [x] Stripe Webhook 受信（6イベント: checkout/subscription/invoice）
- [x] Stripe 署名検証（HMAC-SHA256 + タイムスタンプ + 定数時間比較）
- [x] Webhook リプレイ攻撃防止（`webhook_events` テーブル共用）
- [x] サブスクステータス → ブリーダーステータス自動連動
- [x] Admin 課金タブ（サブスク情報表示・決済リンク生成）
- [x] Payment Links + `client_reference_id` によるブリーダー紐付け
- [x] Cloudflare Access 導入（メールOTP による管理画面アクセス制御）
- [x] Admin 認証アカウントロック（IP単位: 10回失敗/30分でブロック）
- [x] CORS に `admin.breeders-flow.com` 追加

---

## 10. セキュリティ

### 10.1 認証・認可

#### LIFF トークン検証（ブリーダー向け API）

すべての `/api/animals` および `/api/liff/*` エンドポイントは LIFF アクセストークンを `Authorization: Bearer <token>` ヘッダーで受け取る。

**サーバー側検証手順**:
1. `GET https://api.line.me/oauth2/v2.1/verify?access_token=<token>` を呼び出し、レスポンスの `client_id` が LIFF アプリの Channel ID（`LIFF_CHANNEL_ID`）と一致することを確認
2. `GET https://api.line.me/v2/profile`（`Authorization: Bearer <token>`）で LINE User ID を取得
3. `breeders` テーブルの `line_user_id` カラムと照合し、`breeder_id` を特定
4. 一致するブリーダーが存在しない場合は `401 Unauthorized` を返す

**実装ファイル**: `packages/api/src/middleware/auth.ts`

#### 管理者 API 認証

以下のエンドポイントは管理者専用:
- `/api/breeders/*`（ブリーダー管理全般）
- `/api/sites/*`（サイトビルド・デプロイ・画像管理）
- `/api/pages/*`（固定ページ管理）
- `/api/announcements/*`（お知らせ管理）
- `/api/testimonials/*`（お客様の声管理）
- `/api/faqs/*`（FAQ管理）
- `/api/admin/animals/*`（管理者用動物管理）
- `/api/migration/*`（移行ツール）
- `/api/demo-scrape/*`（デモスクレイプ）
- `/api/animal-scrape/*`（動物情報スクレイプ）

**認証方式**: `Authorization: Bearer <ADMIN_API_KEY>`
- `ADMIN_API_KEY` は Cloudflare Workers シークレットに設定
- タイミング攻撃を防ぐため、定数時間比較（constant-time comparison）を使用
- 不一致の場合: `403 Forbidden`（`audit_logs` に失敗記録）
- **アカウントロック**: 同一IPから30分以内に10回認証失敗 → `429 Too Many Requests`（自動解除: 30分経過後）

#### データ所有権チェック（Cross-Breeder Isolation）

すべてのデータアクセスにおいて、認証済み `breeder_id` とリソースの `breeder_id` の一致を検証する。

```
例: PUT /api/animals/:id
  1. LIFF トークンから breeder_id を特定
  2. animals テーブルから :id のレコードを取得
  3. レコードの breeder_id と認証済み breeder_id が一致しない場合 → 404 Not Found
     （403 ではなく 404 を返すことで、他ブリーダーのリソースの存在を推測させない）
```

### 10.2 LINE Webhook セキュリティ

#### 署名検証

`POST /api/webhook/line` は LINE Platform の署名検証を必須とする。

**手順**:
1. リクエストヘッダーの `X-Line-Signature` を取得
2. リクエストボディを `LINE_CHANNEL_SECRET` で HMAC-SHA256 署名し、Base64 エンコード
3. 計算結果と `X-Line-Signature` を比較
4. 不一致の場合 → `400 Bad Request`（監査ログに記録）

`LINE_CHANNEL_SECRET` は Cloudflare Workers シークレットに格納。コードやコメントにハードコードしない。

#### リプレイ攻撃防止

Webhook イベントの `messageId` を `webhook_events` テーブルに記録し、重複イベントを無視する。古いレコードは定期的に削除（TTL: 24時間）。

```sql
CREATE TABLE IF NOT EXISTS webhook_events (
  message_id  TEXT PRIMARY KEY,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### 10.3 入力バリデーション

すべての API エンドポイントで **Zod** によるリクエストバリデーションを実施する。

#### POST /api/animals のバリデーションスキーマ

| フィールド | ルール |
|-----------|--------|
| action | `z.enum(['create', 'update', 'retire'])` |
| animal_type | `z.enum(['puppy', 'kitten', 'parent_dog', 'parent_cat'])` |
| animal_id | `z.string().min(1).max(50).regex(/^[a-zA-Z0-9\-]+$/)` |
| breed | `z.string().max(100)` |
| sex | `z.enum(['male', 'female'])` |
| birth_date | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)` |
| color | `z.string().max(50)` |
| price | `z.number().int().min(0).max(99999999).nullable()` |
| description | `z.string().max(2000)` |
| status | `z.enum(['available', 'reserved', 'sold', 'retired'])` |
| images | `z.array(z.string()).max(5)` |

#### 画像アップロードの検証

| 項目 | 制限 |
|------|------|
| 1枚あたりの最大サイズ | 10MB（Base64 デコード後） |
| 最大枚数 | 5枚 |
| 許可する MIME タイプ | `image/jpeg`, `image/png`, `image/webp` |
| MIME 検証方法 | マジックバイト（ファイルヘッダー）で判定。Content-Type ヘッダーは信用しない |
| EXIF メタデータ | **除去必須**（GPS 位置情報の漏洩防止） |
| R2 保存キー | `{breeder_id}/animals/{animal_db_id}/{uuid}.{ext}`（ユーザー入力のファイル名を使用しない） |

#### サムネイル画像

動物画像はフルサイズ + サムネイルの2画像を保存可能（`uploadImageWithThumbnail`）:

| 項目 | 仕様 |
|------|------|
| 入力形式 | `ImagePayload`: `string`（後方互換）または `{ full: string; thumbnail: string }` |
| フルサイズ R2 キー | `{breederId}/animals/{animalDbId}/{uuid}.{ext}` |
| サムネイル R2 キー | `{breederId}/animals/{animalDbId}/thumb/{uuid}.{ext}` |
| DB カラム | `images.thumbnail_r2_key`（NULL 可） |
| 後方互換 | `string` 入力の場合は `thumbnailR2Key = null` |

#### サイト画像の R2 保存

サイト画像（ヒーロー / ロゴ / 挨拶写真）は動物画像とは別のパスに保存:

| 項目 | 仕様 |
|------|------|
| R2 キー形式 | `{breederId}/site/{imageType}/{uuid}.{ext}` |
| 許可 imageType | `hero`, `logo`, `greeting` |
| site_config フィールド | `{imageType}_r2_key`（例: `hero_r2_key`） |

#### SQL インジェクション防止

すべての D1 クエリで **Prepared Statements**（バインドパラメータ）を使用する。文字列結合によるクエリ構築は禁止。

```typescript
// OK:
db.prepare('SELECT * FROM animals WHERE breeder_id = ?').bind(breederId)

// NG（禁止）:
db.prepare(`SELECT * FROM animals WHERE breeder_id = '${breederId}'`)
```

### 10.4 個人情報保護（PII Protection）

#### 暗号化対象フィールド

`breeders` テーブルの以下フィールドは **AES-256-GCM** で暗号化して保存する:

| フィールド | 理由 |
|-----------|------|
| `owner_name` | 個人名 |
| `email` | 連絡先 |
| `phone` | 連絡先 |
| `address` | 住所 |
| `license_no` | 事業者番号 |

**暗号化しないフィールド**（公開情報のため）:
- `name`（犬舎名/キャッテリー名）— サイトに表示
- `description`（紹介文）— サイトに表示
- `site_domain` — 公開 URL

#### 暗号化方式

| 項目 | 仕様 |
|------|------|
| アルゴリズム | AES-256-GCM |
| 実装 | Web Crypto API（Cloudflare Workers ネイティブ） |
| 暗号化キー | Workers シークレット `PII_ENCRYPTION_KEY`（256bit, Base64） |
| IV | 暗号化ごとにランダム 12 バイト生成 |
| 保存形式 | `Base64(IV + ciphertext + authTag)` |

**実装ファイル**: `packages/api/src/lib/crypto.ts`

#### API レスポンスでの PII マスキング

管理者 API のレスポンスでも、PII は部分マスキングして返す:
- email: `t***@example.com`
- phone: `090-****-1234`
- address: 都道府県のみ表示

#### 生成サイトへの PII 出力制御

テンプレートエンジンが生成する静的 HTML に以下を**含めない**:
- `email`（お問い合わせはフォーム経由のみ）
- `phone`（必要な場合は画像として埋め込み、クローラー対策）
- `address` の詳細（市区町村レベルまでに限定、Google Maps 埋め込みで代替）

#### ログ・エラーメッセージでの PII 禁止

`console.log` やエラーレポーティングに PII を含めない。識別子としては `breeder_id`（`BREEDER001` 等）のみ使用する。

### 10.5 テンプレートセキュリティ（XSS 防止）

#### 自動エスケープ

Mustache テンプレートエンジンは `{{variable}}` でデフォルト HTML エスケープされる。

生（Raw）HTML 出力が必要な場合:
- `{{{variable}}}` の三重中括弧構文を使用
- 使用可能な場所を `site_config.google_maps_embed` と `site_config.custom_css` のみに限定

#### site_config のサニタイズ

| フィールド | バリデーション |
|-----------|--------------|
| `google_maps_embed` | `<iframe>` の `src` 属性が `https://www.google.com/maps/embed` で始まることを検証。その他の属性（`onload` 等）は拒否 |
| `ga4_id` | `/^G-[A-Z0-9]+$/` パターンのみ許可 |
| `social.instagram` | `https://instagram.com/` または `https://www.instagram.com/` で始まる URL のみ |
| `social.line_url` | `https://line.me/` で始まる URL のみ |

#### Content Security Policy（生成サイト）

生成される HTML の `<head>` に以下を含める:

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           img-src 'self' *.r2.cloudflarestorage.com data:;
           script-src 'self' www.googletagmanager.com;
           frame-src www.google.com;
           style-src 'self' fonts.googleapis.com 'unsafe-inline';
           font-src fonts.gstatic.com;">
```

### 10.6 シークレット管理

#### 必要なシークレット一覧

| シークレット名 | 用途 |
|---------------|------|
| `LINE_CHANNEL_SECRET` | LINE Webhook 署名検証 |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API 送信 |
| `LIFF_CHANNEL_ID` | LIFF トークン検証時の Channel ID 照合 |
| `PII_ENCRYPTION_KEY` | ブリーダー PII 暗号化キー（256bit, Base64） |
| `ADMIN_API_KEY` | 管理者 API 認証トークン |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 署名検証シークレット |
| `CF_PAGES_API_TOKEN` | Cloudflare Pages Deploy API |

#### 本番環境

`wrangler secret put <KEY>` で Cloudflare Workers に設定。

#### ローカル開発

`.dev.vars` ファイルに記載（`.gitignore` に含まれているため git 管理外）。
`.dev.vars.example` ファイルを用意し、変数名のみ記載（値は空）。

#### 禁止事項

- `wrangler.toml` の `[vars]` にシークレットを記載しない（非機密な設定値のみ可）
- ソースコード内にシークレットをハードコードしない
- テストコード内に本番シークレットを含めない
- git commit メッセージにシークレット値を含めない

### 10.7 レート制限

Cloudflare WAF / Rate Limiting Rules で設定:

| エンドポイント | 制限 | 期間 |
|---------------|------|------|
| `POST /api/animals/*` | 30 req | 1分 |
| `POST /api/webhook/line` | 100 req | 1分 |
| `POST /api/breeders` | 5 req | 1分 |
| `POST /api/breeders/*/animals` | 30 req | 1分 |
| `POST /api/sites/build` | 10 req | 1分 |
| `POST /api/sites/*/upload-image` | 10 req | 1分 |
| `POST /api/pages` | 10 req | 1分 |
| `POST /api/announcements` | 10 req | 1分 |
| `POST /api/liff/announcements` | 10 req | 1分 |
| `POST /api/testimonials` | 10 req | 1分 |
| `POST /api/faqs` | 10 req | 1分 |
| `POST /api/migration/*` | 5 req | 1分 |
| `POST /api/admin/animals` | 30 req | 1分 |
| `POST /api/demo-scrape/*` | 3 req | 1分 |
| `POST /api/animal-scrape/*` | 5 req | 1分 |
| `POST /api/webhook/stripe` | 100 req | 1分 |

超過時は `429 Too Many Requests` を返す。

### 10.8 セキュリティヘッダー・CORS

#### Workers API の CORS 設定

| ヘッダー | 値 |
|---------|-----|
| `Access-Control-Allow-Origin` | 下記の許可リストから一致するオリジンを返す |
| `Access-Control-Allow-Methods` | `GET, POST, PUT, DELETE, OPTIONS` |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization` |
| `Access-Control-Max-Age` | `86400` |

**許可オリジン一覧**:
| オリジン | 用途 |
|---------|------|
| `https://liff.line.me` | LIFF 本番（LINE内ブラウザ） |
| `https://breeder-flow-liff.pages.dev` | LIFF 本番（Pages直接アクセス） |
| `https://breeder-flow-admin.pages.dev` | Admin UI 本番 |
| `https://admin.breeders-flow.com` | Admin UI カスタムドメイン |
| `http://localhost:5173` | LIFF ローカル開発 |
| `http://localhost:5174` | Admin UI ローカル開発 |

ワイルドカード（`*`）は禁止。

#### 生成サイトのセキュリティヘッダー

Cloudflare Pages の `_headers` ファイルで設定:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 10.9 監査ログ

#### audit_logs テーブル

セクション 4.1 の `audit_logs` テーブル定義を参照。

#### ログ対象の操作

| 操作 | action 値 |
|------|-----------|
| ブリーダー情報の閲覧（管理者 API） | `breeder.view` |
| 動物の登録 | `animal.create` |
| 動物の更新 | `animal.update` |
| 動物の削除 | `animal.delete` |
| お知らせの作成 | `announcement.create` |
| お知らせの更新 | `announcement.update` |
| お知らせの削除 | `announcement.delete` |
| お客様の声の作成 | `testimonial.create` |
| お客様の声の更新 | `testimonial.update` |
| お客様の声の削除 | `testimonial.delete` |
| FAQ の作成 | `faq.create` |
| FAQ の更新 | `faq.update` |
| FAQ の削除 | `faq.delete` |
| 固定ページの作成 | `page.create` |
| 固定ページの更新 | `page.update` |
| 固定ページの削除 | `page.delete` |
| サイトビルド・デプロイ | `site.build` |
| サイト画像のアップロード | `site.upload_image` |
| サイト画像の削除 | `site.delete_image` |
| LINE User ID の紐付け | `breeder.link_line` |
| ブリーダー情報の閲覧（管理者） | `breeder.view` |
| 管理者 API アクセス失敗 | `admin.auth_fail` |

### 10.10 定期クリーンアップ

Workers の `scheduled` ハンドラー（Cron トリガー）で以下のテーブルの古いレコードを定期削除する:

| テーブル | 削除条件 |
|---------|---------|
| `webhook_events` | `received_at` が一定期間（24時間）より古いレコード |
| `deploy_logs` | 古いデプロイログレコード |
| `audit_logs` | 古い監査ログレコード |

**実装ファイル**: `packages/api/src/index.ts`（`scheduled` エクスポート）、`packages/api/src/db/queries.ts`（`cleanOldWebhookEvents`, `cleanOldDeployLogs`, `cleanOldAuditLogs`）
