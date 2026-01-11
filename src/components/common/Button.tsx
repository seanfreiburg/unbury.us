import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', active, className = '', children, ...props }, ref) => {
    const sizeClass = size === 'md' ? '' : `btn-${size}`;
    const activeClass = active ? 'active' : '';

    const buttonClasses = ['btn', `btn-${variant}`, sizeClass, activeClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
