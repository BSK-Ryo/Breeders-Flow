const tones = {
  warm: 'bg-brand-warm',
  white: 'bg-white',
  section: 'bg-brand-section',
  teal: 'bg-brand-teal text-white',
};

export function Section({ as: Component = 'section', tone = 'warm', className = '', children, ...props }) {
  return (
    <Component className={['py-16 md:py-24', tones[tone], className].join(' ')} {...props}>
      {children}
    </Component>
  );
}
