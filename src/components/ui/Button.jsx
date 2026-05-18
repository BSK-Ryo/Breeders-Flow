const variants = {
  primary: 'bg-brand-teal text-white shadow-lift hover:bg-teal-800 focus-visible:outline-brand-teal',
  secondary:
    'border border-brand-border bg-white text-brand-ink shadow-sm hover:border-brand-teal hover:bg-brand-tealLight/35 focus-visible:outline-brand-teal',
  line: 'bg-brand-line text-white shadow-lift hover:brightness-95 focus-visible:outline-brand-line',
  ghost: 'text-brand-teal hover:bg-brand-tealLight/45 focus-visible:outline-brand-teal',
};

export function Button({ as: Component = 'a', variant = 'primary', className = '', children, ...props }) {
  return (
    <Component
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-component px-5 py-2.5 text-sm font-bold transition duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
