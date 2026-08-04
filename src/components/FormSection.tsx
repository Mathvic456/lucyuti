import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  children: React.ReactNode;
}

const COLOR_MAP: Record<string, { accent: string; bg: string; border: string; iconBg: string }> = {
  blue:    { accent: '#60a5fa', bg: 'rgba(59,130,246,0.05)',  border: 'rgba(59,130,246,0.2)',  iconBg: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  emerald: { accent: '#34d399', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.2)', iconBg: 'linear-gradient(135deg,#10b981,#059669)' },
  violet:  { accent: '#a78bfa', bg: 'rgba(139,92,246,0.05)',  border: 'rgba(139,92,246,0.2)', iconBg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  pink:    { accent: '#f472b6', bg: 'rgba(236,72,153,0.05)',  border: 'rgba(236,72,153,0.2)', iconBg: 'linear-gradient(135deg,#ec4899,#db2777)' },
};

const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  icon: Icon,
  color = 'blue',
  children,
}) => {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div
      className="glass-card animate-scale-in"
      style={{
        border: `1px solid ${c.border}`,
        background: c.bg,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        padding: '1.25rem',
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {Icon && (
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
              background: c.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px ${c.accent}30`,
            }}>
              <Icon style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
          )}
          <div>
            <h2 style={{ fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', fontWeight: 800, color: '#f1f5f9' }}>{title}</h2>
            {subtitle && (
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>{subtitle}</p>
            )}
          </div>
        </div>
        <div style={{ height: '1px', background: `linear-gradient(90deg, ${c.accent}40, transparent)`, marginTop: '1rem' }} />
      </div>
      {children}
    </div>
  );
};

export default FormSection;
