import React from "react";
import { Card, CTA, Grid, Hero, PageShell, ProductVisual, Section } from "./_PageKit";

export default function Demo() {
  return (
    <PageShell>
      <Hero eyebrow="デモサイト" title="公開後の姿を、3分で体験できます。" lead="子犬・子猫一覧、詳細ページ、問い合わせ導線、LINE更新の流れを、実際の運用に近い形で確認できます。" secondary="機能を見る" visual={<ProductVisual caption="デモサイトと管理画面を見ながら確認" />} />
      <Section title="デモで確認できること">
        <Grid>
          <Card title="お客様側の見え方" body="スマホで見たときの写真、価格、健康記録、問い合わせ導線を確認できます。" icon="客" />
          <Card title="更新側の流れ" body="LINEから登録した情報が、どのようにHPへ反映されるかを確認できます。" icon="更" />
          <Card title="SEOページ構成" body="犬舎紹介、FAQ、法定表示など、検索と信頼のためのページ構成を確認できます。" icon="検" />
        </Grid>
      </Section>
      <Section shaded title="見学前の不安を減らすページ設計" lead="写真だけでなく、健康記録・親情報・譲渡方針を見せることで、問い合わせの質を高めます。" />
      <CTA title="デモを見ながら相談できます" />
    </PageShell>
  );
}
