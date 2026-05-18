import React from "react";
import { Card, CTA, Grid, Hero, PageShell, ProductVisual, Section, featureCards } from "./_PageKit";

export default function Features() {
  return (
    <PageShell>
      <Hero eyebrow="機能紹介" title="ブリーダー様が欲しい機能、すべて揃っています。" lead="HP制作・更新・SEO・セキュリティまで。LINEでもWebダッシュボードでも、お好みの方法で管理できます。" visual={<ProductVisual caption="掲載・予約・問い合わせを一画面で確認" />} />
      <Section title="主要機能">
        <Grid>{featureCards.map(([title, body, icon]) => <Card key={title} title={title} body={body} icon={icon} />)}</Grid>
      </Section>
      <Section shaded title="3つのプロフェッショナルテーマ" lead="プレミアム、モダン、ナチュラル。犬舎・猫舎のブランドに合わせて色や写真を調整できます。">
        <Grid>
          {["プレミアム", "モダン", "ナチュラル"].map((theme, i) => <Card key={theme} title={theme} body="ロゴ、カラー、ヒーロー画像、セクション順を調整して、横並びではない独自の見せ方を作ります。" icon={["黒", "白", "緑"][i]} accent={i === 0 ? "amber" : "teal"} />)}
        </Grid>
      </Section>
      <Section title="自動生成されるページ">
        <Grid cols="md:grid-cols-4">
          {["トップ", "子犬・子猫一覧", "個別詳細", "親紹介", "犬舎紹介", "お迎えの流れ", "FAQ", "法定表示"].map((page) => <Card key={page} title={page} icon="頁" />)}
        </Grid>
      </Section>
      <CTA />
    </PageShell>
  );
}
