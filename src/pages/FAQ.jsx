import React from "react";
import { CardStackVisual, CTA, Hero, PageShell, Section } from "./_PageKit";

const faqs = [
  ["パソコンが苦手でも使えますか？", "はい。日々の更新はLINEから行えるため、スマホ中心で運用できます。"],
  ["初期費用は本当に0円ですか？", "毎月5社限定キャンペーン中は通常50,000円の初期費用が0円です。"],
  ["最低利用期間はありますか？", "最低利用期間は6ヶ月です。公開後の改善と運用定着まで支援します。"],
  ["ドメインは使えますか？", "独自ドメイン設定に対応しています。既存ドメインの移行もご相談ください。"],
  ["LINE Managerだけ使えますか？", "プレミアムプランの一部として提供する想定です。個別導入は相談内容に応じて確認します。"],
];

export default function FAQ() {
  return (
    <PageShell>
      <Hero eyebrow="よくある質問" title="導入前の不安を、先に解消します。" lead="料金、運用、乗り換え、サポートについてよくいただく質問をまとめました。" visual={<CardStackVisual title="よくある相談" items={["料金と最低期間", "更新方法", "乗り換え手順"]} />} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map(([q, a]) => (
            <details key={q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" open>
              <summary className="cursor-pointer text-lg font-black text-slate-900">{q}</summary>
              <p className="mt-3 leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CTA />
    </PageShell>
  );
}
