import React from 'react';
import { getButtonClass, type SurfaceTone } from '../designSystem';
import type { SiteButtonVariant } from '../../config/siteConfig';

export const UIButton: React.FC<{
  children: React.ReactNode;
  variant?: SiteButtonVariant;
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}> = ({ children, variant = 'button-2', tone = 'dark', size = 'sm', className = '', type = 'button', onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={getButtonClass(variant as SiteButtonVariant, tone as SurfaceTone, size as never, className)}
    >
      {children}
    </button>
  );
};

export const UICard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  children,
  className,
}) => (
  <section className={`relative overflow-hidden ds-panel ${className ?? ''}`}>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
    <div className="mb-4 border-b border-white/8 pb-3">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/95">{title}</h2>
      {subtitle ? <p className="mt-1 text-[12px] text-white/52">{subtitle}</p> : null}
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

export const UISectionHeader: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/78">{title}</p>
    {hint ? <p className="mt-1 text-xs text-white/55">{hint}</p> : null}
  </div>
);

export const UIPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`ds-panel-muted ${className ?? ''}`}>{children}</div>
);

export const UIBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`ds-badge ${className ?? ''}`}>{children}</span>
);

export const UIInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({
  label,
  className,
  ...props
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="ds-field-label">{label}</span>
    <input {...props} className={`ds-input ${className ?? ''}`} />
  </label>
);

export const UITextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({
  label,
  className,
  ...props
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="ds-field-label">{label}</span>
    <textarea {...props} className={`ds-textarea ${className ?? ''}`} />
  </label>
);

export const UISelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: Array<{ value: string; label: string }>;
  }
> = ({ label, options, className, ...props }) => (
  <label className="flex flex-col gap-1.5">
    <span className="ds-field-label">{label}</span>
    <select {...props} className={`ds-select ${className ?? ''}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);
