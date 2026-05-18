import { Container } from './Container.jsx';

const groups = [
  {
    title: 'サービス',
    links: [
      ['はじめての方へ', '/beginner/'],
      ['機能紹介', '/features/'],
      ['料金プラン', '/pricing/'],
      ['デモサイト', '/demo/'],
    ],
  },
  {
    title: 'サポート',
    links: [
      ['公開までの流れ', '/flow/'],
      ['HPを乗り換えたい方へ', '/migration/'],
      ['よくある質問', '/faq/'],
      ['お問い合わせ', '/contact/'],
    ],
  },
  {
    title: '運営・規約',
    links: [
      ['運営者情報', '/about-us/'],
      ['プライバシーポリシー', '/privacy/'],
      ['利用規約', '/terms/'],
      ['特商法表記', '/tokushoho/'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E6D8C8] bg-white py-12">
      <Container className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <a href="/" className="text-xl font-black text-[#0F766E]">
            Breeders Flow
          </a>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#596760]">
            ブリーダーの想い、健康管理、日々の更新を伝わるホームページに整える制作・運用サービスです。
          </p>
          <a
            href="mailto:r.tada@breeders-flow.com"
            className="mt-5 inline-flex rounded-lg border border-[#D8C6B2] bg-[#FFFCF7] px-4 py-2 text-sm font-bold text-[#38463F]"
          >
            r.tada@breeders-flow.com
          </a>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="font-black text-[#1F2D28]">{group.title}</p>
              <div className="mt-4 grid gap-3">
                {group.links.map(([label, href]) => (
                  <a key={href} href={href} className="text-sm font-bold text-[#596760] transition hover:text-[#0F766E]">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="border-t border-[#E6D8C8] pt-6 text-xs font-bold text-[#596760] md:col-span-2">
          © Breeders Flow. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
