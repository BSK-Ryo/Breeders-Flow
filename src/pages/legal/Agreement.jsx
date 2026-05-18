import React from "react";
import LegalPage from "./LegalPage";

export default function Agreement() {
  return (
    <LegalPage
      eyebrow="申込前確認"
      title="お申し込み前の確認事項"
      lead="スムーズに制作・公開するため、事前に確認いただきたい内容です。"
      rows={[["掲載情報", "動物取扱業登録情報、譲渡条件、見学条件、価格表示などを正確にご提供ください"], ["写真素材", "使用権限のある写真・ロゴをご提供ください"], ["料金条件", "月額料金、最低利用期間、キャンペーン適用条件をご確認ください"], ["運用体制", "公開後にLINEまたはWebから情報更新を行う担当者を決めてください"]]}
    />
  );
}
