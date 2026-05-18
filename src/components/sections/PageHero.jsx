import { Badge } from '../ui/Badge.jsx';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';

export function PageHero({ eyebrow, title, lead, actions, children }) {
  return (
    <Section className="overflow-hidden pb-14 pt-16 md:pb-20 md:pt-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up">
          {eyebrow ? <Badge>{eyebrow}</Badge> : null}
          <h1 className="mt-5 max-w-3xl font-serif-jp text-4xl font-black leading-tight tracking-normal text-brand-ink md:text-6xl">
            {title}
          </h1>
          {lead ? <p className="mt-6 max-w-2xl text-base leading-8 text-brand-muted md:text-lg">{lead}</p> : null}
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>
        <div className="min-h-72 rounded-component border border-brand-border bg-white p-4 shadow-soft animate-float">
          <div className="grid h-full min-h-64 place-items-center rounded-component bg-brand-section text-sm font-bold text-brand-muted">
            Visual placeholder
          </div>
        </div>
        {children}
      </Container>
    </Section>
  );
}
