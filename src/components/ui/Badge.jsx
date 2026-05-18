const tones = {
  teal: 'bg-brand-tealLight text-brand-teal',
  amber: 'bg-brand-cream text-brand-amber',
  neutral: 'bg-white text-brand-muted ring-1 ring-brand-border',
};

export function Badge({ tone = 'teal', className = '', children }) {
  return (
    <span className={['inline-flex items-center rounded-full px-3 py-1 text-xs font-bold', tones[tone], className].join(' ')}>
      {children}
    </span>
  );
}
