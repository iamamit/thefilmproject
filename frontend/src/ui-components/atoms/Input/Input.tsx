import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={`input-field ${error ? 'input-field--error' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
