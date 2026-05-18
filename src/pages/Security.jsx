import React from "react";
import { Card, CardStackVisual, CTA, Grid, Hero, PageShell, Section } from "./_PageKit";

export default function Security() {
  return (
    <PageShell>
      <Hero eyebrow="セキュリティ・安心設計" title="お客様情報とサイト運用を、安心して扱える設計に。" lead="SSL、入力フォーム、写真最適化、バックアップ、権限管理を前提に、ブリーダーHPとして必要な安全性を確保します。" visual={<CardStackVisual title="安心運用の標準装備" items={["SSLとフォーム保護", "写真最適化", "法定ページ整備"]} />} />
      <Section title="安心のための標準対応">
        <Grid>
          <Card title="SSL対応" body="サイト全体をHTTPS化し、フォーム送信時の安全性を確保します。" icon="鍵" />
          <Card title="フォーム保護" body="問い合わせ内容を適切に扱い、迷惑送信対策も考慮します。" icon="守" />
          <Card title="写真最適化" body="重い写真を高速表示向けに扱い、スマホでも見やすくします。" icon="写" />
        </Grid>
      </Section>
      <Section shaded title="法令・表示情報も整備" lead="動物取扱業表記、特商法、プライバシーポリシーなど、信頼に関わるページを用意します。" />
      <CTA />
    </PageShell>
  );
}
