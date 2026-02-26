# Breeder Flow — プラットフォーム概要

ブリーダー向けHP自動生成・運用プラットフォーム。WordPress不要。LINE LIFFでデータ入力し、Cloudflareエコシステムで静的HTMLサイトを自動生成・デプロイする。

## 技術スタック

- **モノレポ管理**: pnpm + Turborepo
- **言語**: TypeScript（全パッケージ共通）
- **API**: Cloudflare Workers + Hono
- **DB**: Cloudflare D1 (SQLite)
- **画像ストレージ**: Cloudflare R2
- **静的サイト配信**: Cloudflare Pages
- **サイト生成**: Mustache テンプレートエンジン（ロジックレス）
- **フロントエンド**: React 19 + Vite + Tailwind CSS
- **LINE連携**: LINE Messaging API + LIFF v2
- **決済**: Stripe Billing（サブスクリプション管理・Payment Links）
- **テスト**: Vitest
- **バリデーション**: Zod
- **Node**: >=20.0.0

## モノレポ構成

```
packages/
├── api/          # Cloudflare Workers API（Hono）
│                 #   routes/ services/ db/ middleware/
├── liff/         # LINE LIFF フォームアプリ（React）
│                 #   ブリーダーが子犬・子猫を登録するUI
├── admin/        # 管理者ダッシュボード（React）
│                 #   ブリーダー管理・サイト設定・デプロイログ
├── generator/    # 静的サイトジェネレーター
│                 #   Mustacheテンプレート→HTML生成
│                 #   templates/{default,modern,warm}/ に3テーマ
└── shared/       # 共通ライブラリ
                  #   types.ts / constants.ts / validators.ts
```

## データフロー

1. ブリーダーがLINE LIFFで子犬情報を入力
2. LIFF → Workers API → D1に保存、画像はR2にアップロード
3. API がサイトビルドをトリガー
4. Generator が D1データ + R2画像URL + Mustacheテンプレート → 静的HTML生成
5. 生成HTML を Cloudflare Pages にデプロイ
6. LINE でブリーダーに完了通知

## 主要コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm turbo dev` | 全パッケージ開発サーバー起動 |
| `pnpm turbo build` | 全パッケージビルド |
| `pnpm turbo test` | 全パッケージテスト実行 |
| `pnpm turbo lint` | 全パッケージLint |
| `pnpm db:migrate` | D1 マイグレーション適用 |
| `pnpm deploy:api` | Workers API デプロイ |
| `pnpm deploy:liff` | LIFF アプリデプロイ |
| `pnpm deploy:admin` | Admin ダッシュボードデプロイ |

## 主要ファイル

| パス | 説明 |
|------|------|
| `SPECIFICATION.md` | 詳細仕様書（1,700行超。アーキテクチャ・DB・API・セキュリティ等） |
| `packages/shared/src/types.ts` | 全型定義（Breeder, Animal, SiteConfig 等） |
| `packages/shared/src/constants.ts` | 定数・ラベル・テンプレートデフォルト値 |
| `packages/shared/src/validators.ts` | Zod バリデーションスキーマ |
| `packages/api/src/db/schema.sql` | D1 データベーススキーマ |
| `packages/api/src/db/queries.ts` | 全DBクエリ |
| `packages/api/src/routes/` | API エンドポイント定義 |
| `packages/generator/src/pages.ts` | サイト生成のメインロジック（generatePages） |
| `packages/generator/src/engine.ts` | テンプレートヘルパー関数 |
| `packages/generator/src/section-reorder.ts` | セクション並び替えエンジン |
| `packages/generator/templates/` | 3テーマのMustacheテンプレート |
| `packages/api/src/routes/animal-scrape.ts` | ポータルサイト動物情報スクレイプ |
| `packages/api/src/routes/stripe-webhook.ts` | Stripe Webhook 処理（サブスク管理） |
| `packages/admin/src/components/` | Admin UI コンポーネント |

## DB テーブル（12テーブル）

`breeders` / `animals` / `images` / `pages` / `announcements` / `testimonials` / `faqs` / `deploy_logs` / `audit_logs` / `webhook_events` / `subscriptions` / `stripe_webhook_events`

- PIIは AES-256-GCM で暗号化（owner_name, email, phone, address, license_no）
- `site_config` は JSON カラム（SiteConfig型）でブリーダーごとのサイト設定を保持

## サイト生成の仕組み

- 3つのテーマ: `default`（プレミアム/ダーク）、`modern`（ミニマル/白）、`warm`（温かみ/クリーム）
- 各テーマに `layout.html` / `pages/*.html` / `partials/*.html` / `assets/`
- `SiteConfig` でテーマ・色・フォント・SEO・各セクション設定をブリーダーごとに制御
- 生成サイトは 16ページ + 詳細ページ（index, about, puppies, kittens, parents, news, flow, contact, testimonials, faq, legal, privacy, terms, 404 + 子犬/子猫/親犬/親猫の個別詳細ページ）
- 動物詳細ページからコンタクトフォームへクエリパラメータ連携（犬種・個体ID自動入力）

## セキュリティ

- Cloudflare Access（メールOTP）による管理画面アクセス制御
- LIFF トークン検証（LINE API）
- Admin API キー認証（constant-time比較 + アカウントロック: 10回失敗/30分でIP単位ブロック）
- LINE Webhook 署名検証（HMAC-SHA256）
- Stripe Webhook 署名検証
- 画像: MIME type 検証（magic bytes）、EXIF除去、サイズ制限
- Rate Limiting（エンドポイントごと）
- CSP / X-Frame-Options / HSTS ヘッダー

## コーディング規約

- 全パッケージ TypeScript strict mode
- Zod でAPI入力バリデーション
- Mustache テンプレートは自動HTMLエスケープ（`{{{三重}}}` でエスケープ無効）
- テスト: Vitest、各パッケージに `*.test.ts`
- 日本語ラベルは `constants.ts` に集約

## 詳細情報

詳細な仕様は `SPECIFICATION.md` を参照してください。
