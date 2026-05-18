import React from "react";
import LegalPage from "./LegalPage";

export default function Terms() {
  return (
    <LegalPage
      eyebrow="利用規約"
      title="Breeders Flow利用規約"
      lead="サービスをご利用いただく前に確認いただく基本条件です。正式導入時は契約内容を優先します。"
      rows={[["適用", "本規約はBreeders Flowの利用に関する条件を定めます"], ["利用料金", "料金ページに記載の月額費用、オプション、キャンペーン条件に従います"], ["禁止事項", "法令違反、虚偽情報の掲載、第三者権利の侵害、サービス運営の妨害"], ["免責", "外部サービス仕様変更、通信障害、利用者側情報不備による損害は責任範囲外です"]]}
    />
  );
}
