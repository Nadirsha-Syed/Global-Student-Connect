import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  helperText,
  required = false,
  className = '',
  disabled = false,
  as = 'input',
  rows = 3,
  children,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const effectiveType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label} {required && <span style={{ color: 'var(--coral)' }}>*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {Icon && <Icon size={18} className="field-icon-left" />}

        {as === 'textarea' ? (
          <textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`input-field ${Icon ? 'input-icon-left' : ''}`}
            style={{ resize: 'vertical' }}
            {...props}
          />
        ) : as === 'select' ? (
          <select
            id={inputId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`input-field ${Icon ? 'input-icon-left' : ''}`}
            {...props}
          >
            {children}
          </select>
        ) : (
          <input
            id={inputId}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`input-field ${Icon ? 'input-icon-left' : ''} ${
              type === 'password' ? 'input-icon-right' : ''
            }`}
            {...props}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            className="field-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center' }}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="input-error-msg">{error}</p>}
      {helperText && !error && (
        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
