import React from "react";
import LegalPage from "./LegalPage";

export default function Cancellation() {
  return (
    <LegalPage
      eyebrow="解約手続き"
      title="解約をご希望の方へ"
      lead="解約時の確認事項と手続きの流れをまとめています。"
      rows={[["最低利用期間", "原則6ヶ月です。個別契約がある場合は契約条件を優先します"], ["申請方法", "お問い合わせまたは指定フォームから解約希望日を添えてご連絡ください"], ["データの扱い", "掲載情報、ドメイン、画像、問い合わせ導線の取り扱いを事前に確認します"], ["注意事項", "解約後はHP更新機能、LINE連携、サポートが停止します"]]}
    />
  );
}
