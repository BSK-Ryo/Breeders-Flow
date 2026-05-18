import React from "react";
import { Card, CTA, Grid, Hero, PageShell, PricingVisual, Section } from "./_PageKit";

const plans = [
  ["スタンダード", "¥19,800", "6ヶ月目以降 ¥14,800/月", ["HP制作", "LINE更新", "16ページ以上", "SEO・SSL", "メール・LINEサポート"]],
  ["プレミアム", "¥29,800", "6ヶ月目以降 ¥24,800/月", ["スタンダード全機能", "見学予約", "自動応答", "ステップ配信", "顧客CRM・タグ管理"]],
];

export default function Pricing() {
  return (
    <PageShell>
      <Hero eyebrow="料金プラン" title="シンプルな料金体系。隠れた費用はありません。" lead="初期費用0円。HP制作・運用・SEO・サポートまで月額に含めた、ブリーダー専用プランです。" visual={<PricingVisual />} />
      <Section>
        <Grid cols="md:grid-cols-2">
          {plans.map(([name, price, discount, items], index) => (
            <article key={name} className={`rounded-3xl border bg-white p-8 shadow-xl ${index === 0 ? "border-teal-300" : "border-amber-300"}`}>
              <p className="font-black text-slate-700">{name}プラン</p>
              <p className={`mt-4 text-5xl font-black ${index === 0 ? "text-[#0F766E]" : "text-[#D97706]"}`}>{price}</p>
              <p className="mt-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-[#D97706]">{discount}</p>
              <ul className="mt-7 space-y-3">{items.map((item) => <li key={item} className="font-bold text-slate-700">✓ {item}</li>)}</ul>
              <a className={`mt-8 block rounded-full px-6 py-4 text-center font-black text-white ${index === 0 ? "bg-[#0F766E]" : "bg-[#D97706]"}`} href="/contact/">相談する</a>
            </article>
          ))}
        </Grid>
      </Section>
      <Section shaded title="両プランに含まれるもの">
        <Grid><Card title="初期費用無料" body="通常50,000円の初期費用が毎月5社限定で0円。" icon="¥" accent="amber" /><Card title="独自ドメイン対応" body="ドメイン設定・維持まで月額内で対応します。" icon="D" /><Card title="最低利用期間6ヶ月" body="公開後の改善まで見据えて運用を支援します。" icon="6" /></Grid>
      </Section>
      <CTA />
    </PageShell>
  );
}
