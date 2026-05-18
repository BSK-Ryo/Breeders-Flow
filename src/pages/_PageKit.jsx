import React from "react";

export const palette = {
  page: "bg-[#FFFCF7] text-[#24342F]",
  band: "bg-[#F7F0E7]",
  teal: "text-[#0F766E]",
  amber: "text-[#B46A2A]",
};

export function PageShell({ children, tone = "warm" }) {
  return (
    <main className={`${palette.page} min-h-screen font-sans antialiased`}>
      <div className={tone === "line" ? "bg-[#06C755]/10" : "bg-[#FFFCF7]"}>{children}</div>
    </main>
  );
}

export function Hero({ eyebrow, title, lead, cta = "無料で相談する", secondary = "デモを見る", visual, tone = "teal" }) {
  const isLine = tone === "line";
  return (
    <section className="relative overflow-hidden bg-[#FFFCF7] px-5 pb-14 pt-8 md:min-h-[calc(100vh-4rem)] md:pb-20 md:pt-12">
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.02fr_.98fr]">
        <div className="reveal-up">
          <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${isLine ? "border-[#06C755]/30 bg-white text-[#058D3D]" : "border-[#D8C6B2] bg-white text-[#0F766E]"}`}>
            {eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal text-[#1F2D28] md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#596760]">{lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className={`button-lift ${isLine ? "bg-[#06C755]" : "bg-[#0F766E]"} rounded-lg px-7 py-4 text-center font-bold text-white shadow-lg shadow-teal-900/10`} href="/contact/">{cta}</a>
            <a className="button-lift rounded-lg border border-[#D8C6B2] bg-white px-7 py-4 text-center font-bold text-[#38463F]" href="/demo/">{secondary}</a>
          </div>
        </div>
        <div className="reveal-up reveal-delay-2">
          <div className="product-float">{visual || <CardStackVisual />}</div>
        </div>
      </div>
    </section>
  );
}

export function Section({ eyebrow, title, lead, children, shaded = false }) {
  return (
    <section className={`${shaded ? palette.band : "bg-[#FFFCF7]"} px-5 py-16 md:py-20`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || lead) && (
          <div className="reveal-up mx-auto mb-10 max-w-3xl text-center">
            {eyebrow && <p className="text-sm font-black uppercase tracking-[.22em] text-[#0F766E]">{eyebrow}</p>}
            {title && <h2 className="mt-3 text-3xl font-black leading-tight text-[#1F2D28] md:text-4xl">{title}</h2>}
            {lead && <p className="mt-4 text-base leading-7 text-[#596760]">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Card({ title, body, icon = "✓", accent = "teal", children }) {
  const color = accent === "amber" ? "bg-[#FDEDD8] text-[#B46A2A]" : accent === "line" ? "bg-green-100 text-[#06A944]" : "bg-[#DDF3EE] text-[#0F766E]";
  return (
    <article className="card-stagger card-hover rounded-lg border border-[#E6D8C8] bg-white p-6 shadow-sm shadow-[#805B3D]/5">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-xl font-black ${color}`}>{icon}</div>
      <h3 className="text-lg font-black text-[#1F2D28]">{title}</h3>
      {body && <p className="mt-3 text-sm leading-7 text-[#596760]">{body}</p>}
      {children}
    </article>
  );
}

export function Grid({ children, cols = "md:grid-cols-3" }) {
  return <div className={`grid gap-5 ${cols}`}>{children}</div>;
}

export function CTA({ title = "まずは無料でご相談ください", body = "状況を伺い、必要なページ・運用方法・費用感を整理してご案内します。" }) {
  return (
    <section className="bg-[#0F766E] px-5 py-14 text-white">
      <div className="reveal-up mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-black md:text-3xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-teal-50">{body}</p>
        </div>
        <a href="/contact/" className="button-lift rounded-lg bg-white px-7 py-4 font-black text-[#0F766E]">無料相談へ</a>
      </div>
    </section>
  );
}

export function DashboardMock({ tone = "teal" }) {
  const line = tone === "line";
  return (
    <div className="image-sheen rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
      <div className={`${line ? "bg-green-50" : "bg-teal-50"} rounded-[1.5rem] p-5`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="h-3 w-28 rounded bg-slate-300" />
            <div className="mt-2 h-6 w-44 rounded bg-slate-800" />
          </div>
          <div className={`${line ? "bg-[#06C755]" : "bg-[#0F766E]"} h-12 w-12 rounded-2xl`} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["掲載中", "見学予約", "問い合わせ", "更新待ち"].map((item, index) => (
            <div key={item} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">{item}</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{[12, 6, 24, 3][index]}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-white p-4">
          <div className="mb-3 flex gap-3">
            <div className="h-16 w-16 rounded-2xl bg-amber-100" />
            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
              <div className="mt-3 h-8 w-28 rounded-full bg-[#CCFBF1]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardStackVisual({ title = "必要な情報を、順番に整理", items = ["写真・紹介文", "法定表示", "問い合わせ導線"], accent = "teal" }) {
  const color = accent === "line" ? "bg-[#06C755]" : accent === "amber" ? "bg-[#D97706]" : "bg-[#0F766E]";
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -right-4 top-6 h-full w-full rounded-[1.75rem] border border-[#E7D9C8] bg-[#F7F0E7]" />
      <div className="image-sheen relative rounded-[1.75rem] border border-[#E6D8C8] bg-white p-5 shadow-2xl shadow-[#6B4E35]/10">
        <div className="rounded-2xl bg-[#FFFCF7] p-5">
          <div className={`mb-5 h-12 w-12 rounded-2xl ${color}`} />
          <h3 className="text-2xl font-black leading-tight text-[#1F2D28]">{title}</h3>
          <div className="mt-6 space-y-3">
            {items.map((item, index) => (
              <div key={item} className="card-stagger flex items-center gap-3 rounded-xl border border-[#E9DED1] bg-white p-4">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${color}`}>{index + 1}</span>
                <span className="font-bold text-[#38463F]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductVisual({ caption = "公開後の管理画面" }) {
  return (
    <div className="image-sheen rounded-[1.75rem] border border-[#E6D8C8] bg-white p-4 shadow-2xl shadow-[#6B4E35]/10">
      <img className="aspect-[4/3] w-full rounded-[1.25rem] object-cover" src="/assets/generated/product-dashboard.png" alt="" />
      <p className="mt-4 rounded-xl bg-[#ECFDF5] px-4 py-3 text-sm font-black text-[#0F766E]">{caption}</p>
    </div>
  );
}

export function TimelineVisual({ steps }) {
  return (
    <div className="image-sheen rounded-[1.75rem] border border-[#E6D8C8] bg-white p-6 shadow-2xl shadow-[#6B4E35]/10">
      <div className="space-y-4">
        {steps.slice(0, 4).map((step, index) => (
          <div key={step} className="timeline-stagger grid grid-cols-[3rem_1fr] gap-4">
            <div className="flex flex-col items-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0F766E] text-sm font-black text-white">{index + 1}</span>
              {index < 3 && <span className="mt-2 h-10 w-px bg-[#D8C6B2]" />}
            </div>
            <div className="rounded-xl bg-[#FFFCF7] p-4">
              <p className="font-black text-[#1F2D28]">{step}</p>
              <p className="mt-1 text-sm text-[#596760]">担当者が確認し、次に必要な準備を明確にします。</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingVisual() {
  return (
    <div className="image-sheen grid gap-4 rounded-[1.75rem] border border-[#E6D8C8] bg-white p-5 shadow-2xl shadow-[#6B4E35]/10">
      {["スタンダード", "プレミアム"].map((plan, index) => (
        <div key={plan} className={`card-stagger rounded-2xl border p-5 ${index ? "border-[#F2C48D] bg-[#FFF7ED]" : "border-[#99D6CC] bg-[#F0FDFA]"}`}>
          <p className="font-black text-[#1F2D28]">{plan}</p>
          <p className={`mt-2 text-4xl font-black ${index ? "text-[#D97706]" : "text-[#0F766E]"}`}>{index ? "¥29,800" : "¥19,800"}</p>
          <p className="mt-2 text-sm font-bold text-[#596760]">初期費用0円 / 制作・運用込み</p>
        </div>
      ))}
    </div>
  );
}

export function LineChatVisual({ title = "LINEでかんたん更新" }) {
  return (
    <div className="image-sheen rounded-[1.75rem] border border-green-200 bg-white p-5 shadow-2xl shadow-green-900/10">
      <div className="rounded-[1.35rem] bg-[#E8F8EC] p-5">
        <p className="mb-5 font-black text-[#058D3D]">{title}</p>
        <div className="space-y-3">
          <div className="mr-12 rounded-2xl bg-white p-4 text-sm font-bold text-[#1F2D28]">写真を追加しました。掲載しますか？</div>
          <div className="ml-14 rounded-2xl bg-[#06C755] p-4 text-sm font-bold text-white">募集中で掲載</div>
          <div className="mr-10 rounded-2xl bg-white p-4 text-sm font-bold text-[#1F2D28]">HPに反映しました。予約導線も有効です。</div>
        </div>
      </div>
    </div>
  );
}

export function ContactFormVisual() {
  return (
    <div className="image-sheen rounded-[1.75rem] border border-[#E6D8C8] bg-white p-6 shadow-2xl shadow-[#6B4E35]/10">
      <p className="text-xl font-black text-[#1F2D28]">無料相談フォーム</p>
      <div className="mt-5 space-y-4">
        {["犬舎・猫舎名", "現在のHP URL", "相談したい内容"].map((label, index) => (
          <label key={label} className="block">
            <span className="text-sm font-bold text-[#596760]">{label}</span>
            <div className={`mt-2 rounded-xl border border-[#E6D8C8] bg-[#FFFCF7] ${index === 2 ? "h-24" : "h-12"}`} />
          </label>
        ))}
      </div>
      <div className="mt-5 rounded-lg bg-[#0F766E] py-4 text-center font-black text-white">送信内容を確認</div>
    </div>
  );
}

export const featureCards = [
  ["LINE更新", "写真と基本情報を送るだけで子犬・子猫情報をHPへ反映。", "LINE"],
  ["SEO標準装備", "犬舎名・猫舎名の指名検索と地域検索を見据えた構造。", "SEO"],
  ["16ページ以上生成", "トップ、一覧、詳細、親紹介、FAQ、法定表示まで自動生成。", "16"],
  ["成長記録", "体重、ワクチン、健康診断を記録して安心材料に。", "健"],
  ["見学予約", "プレミアムではLINEから空き日時予約とリマインドを自動化。", "予"],
  ["安心運用", "SSL、バックアップ、写真最適化、サポートを月額内に含めます。", "守"],
];
