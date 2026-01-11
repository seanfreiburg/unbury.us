import { useId, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  success?: boolean;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helpText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputClasses = [
      'form-control',
      error ? 'input-error' : '',
      success ? 'input-success' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="form-group">
        {label && <label htmlFor={inputId}>{label}</label>}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        {helpText && <small className="form-text text-muted">{helpText}</small>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
