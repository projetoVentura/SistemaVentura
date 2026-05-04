import { useState } from 'react';

export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-main';

  const variants = {
    primary: 'bg-accent text-bg-main hover:bg-accent-hover focus:ring-accent disabled:opacity-50',
    secondary: 'bg-bg-elevated text-text-primary border border-border hover:bg-bg-sidebar focus:ring-accent disabled:opacity-50',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 disabled:opacity-50',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 disabled:opacity-50',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary focus:ring-accent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ label, name, type = 'text', value, onChange, placeholder, required = false, error = '', className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-bg-main text-text-primary placeholder-text-muted ${
          error ? 'border-danger-500' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-danger-400">{error}</p>}
    </div>
  );
}

export function Select({ label, name, value, onChange, options, required = false, error = '', placeholder = 'Selecione...', className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-bg-main text-text-primary ${
          error ? 'border-danger-500' : 'border-border'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, name, value, onChange, placeholder, required = false, rows = 3, error = '', className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none bg-bg-main text-text-primary placeholder-text-muted ${
          error ? 'border-danger-500' : 'border-border'
        }`}
      />
      {error && <p className="text-xs text-danger-400">{error}</p>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative bg-bg-card rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] flex flex-col border border-border`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bg-elevated transition-colors"
          >
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto text-text-primary">{children}</div>
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-bg-elevated text-text-secondary border border-border',
    success: 'bg-success-950 text-success-400 border border-success-700',
    warning: 'bg-warning-950 text-warning-400 border border-warning-700',
    danger: 'bg-danger-950 text-danger-400 border border-danger-700',
    info: 'bg-primary-950 text-primary-400 border border-primary-700',
    purple: 'bg-accent-light text-accent border border-accent/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-card rounded-xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-bg-card rounded-xl shadow-xl w-full max-w-sm p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-danger-950 flex items-center justify-center">
            <svg className="w-5 h-5 text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}
