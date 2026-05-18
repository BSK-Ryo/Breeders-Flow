export function Card({ as: Component = 'article', className = '', children, ...props }) {
  return (
    <Component
      className={[
        'rounded-component border border-brand-border bg-white p-5 shadow-sm transition duration-200',
        'hover:-translate-y-0.5 hover:shadow-soft',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}
