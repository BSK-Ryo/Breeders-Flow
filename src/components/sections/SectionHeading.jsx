import { Badge } from '../ui/Badge.jsx';

export function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={['mb-10 flex flex-col', alignment, className].join(' ')}>
      {eyebrow ? <Badge tone="amber">{eyebrow}</Badge> : null}
      <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-brand-ink md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted md:text-base">{description}</p> : null}
    </div>
  );
}
