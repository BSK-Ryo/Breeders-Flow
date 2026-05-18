import React from "react";
import LegalPage from "./LegalPage";

export default function Tokushoho() {
  return (
    <LegalPage
      eyebrow="特定商取引法に基づく表記"
      title="特定商取引法に基づく表記"
      lead="Breeders Flowの販売条件・支払条件に関する表示です。"
      rows={[["販売価格", "料金ページに記載の各プラン料金"], ["商品代金以外の必要料金", "原則として月額料金に含まれます。個別オプションがある場合は事前に提示します"], ["支払時期・方法", "契約時に定める方法に従います"], ["役務提供時期", "申込後、初期設定と素材確認を経て制作・公開します"], ["キャンセル", "契約条件および解約手続きページをご確認ください"]]}
    />
  );
}
