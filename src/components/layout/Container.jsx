export function Container({ className = '', children }) {
  return <div className={['container max-w-6xl', className].join(' ')}>{children}</div>;
}
