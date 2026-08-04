import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  tooltip?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required,
  tooltip,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`input-field${error ? ' input-error' : ''}`}
          style={{ appearance: 'none', cursor: 'pointer', paddingRight: '2.5rem' }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div style={{
          position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}>
          <ChevronDown style={{
            width: '16px', height: '16px',
            color: isFocused ? '#14b8a6' : '#475569',
            transition: 'color 0.2s',
          }} />
        </div>
      </div>

      {error && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
