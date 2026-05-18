import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Cases() {
  return (
    <PageShell>
      <Hero eyebrow="事例・お客様の声" title="こだわりが伝わると、問い合わせの質が変わります。" lead="犬舎・猫舎ごとの強み、地域性、扱う犬種・猫種に合わせて、見せ方と導線を設計します。" visual={<CardStackVisual title="導入後の変化" items={["説明負担を削減", "見学前の安心感", "指名検索で見つかる"]} />} />
      <Section title="想定導入ケース">
        <Grid>
          <Card title="小規模犬舎" body="SNS中心の発信から、指名検索で見つかる自社HPへ。" icon="小" />
          <Card title="多犬種ブリーダー" body="犬種別の一覧と詳細ページで、探しやすく問い合わせしやすい構成へ。" icon="多" />
          <Card title="既存HP保有" body="古いHPをLINE更新・スマホ最適化された構成に移行。" icon="移" />
        </Grid>
      </Section>
      <Section shaded title="掲載する声の方向性" lead="導入後の更新しやすさ、問い合わせの変化、見学前の説明負担削減などを中心に掲載します。" />
      <Section title="お客様の声サンプル">
        <div className="grid gap-5 md:grid-cols-2">
          {["写真の差し替えを待たなくてよくなり、募集状況をすぐに直せるようになりました。", "見学前に健康管理や親犬情報を読んでもらえるので、問い合わせ対応が落ち着きました。"].map((voice) => (
            <blockquote key={voice} className="rounded-lg border border-[#E6D8C8] bg-white p-6 text-lg font-bold leading-8 text-[#38463F] shadow-sm">{voice}</blockquote>
          ))}
        </div>
      </Section>
      <CTA />
    </PageShell>
  );
}
