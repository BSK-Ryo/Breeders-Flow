import React from "react";
import { Card, CTA, Grid, Hero, LineChatVisual, PageShell, Section } from "./_PageKit";

export default function Line() {
  return (
    <PageShell tone="line">
      <Hero tone="line" eyebrow="LINEでできること" title="HP更新も問い合わせ対応も、LINEからもっと軽く。" lead="写真登録、ステータス変更、見学予約、自動応答。毎日の業務に近い場所から、HPと顧客対応を動かせます。" cta="LINE活用を相談する" visual={<LineChatVisual />} />
      <Section title="LINE更新の主な操作">
        <Grid>
          <Card accent="line" title="子犬・子猫登録" body="写真、誕生日、価格、性別、ステータスを入力して掲載。" icon="登" />
          <Card accent="line" title="掲載ステータス変更" body="募集中、商談中、成約済み、非表示をすばやく変更。" icon="変" />
          <Card accent="line" title="問い合わせ対応" body="よくある質問への自動応答や予約導線に接続。" icon="応" />
        </Grid>
      </Section>
      <CTA title="LINE中心の運用に切り替えましょう" />
    </PageShell>
  );
}
