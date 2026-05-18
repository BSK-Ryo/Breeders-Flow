import React from "react";
import { CTA, Hero, PageShell, Section } from "../_PageKit";

export default function LegalPage({ eyebrow, title, lead, rows }) {
  return (
    <PageShell>
      <Hero eyebrow={eyebrow} title={title} lead={lead} secondary="お問い合わせ" />
      <Section>
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {rows.map(([label, body]) => (
            <div key={label} className="grid gap-2 border-b border-slate-100 p-6 last:border-b-0 md:grid-cols-[14rem_1fr]">
              <dt className="font-black text-slate-900">{label}</dt>
              <dd className="leading-7 text-slate-600">{body}</dd>
            </div>
          ))}
        </div>
      </Section>
      <CTA title="内容に関するお問い合わせ" />
    </PageShell>
  );
}
