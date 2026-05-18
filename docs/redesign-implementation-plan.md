# Breeders Flow Redesign Implementation Plan

## Goal

既存のJekyllマーケティングサイトを、生成済みUIモックを基準にした React + Tailwind CSS の静的サイトへ刷新する。対象はLPだけでなく、既存ページの再デザインと新規導線ページを含む。

## Baseline

- Current site: Jekyll + Tailwind CSS generated file
- Target site: Vite + React + Tailwind CSS
- Hosting assumption: static build output can be deployed by GitHub Pages or Cloudflare Pages
- Primary design reference: generated UI mockups in `$CODEX_HOME/generated_images/019e3913-761c-7d10-9fd6-3e525a059947`
- Existing content source: current `.html` pages, `BUSINESS-PLAN.md`, `SPECIFICATION.md`

## Visual Direction

- Concept: あたたかい専門家
- Tone: 安心、清潔、親しみ、専門性、上質
- Primary color: `#0F766E`
- Light teal: `#CCFBF1`
- Accent amber: `#D97706`
- Accent cream: `#FEF3C7`
- Text dark: `#1E293B`
- Text muted: `#475569`
- Background warm white: `#FFFCF7`
- Section background: `#F8FAFC`
- Border: `#E2E8F0`
- LINE green: `#06C755`
- Font: Noto Sans JP for UI/body, Noto Serif JP for selected emotional headings

## Pages

### Existing Pages To Redesign

- `/` Top LP
- `/features/` 機能紹介
- `/pricing/` 料金プラン
- `/demo/` デモサイト
- `/migration/` HPを乗り換えたい方へ
- `/faq/` よくある質問
- `/contact/` お問い合わせ
- `/line-manager/` Breeder LINE Manager
- `/line-guide/` LINE活用ガイド
- `/about-us/` 運営者情報
- `/privacy/` プライバシーポリシー
- `/terms/` 利用規約
- `/tokushoho/` 特定商取引法に基づく表記
- `/cancellation/` 解約手続き
- `/agreement/` 申込前確認

### New Pages

- `/beginner/` はじめての方へ
- `/flow/` 公開までの流れ
- `/line/` LINEでできること
- `/required-pages/` ブリーダーHPに必要なページ
- `/cases/` 事例・お客様の声
- `/support/` サポート内容
- `/security/` セキュリティ・安心設計

## Mockup Mapping

Generated mockups were created in this order:

1. はじめての方へ
2. 機能紹介
3. 料金プラン
4. デモサイト
5. HPを乗り換えたい方へ
6. よくある質問
7. お問い合わせ
8. 公開までの流れ
9. LINEでできること
10. ブリーダーHPに必要なページ
11. 事例・お客様の声
12. サポート内容
13. セキュリティ・安心設計
14. Breeder LINE Manager

The existing top LP mockup was generated earlier and should be used as the top page visual reference.

## Implementation Strategy

1. Add Vite + React + Tailwind CSS project files while preserving content assets and legal text.
2. Replace Jekyll layout/includes with React layout components.
3. Use a centralized page/content model so pricing, features, FAQ, and navigation remain consistent.
4. Use CSS variables and Tailwind tokens for the palette.
5. Use SVG icon components for crisp transparent icons. Raster icons are only generated when a bespoke pictorial asset is needed.
6. Generate project-bound hero/illustration assets with the imagegen skill, then place final files under `public/assets/generated/`.
7. Add Framer Motion or CSS-driven motion for section reveals, floating panels, hover states, mobile menu transitions, and page transitions.
8. Run build and Browser Use checks at desktop and mobile widths.

## Pixel-Fidelity Criteria

Because the reference images are generated mockups rather than layered source files, fidelity will be judged by:

- Same overall page composition and first-viewport hierarchy
- Matching color palette, border weights, radii, spacing rhythm, and typography feel
- Matching Japanese copy in the hero and primary cards
- Matching card and dashboard-like shapes from the mockups
- No visibly generic SaaS style drift
- Responsive mobile layout preserves hierarchy without overlapping text
- Generated raster assets are local project files, not hotlinked from `$CODEX_HOME`

## TODO List

- [ ] T01: Create React/Vite/Tailwind foundation and scripts.
- [ ] T02: Create shared design system components: layout, nav, footer, buttons, badges, cards, page hero, section headings.
- [ ] T03: Build content/data model for navigation, pricing, FAQ, features, page cards, and legal pages.
- [ ] T04: Copy mock references into the workspace and generate required raster assets through imagegen.
- [ ] T05: Implement top LP and core conversion sections.
- [ ] T06: Implement service pages: beginner, features, flow, line, required-pages, support, security, line-manager.
- [ ] T07: Implement commercial pages: pricing, demo, migration, cases, contact.
- [ ] T08: Implement FAQ and legal/operator pages.
- [ ] T09: Add animations and responsive interaction states.
- [ ] T10: Run build, lint-equivalent checks, and Browser Use visual review.
- [ ] T11: Iterate fixes until desktop and mobile views meet the fidelity criteria.

## Worker Policy

- Workers must use low reasoning effort.
- Workers own disjoint file sets where possible.
- Workers must not revert unrelated user changes.
- Workers must report changed files and verification commands.
- Browser Use is required for final page checks after the dev server is running.
- The orchestrator reviews each worker output, requests corrections if needed, and updates this plan if implementation constraints change.

