import React, { useState } from 'react';
import { HelpCircle, Check } from 'lucide-react';

interface CheckboxInputProps {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  sublabel,
  checked,
  onChange,
  tooltip,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        cursor: 'pointer',
        padding: '0.875rem 1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${checked ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.08)'}`,
        background: checked ? 'rgba(20,184,166,0.07)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s',
        boxShadow: checked ? '0 0 16px rgba(20,184,166,0.1)' : 'none',
        width: '100%',
      }}
      onMouseEnter={e => {
        if (!checked) {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        }
      }}
      onMouseLeave={e => {
        if (!checked) {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
        }
      }}
    >
      {/* Custom checkbox */}
      <div style={{ position: 'relative', paddingTop: '2px', flexShrink: 0 }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div style={{
          width: '20px', height: '20px', borderRadius: '6px',
          border: `2px solid ${checked ? '#14b8a6' : 'rgba(255,255,255,0.2)'}`,
          background: checked ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : 'rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: checked ? '0 0 10px rgba(20,184,166,0.35)' : 'none',
        }}>
          {checked && <Check style={{ width: '12px', height: '12px', color: 'white' }} strokeWidth={3} />}
        </div>
      </div>

      {/* Label area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: checked ? '#e2e8f0' : '#94a3b8', lineHeight: 1.3, transition: 'color 0.2s' }}>
              {label}
            </h4>
            {sublabel && (
              <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.4 }}>{sublabel}</p>
            )}
          </div>
          {tooltip && (
            <div style={{ position: 'relative', flexShrink: 0, display: 'inline-flex' }}>
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => { e.preventDefault(); setShowTooltip(!showTooltip); }}
                style={{ color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                aria-label={`Help: ${label}`}
              >
                <HelpCircle style={{ width: '14px', height: '14px' }} />
              </button>
              {showTooltip && (
                <div className="tooltip-popup animate-fade-in">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </label>
  );
};

export default CheckboxInput;
