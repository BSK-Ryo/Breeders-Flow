import React from "react";
import { Card, CTA, Grid, Hero, PageShell, Section, TimelineVisual } from "./_PageKit";

const steps = ["無料相談", "掲載内容の整理", "初期制作", "LINE更新設定", "確認・修正", "公開・運用開始"];

export default function Flow() {
  return (
    <PageShell>
      <Hero eyebrow="公開までの流れ" title="相談から公開まで、やることを明確に進めます。" lead="ブリーダー業務を止めずに、必要な素材と確認事項を順番に整理して公開します。" visual={<TimelineVisual steps={steps} />} />
      <Section title="6つのステップ">
        <Grid cols="md:grid-cols-3">
          {steps.map((step, index) => <Card key={step} title={step} body="担当者が必要事項を確認し、次に何を用意すればよいかを明確にします。" icon={index + 1} />)}
        </Grid>
      </Section>
      <Section shaded title="公開後も終わりではありません" lead="子犬・子猫情報、お知らせ、FAQ、導線改善を継続して整えます。" />
      <CTA />
    </PageShell>
  );
}
