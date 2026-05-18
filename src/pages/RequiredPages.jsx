import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function RequiredPages() {
  const pages = ["トップページ", "子犬・子猫一覧", "個別詳細ページ", "親犬・親猫紹介", "犬舎・猫舎紹介", "お迎えの流れ", "FAQ", "動物取扱業表記", "プライバシーポリシー", "特定商取引法表記", "お問い合わせ", "お知らせ"];
  return (
    <PageShell>
      <Hero eyebrow="ブリーダーHPに必要なページ" title="信頼されるHPには、必要な情報の型があります。" lead="かわいい写真だけでなく、法定表示・健康情報・譲渡方針・問い合わせ導線まで揃えることで安心して選ばれます。" visual={<CardStackVisual title="信頼を作るページ構成" items={["子犬・子猫詳細", "親犬・親猫紹介", "法定表示・FAQ"]} />} />
      <Section title="必須ページ一覧">
        <Grid cols="md:grid-cols-4">{pages.map((page) => <Card key={page} title={page} body="Breeders Flowで構成・生成対象に含めます。" icon="頁" />)}</Grid>
      </Section>
      <Section shaded title="不足しがちな情報" lead="動物取扱業登録、見学条件、引き渡し条件、健康保証、キャンセル方針は、問い合わせ前の安心材料になります。" />
      <CTA />
    </PageShell>
  );
}
