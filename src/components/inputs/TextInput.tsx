import React, { useState } from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

interface TextInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  tooltip?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  placeholder?: string;
  unit?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  tooltip,
  min,
  max,
  step,
  placeholder,
  unit,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
        {label}
        {required && <span style={{ color: '#f87171' }}>*</span>}
        {tooltip && (
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
              aria-label={`Help: ${label}`}
            >
              <HelpCircle style={{ width: '13px', height: '13px' }} />
            </button>
            {showTooltip && (
              <div className="tooltip-popup animate-fade-in">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </label>

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`input-field${error ? ' input-error' : ''}`}
          style={unit ? { paddingRight: '3.5rem' } : undefined}
        />
        {unit && (
          <div style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#475569', fontWeight: 600, pointerEvents: 'none' }}>
            {unit}
          </div>
        )}
      </div>

      {error && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171' }}>
          <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default TextInput;
