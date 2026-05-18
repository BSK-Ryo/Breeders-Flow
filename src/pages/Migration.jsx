import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Migration() {
  return (
    <PageShell>
      <Hero eyebrow="HPを乗り換えたい方へ" title="古いHPから、更新しやすい自社HPへ。" lead="現在のドメイン・写真・文章を活かしながら、スマホ対応、SEO、LINE更新に対応したサイトへ移行します。" visual={<CardStackVisual title="移行チェックリスト" items={["ドメインを確認", "写真と文章を移す", "LINE更新へ切り替え"]} accent="amber" />} />
      <Section title="乗り換えで改善すること">
        <Grid>
          <Card title="更新待ちをなくす" body="制作会社への依頼待ちではなく、LINEから必要な時に更新できます。" icon="速" />
          <Card title="スマホで見やすく" body="検討者の大半が見るスマホ画面で、写真と問い合わせ導線を最適化します。" icon="SP" />
          <Card title="古い情報を整理" body="料金、譲渡条件、法定表示、FAQを最新の状態に整えます。" icon="整" />
        </Grid>
      </Section>
      <Section shaded title="移行時に確認するもの">
        <Grid cols="md:grid-cols-2">
          {["現在のドメイン管理状況", "掲載中の写真・文章", "メールフォームや問い合わせ先", "検索流入を維持したいページ"].map((item) => <Card key={item} title={item} icon="✓" />)}
        </Grid>
      </Section>
      <CTA title="今のHPを見ながら移行計画を作ります" />
    </PageShell>
  );
}
