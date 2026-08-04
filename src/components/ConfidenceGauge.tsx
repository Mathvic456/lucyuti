import React, { useEffect, useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface ConfidenceGaugeProps {
  confidence: number;
  isPositive: boolean;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ confidence, isPositive }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedValue(confidence), 200);
    return () => clearTimeout(t);
  }, [confidence]);

  const getStyles = () => {
    if (isPositive) {
      if (confidence >= 90) return { color: '#f87171', glow: 'rgba(248,113,113,0.4)', level: 'Very High Risk', grad: ['#ef4444', '#dc2626'] };
      if (confidence >= 70) return { color: '#fb923c', glow: 'rgba(251,146,60,0.4)', level: 'High Risk', grad: ['#f97316', '#ea580c'] };
      return { color: '#fbbf24', glow: 'rgba(251,191,36,0.4)', level: 'Moderate Risk', grad: ['#f59e0b', '#d97706'] };
    } else {
      if (confidence >= 90) return { color: '#4ade80', glow: 'rgba(74,222,128,0.4)', level: 'Very Low Risk', grad: ['#22c55e', '#16a34a'] };
      if (confidence >= 70) return { color: '#22d3ee', glow: 'rgba(34,211,238,0.4)', level: 'Low Risk', grad: ['#06b6d4', '#0891b2'] };
      return { color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', level: 'Uncertain', grad: ['#64748b', '#475569'] };
    }
  };

  const styles = getStyles();
  const circumference = 2 * Math.PI * 80;
  const filled = (animatedValue / 100) * circumference;

  const radialData = [{ value: animatedValue, fill: styles.color }];

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Circular gauge using SVG + recharts radial overlay */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        {/* SVG ring */}
        <svg width="200" height="200" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={styles.grad[0]} />
              <stop offset="100%" stopColor={styles.grad[1]} />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background track */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
          {/* Animated foreground */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            className="gauge-progress"
            filter="url(#gaugeGlow)"
            style={{ filter: `drop-shadow(0 0 10px ${styles.glow})` }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: styles.color, lineHeight: 1 }}>
            {animatedValue}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>%</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.4rem' }}>
            <TrendIcon style={{ width: '14px', height: '14px', color: styles.color }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: styles.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {styles.level}
            </span>
          </div>
        </div>

        {/* Outer glow ring for high confidence */}
        {confidence >= 85 && (
          <div style={{
            position: 'absolute', inset: '-6px',
            borderRadius: '50%',
            border: `2px solid ${styles.color}`,
            opacity: 0.2,
            animation: 'pulseSlow 2.5s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Linear progress bar */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Confidence Level</span>
          <span style={{ fontSize: '0.75rem', color: styles.color, fontWeight: 700 }}>{confidence}%</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${animatedValue}%`,
            background: `linear-gradient(90deg, ${styles.grad[0]}, ${styles.grad[1]})`,
            borderRadius: '4px',
            boxShadow: `0 0 10px ${styles.glow}`,
            transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>
        {/* Markers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
          {['Low', '25%', '50%', '75%', 'High'].map((m) => (
            <span key={m} style={{ fontSize: '0.65rem', color: '#334155', fontWeight: 500 }}>{m}</span>
          ))}
        </div>
      </div>

      {/* Level badge */}
      <div style={{
        padding: '0.6rem 1.25rem',
        borderRadius: '999px',
        background: `${styles.color}18`,
        border: `1px solid ${styles.color}35`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Target style={{ width: '14px', height: '14px', color: styles.color }} />
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: styles.color }}>
          {styles.level}
        </span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
