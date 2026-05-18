import { Button } from '../ui/Button.jsx';
import { Container } from './Container.jsx';

export function Header({ items = [] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-brand-warm/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="/" className="text-base font-black tracking-normal text-brand-teal" aria-label="Breeders Flow home">
          Breeders Flow
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {items.map((item) => {
            const isPrimary = item.variant === 'primary' || item.cta;

            if (item.items?.length) {
              return (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className="rounded-component px-3 py-2 text-sm font-bold text-brand-muted transition hover:bg-white hover:text-brand-teal"
                  >
                    {item.label}
                  </button>
                  <div className="invisible absolute left-0 top-full min-w-52 translate-y-2 rounded-component border border-brand-border bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.items.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block rounded-component px-3 py-2 text-sm font-bold text-brand-muted transition hover:bg-brand-warm hover:text-brand-teal"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return isPrimary ? (
              <Button key={item.href} href={item.href} className="ml-2">
                {item.label}
              </Button>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-component px-3 py-2 text-sm font-bold text-brand-muted transition hover:bg-white hover:text-brand-teal"
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <details className="group relative md:hidden">
          <summary className="list-none rounded-component bg-brand-teal px-4 py-2.5 text-sm font-black text-white shadow-lift">
            メニュー
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-component border border-brand-border bg-white p-3 shadow-soft">
            {items.map((item) =>
              item.items?.length ? (
                <div key={item.label} className="border-b border-brand-border/70 py-2 last:border-b-0">
                  <p className="px-3 py-2 text-xs font-black text-brand-teal">{item.label}</p>
                  {item.items.map((child) => (
                    <a key={child.href} href={child.href} className="block rounded-component px-3 py-2 text-sm font-bold text-brand-muted">
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : (
                <a key={item.href} href={item.href} className="block rounded-component px-3 py-2 text-sm font-bold text-brand-muted">
                  {item.label}
                </a>
              ),
            )}
          </div>
        </details>
      </Container>
    </header>
  );
}
