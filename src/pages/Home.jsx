import React from "react";
import { Card, CTA, Grid, PageShell, Section, featureCards } from "./_PageKit";

const badges = ["初期費用0円", "スマホだけで更新", "SEO標準対応"];

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -left-4 top-8 hidden h-24 w-24 rounded-full bg-[#FDEDD8] md:block" />
      <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-[#DDF3EE]" />
      <div className="relative overflow-hidden rounded-[20px] border border-[#E6D8C8] bg-white p-3 shadow-[0_26px_70px_rgba(86,64,43,0.16)]">
        <img
          src="/assets/generated/hero-breeder-puppy.png"
          alt="ブリーダーと子犬のあたたかいホームページイメージ"
          className="aspect-[4/5] w-full rounded-xl object-cover"
        />
        <div className="absolute bottom-7 left-7 right-7 rounded-xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#0F766E]">Breeders Flow</p>
          <p className="mt-1 text-lg font-black text-[#1F2D28]">写真と想いが伝わる直販サイト</p>
        </div>
      </div>
    </div>
  );
}

function ProductVisual() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#E6D8C8] bg-white p-3 shadow-[0_24px_70px_rgba(86,64,43,0.12)]">
      <img
        src="/assets/generated/product-dashboard.png"
        alt="Breeders Flowの管理画面とホームページ更新イメージ"
        className="w-full rounded-xl object-cover"
      />
    </div>
  );
}

export default function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#FFFCF7] px-5 pb-16 pt-10 md:min-h-[calc(100vh-4rem)] md:pb-20 md:pt-14">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.02fr_.98fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#D8C6B2] bg-white px-4 py-2 text-sm font-black text-[#0F766E] shadow-sm">
              ブリーダー専用ホームページ制作・運用
            </p>
            <h1 className="mt-7 text-4xl font-black leading-tight tracking-normal text-[#1F2D28] md:text-[64px]">
              ブリーダーの想いが、伝わるホームページへ。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#596760]">
              子犬・子猫の魅力、飼育環境、健康管理、譲渡への考え方まで。Breeders Flowはスマホから更新できる専用サイトで、見学予約と問い合わせにつながる信頼導線を整えます。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-[#E6D8C8] bg-white px-4 py-2 text-sm font-black text-[#38463F]">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/contact/" className="rounded-lg bg-[#0F766E] px-7 py-4 text-center font-black text-white shadow-lg shadow-teal-900/10">
                無料で相談する
              </a>
              <a href="/demo/" className="rounded-lg border border-[#D8C6B2] bg-white px-7 py-4 text-center font-black text-[#38463F]">
                デモサイトを見る
              </a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <Section eyebrow="Breeder's worries" title="ポータルだけでは伝わりきらない価値があります" lead="価格や写真の比較で終わらせず、犬舎・猫舎の姿勢を自分の言葉で残せる場所を作ります。">
        <Grid cols="md:grid-cols-2">
          {["ポータル手数料が利益を圧迫している", "SNSで認知はあるのに問い合わせ先が弱い", "健康管理や飼育環境のこだわりが伝わらない", "犬舎名・猫舎名で検索しても比較サイトに流れる"].map((text) => (
            <Card key={text} title={text} body="写真・記録・問い合わせ導線をひとつのHPにまとめ、検討者が安心して相談できる状態を作ります。" icon="!" accent="amber" />
          ))}
        </Grid>
      </Section>

      <Section shaded eyebrow="Product" title="スマホ更新から公開ページまで、ひとつにつながる" lead="LINEのような軽い運用感で情報を登録し、見学前に必要な安心材料をホームページへ反映します。">
        <div className="grid items-center gap-8 md:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-4">
            {featureCards.slice(0, 3).map(([title, body, icon]) => (
              <Card key={title} title={title} body={body} icon={icon} />
            ))}
          </div>
          <ProductVisual />
        </div>
      </Section>

      <Section eyebrow="What changes" title="Breeders Flowで、こう変わる。">
        <Grid>{featureCards.slice(3).map(([title, body, icon]) => <Card key={title} title={title} body={body} icon={icon} />)}</Grid>
      </Section>

      <Section title="初期費用0円キャンペーン実施中" lead="スタンダード月額19,800円、6ヶ月目以降は14,800円。プレミアムではLINE集客・予約・自動応答まで含みます。">
        <div className="rounded-[20px] border border-[#E6D8C8] bg-white p-8 text-center shadow-sm">
          <p className="text-5xl font-black text-[#0F766E]">¥0</p>
          <p className="mt-3 font-bold text-[#38463F]">通常初期費用50,000円が毎月5社限定で無料</p>
        </div>
      </Section>
      <CTA />
    </PageShell>
  );
}
