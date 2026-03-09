# Breeders Flow — マーケティングサイト

breeders-flow.com のマーケティング・LP サイト。Jekyll で構築。

**注意**: これはマーケティングサイトであり、プラットフォーム本体ではない。

## 関連リポジトリ

| リポジトリ | パス | 役割 |
|-----------|------|------|
| **breeder-flow** | `~/Desktop/breeder-flow/` | プラットフォーム本体（API・CMS・LIFF・サイト生成） |
| **Breeder-LINE-Manager** | `~/Desktop/Breeder-LINE-Manager/` | LINE管理システム（予約・自動応答・ステップ配信） |

## 技術スタック

- **SSG**: Jekyll
- **ホスティング**: GitHub Pages
- **スタイル**: assets/ 内のCSS

## 主要ファイル

| パス | 説明 |
|------|------|
| `_config.yml` | Jekyll設定 |
| `pricing.html` | 料金ページ（breeder-flow のプラン情報と同期が必要） |
| `features.html` | 機能紹介ページ |
| `BUSINESS-PLAN.md` | 事業計画書 |
| `SPECIFICATION.md` | 仕様書（参考用、本体は breeder-flow リポに最新版あり） |

## 料金・機能情報の同期

`pricing.html` と `features.html` の内容は breeder-flow の実際の機能・料金と一致させる必要がある。breeder-flow 側で料金プランや機能が変更された場合、本サイトも更新すること。
