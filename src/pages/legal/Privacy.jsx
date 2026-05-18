import React from "react";
import LegalPage from "./LegalPage";

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="プライバシーポリシー"
      title="個人情報の取り扱い"
      lead="お問い合わせ、相談、サービス提供に必要な範囲で個人情報を取り扱います。"
      rows={[["取得する情報", "氏名、事業者名、メールアドレス、電話番号、LINE情報、相談内容など"], ["利用目的", "お問い合わせ対応、サービス案内、契約・請求・サポート、品質改善"], ["第三者提供", "法令に基づく場合を除き、本人の同意なく第三者へ提供しません"], ["安全管理", "適切なアクセス管理と情報管理に努めます"]]}
    />
  );
}
