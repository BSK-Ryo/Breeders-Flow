import React from "react";
import { Card, CTA, Grid, Hero, LineChatVisual, PageShell, Section } from "./_PageKit";

export default function LineManager() {
  return (
    <PageShell tone="line">
      <Hero tone="line" eyebrow="Breeder LINE Manager" title="LINE公式アカウントの運用、まだ手動でやっていますか？" lead="予約管理・自動応答・ステップ配信・顧客CRM。ブリーダーに必要なLINE運用だけを、シンプルに自動化します。" cta="無料で相談する" secondary="料金を見る" visual={<LineChatVisual title="予約・自動応答・CRMをLINEで管理" />} />
      <Section title="Breeder LINE Managerでできること">
        <Grid>
          <Card accent="line" title="見学予約管理" body="LINEカレンダーから24時間受付。前日・当日の自動リマインドにも対応。" icon="予" />
          <Card accent="line" title="自動応答エンジン" body="料金、空き状況、見学方法などによくある質問へ自動返信。" icon="自" />
          <Card accent="line" title="ステップ配信" body="友だち追加から購入後フォローまで自動メッセージを配信。" icon="配" />
          <Card accent="line" title="顧客CRM" body="見込み、予約済み、購入済みの状態管理とタグ配信。" icon="顧" />
          <Card accent="line" title="リッチメニュー管理" body="顧客状態に合わせたLINEメニューの切り替え。" icon="メ" />
          <Card accent="line" title="購入後フォロー" body="ワクチン案内や健康チェックを自動化。" icon="後" />
        </Grid>
      </Section>
      <Section shaded title="プレミアムプランに含まれます" lead="HP制作とLINE集客・業務自動化をまとめて導入できます。" />
      <CTA title="LINE運用の手作業を減らしましょう" />
    </PageShell>
  );
}
