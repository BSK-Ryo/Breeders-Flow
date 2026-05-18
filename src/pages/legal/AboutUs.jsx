import React from "react";
import LegalPage from "./LegalPage";

export default function AboutUs() {
  return (
    <LegalPage
      eyebrow="運営者情報"
      title="Breeders Flowの運営について"
      lead="ブリーダー専用HP制作・運用サービスとして、安心して相談できる運営情報を掲載します。"
      rows={[["サービス名", "Breeders Flow"], ["事業内容", "ブリーダー専用ホームページ制作、更新システム、LINE運用支援"], ["対象", "犬舎・猫舎を運営するブリーダー事業者"], ["お問い合わせ", "お問い合わせページまたはLINEよりご連絡ください"]]}
    />
  );
}
