import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Beginner() {
  return (
    <PageShell>
      <Hero eyebrow="はじめての方へ" title="HPに詳しくなくても、ブリーダーの価値はきちんと伝えられます。" lead="必要なのは専門知識ではなく、日々の写真と情報だけ。初期設定から公開後の更新まで、ブリーダー業務に合わせて支援します。" visual={<CardStackVisual title="はじめてのHP準備" items={["写真を集める", "犬舎の想いを整理", "公開後はLINEで更新"]} />} />
      <Section title="はじめてでも迷わない3つの理由">
        <Grid>
          <Card title="LINEで更新できる" body="パソコン作業が苦手でも、普段使うLINEから掲載・修正・非表示ができます。" icon="1" />
          <Card title="必要ページを自動生成" body="トップ、子犬・子猫一覧、詳細、親紹介、FAQ、法定表示まで用意します。" icon="2" />
          <Card title="文章も一緒に整理" body="犬舎の想い、健康管理、譲渡方針が伝わる見せ方に整えます。" icon="3" />
        </Grid>
      </Section>
      <Section shaded title="公開までにご用意いただくもの" lead="完璧に揃っていなくても大丈夫です。ある情報から順番にサイト化します。">
        <Grid cols="md:grid-cols-2">
          {["犬舎・猫舎の紹介文", "写真・ロゴ・メイン画像", "動物取扱業登録情報", "譲渡までの流れと見学条件"].map((item) => <Card key={item} title={item} body="初回ヒアリングで不足箇所を確認し、必要な原稿や写真の方向性をご案内します。" icon="✓" />)}
        </Grid>
      </Section>
      <CTA title="まずは今の状況を聞かせてください" />
    </PageShell>
  );
}
