export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`${variant === 'primary' ? 'primary-button' : 'secondary-button'} ${className}`.trim()} {...props}>{children}</button>;
}
