import React from "react";
import { Card, ContactFormVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Contact() {
  return (
    <PageShell>
      <Hero
        eyebrow="お問い合わせ"
        title="まずは、今の状況をお聞かせください。"
        lead="新規制作、既存HPからの乗り換え、LINE活用、公開までの流れなど。無理な営業はせず、必要な進め方だけを整理してご案内します。"
        cta="LINEで相談する"
        secondary="料金を見る"
        visual={<ContactFormVisual />}
      />
      <Section title="相談方法を選べます" lead="Webに詳しくない方でも、現在の状況をそのままお伝えいただければ大丈夫です。">
        <Grid>
          <Card title="LINEで相談" body="スマホから気軽に相談したい方。写真や現在のHPもそのまま送れます。" icon="L" accent="line">
            <a className="mt-5 inline-flex rounded-lg bg-[#06C755] px-5 py-3 text-sm font-black text-white" href="https://lin.ee/KPL57il">
              LINEを開く
            </a>
          </Card>
          <Card title="無料デモ依頼" body="画面を見ながら、どこまで自動化できるか確認したい方向けです。" icon="デ" />
          <Card title="乗り換え相談" body="既存HP、ドメイン、写真、文章を活かせるか確認します。" icon="移" />
        </Grid>
      </Section>
      <Section shaded title="お問い合わせフォーム">
        <form
          action="https://formsubmit.co/r.tada@breeders-flow.com"
          method="POST"
          className="mx-auto grid max-w-4xl gap-5 rounded-[1.75rem] border border-[#E6D8C8] bg-white p-6 shadow-2xl shadow-[#6B4E35]/10 md:grid-cols-2"
        >
          <input type="hidden" name="_subject" value="Breeders Flow お問い合わせ" />
          <input type="hidden" name="_next" value="https://breeders-flow.com/contact/?sent=true" />
          <label className="block">
            <span className="text-sm font-black text-[#38463F]">お名前</span>
            <input name="name" required className="mt-2 h-12 w-full rounded-lg border border-[#E6D8C8] bg-[#FFFCF7] px-4 outline-none focus:border-[#0F766E]" placeholder="例）山田 太郎" />
          </label>
          <label className="block">
            <span className="text-sm font-black text-[#38463F]">犬舎・猫舎名</span>
            <input name="kennel" className="mt-2 h-12 w-full rounded-lg border border-[#E6D8C8] bg-[#FFFCF7] px-4 outline-none focus:border-[#0F766E]" placeholder="例）○○犬舎" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-black text-[#38463F]">メールアドレス</span>
            <input type="email" name="email" required className="mt-2 h-12 w-full rounded-lg border border-[#E6D8C8] bg-[#FFFCF7] px-4 outline-none focus:border-[#0F766E]" placeholder="example@example.com" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-black text-[#38463F]">ご相談内容</span>
            <textarea name="message" required rows="6" className="mt-2 w-full rounded-lg border border-[#E6D8C8] bg-[#FFFCF7] px-4 py-3 outline-none focus:border-[#0F766E]" placeholder="現在のHPの有無、犬種・猫種、相談したい内容などをご記入ください。" />
          </label>
          <div className="md:col-span-2">
            <button className="button-lift w-full rounded-lg bg-[#0F766E] px-7 py-4 font-black text-white md:w-auto" type="submit">
              無料相談をはじめる
            </button>
          </div>
        </form>
      </Section>
      <CTA title="LINEまたはフォームからご連絡ください" />
    </PageShell>
  );
}
