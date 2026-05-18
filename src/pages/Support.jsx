import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Support() {
  return (
    <PageShell>
      <Hero eyebrow="サポート内容" title="制作して終わりではなく、運用が続くように支えます。" lead="初期設定、公開前確認、LINE更新の使い方、軽微な修正相談まで、ブリーダー業務に合わせてサポートします。" visual={<CardStackVisual title="公開後のサポート" items={["初期設定", "操作案内", "改善相談"]} accent="amber" />} />
      <Section title="サポート範囲">
        <Grid>
          <Card title="初期設定支援" body="ドメイン、デザイン、掲載項目、LINE連携の初期設定を支援します。" icon="初" />
          <Card title="操作サポート" body="子犬・子猫登録、写真差し替え、ステータス更新の使い方を案内します。" icon="操" />
          <Card title="改善相談" body="問い合わせ導線、FAQ、掲載内容の改善を相談できます。" icon="改" />
        </Grid>
      </Section>
      <Section shaded title="プレミアムは優先サポート" lead="LINE集客・予約・自動応答を含むため、運用面の相談も優先的に対応します。" />
      <CTA />
    </PageShell>
  );
}
