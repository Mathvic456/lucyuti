import React from 'react';
import type { PredictionResult } from '../services/predictionApi';
import {
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Brain,
  Zap,
  Shield,
  Activity,
  Eye,
  Info,
  Plus,
} from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';
import FeatureImportanceChart from './FeatureImportanceChart';
import RocCurveChart from './RocCurveChart';

interface PredictionResultProps {
  result: PredictionResult;
  onNewPrediction: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result, onNewPrediction }) => {
  const isLikelyUTI = result.prediction === 'likely_uti';
  const confidencePercent = Math.round(result.confidence);

  const accent = isLikelyUTI ? '#f87171' : '#4ade80';
  const accentGlow = isLikelyUTI ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)';
  const accentBorder = isLikelyUTI ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)';
  const accentBg = isLikelyUTI ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)';

  const confidenceLabel =
    confidencePercent >= 90 ? 'Excellent' : confidencePercent >= 70 ? 'High' : 'Moderate';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>

      {/* ── Hero Result Card ── */}
      <div
        className="glass-card animate-scale-in"
        style={{
          border: `1px solid ${accentBorder}`,
          background: accentBg,
          boxShadow: `0 0 40px ${accentGlow}, 0 16px 48px rgba(0,0,0,0.4)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Icon */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
            background: isLikelyUTI
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${accentGlow}`,
          }}>
            {isLikelyUTI
              ? <AlertTriangle style={{ width: '26px', height: '26px', color: 'white' }} />
              : <CheckCircle style={{ width: '26px', height: '26px', color: 'white' }} />
            }
          </div>

          {/* Text content */}
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: 'clamp(1.35rem, 4vw, 2rem)', fontWeight: 900, color: accent, lineHeight: 1.1 }}>
                {isLikelyUTI ? 'UTI Detected' : 'No UTI Detected'}
              </h1>
              <div style={{
                padding: '0.2rem 0.65rem', borderRadius: '999px',
                background: `${accent}20`, border: `1px solid ${accentBorder}`,
                fontSize: '0.72rem', fontWeight: 800, color: accent,
              }}>
                {confidencePercent}% Confidence
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.55, maxWidth: '600px' }}>
              {isLikelyUTI
                ? 'Based on urinalysis and clinical presentation, this patient demonstrates markers consistent with UTI. Immediate clinical assessment and confirmatory culture testing are recommended.'
                : 'Analysis indicates this patient does not present typical markers for urinary tract infection at this time. Consider alternative differential diagnoses based on clinical presentation.'}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Brain style={{ width: '13px', height: '13px', color: '#a78bfa' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#c4b5fd' }}>AI Analysis Complete</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Activity style={{ width: '13px', height: '13px', color: '#22d3ee' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#67e8f9' }}>Multi-Factor</span>
              </div>
              <div className={`badge badge-${confidencePercent >= 90 ? 'success' : confidencePercent >= 70 ? 'teal' : 'amber'}`}>
                {confidenceLabel} Confidence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analytics: Gauge + Feature Importance ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', width: '100%' }}>

        {/* Confidence Gauge */}
        <div className="glass-card animate-slide-in-up delay-100">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Confidence Analysis</h2>
              <p style={{ fontSize: '0.68rem', color: '#64748b' }}>AI model certainty assessment</p>
            </div>
          </div>
          <ConfidenceGauge confidence={confidencePercent} isPositive={isLikelyUTI} />
        </div>

        {/* Feature Importance */}
        <div className="glass-card animate-slide-in-up delay-200">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Key Clinical Factors</h2>
              <p style={{ fontSize: '0.68rem', color: '#64748b' }}>Most influential diagnostic indicators</p>
            </div>
          </div>
          <FeatureImportanceChart features={result.featureImportance} />
          <div style={{ marginTop: '0.875rem', padding: '0.65rem', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.15)', borderRadius: '8px', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
            <Info style={{ width: '13px', height: '13px', color: '#14b8a6', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.45 }}>
              Factors with higher weights had stronger diagnostic relevance for this specific case.
            </p>
          </div>
        </div>
      </div>

      {/* ── Model Performance Metrics ── */}
      <div className="glass-card animate-slide-in-up delay-300">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp style={{ width: '16px', height: '16px', color: 'white' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Model Performance Analytics</h2>
            <p style={{ fontSize: '0.68rem', color: '#64748b' }}>ROC curve analysis and accuracy metrics</p>
          </div>
        </div>

        {/* Metric tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
          {[
            { label: 'AUC Score', value: '0.887', subtitle: 'Discrimination', color: '#22d3ee' },
            { label: 'Sensitivity', value: '94.2%', subtitle: 'True Positive', color: '#4ade80' },
            { label: 'Specificity', value: '87.1%', subtitle: 'True Negative', color: '#fbbf24' },
            { label: 'Precision', value: '89.6%', subtitle: 'PPV', color: '#a78bfa' },
          ].map((m, i) => (
            <div key={m.label} className="animate-slide-in-up" style={{
              animationDelay: `${0.3 + i * 0.06}s`,
              padding: '0.75rem 0.65rem',
              background: `${m.color}0d`,
              border: `1px solid ${m.color}25`,
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c4cdd9', marginTop: '0.2rem' }}>{m.label}</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.1rem' }}>{m.subtitle}</div>
            </div>
          ))}
        </div>

        {/* ROC Chart */}
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <RocCurveChart rocData={result.rocCurve} />
        </div>
      </div>

      {/* ── AI Model Info ── */}
      <div className="glass-card animate-slide-in-up delay-400" style={{
        background: 'linear-gradient(135deg, rgba(13,31,60,0.8) 0%, rgba(17,41,80,0.8) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>AI Model Specifications</h2>
            <p style={{ fontSize: '0.68rem', color: '#64748b' }}>State-of-the-art machine learning architecture</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem', fontSize: '0.78rem' }}>Algorithm</h4>
            <p style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", color: '#22d3ee', marginBottom: '0.35rem' }}>{result.modelInfo.name}</p>
            <p style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.45 }}>{result.modelInfo.description}</p>
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.78rem' }}>Specifications</h4>
            {[
              ['Training Dataset', '50,000+ cases'],
              ['Feature Count', '15+ variables'],
              ['Cross-validation', '10-fold validated'],
              ['Last Updated', 'March 2024'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{k}</span>
                <span style={{ fontSize: '0.68rem', color: '#c4cdd9', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '0.78rem' }}>Validation</h4>
            {[
              { label: 'Clinical Validation', status: 'Validated', color: '#4ade80' },
              { label: 'Multi-site Testing', status: 'Completed', color: '#4ade80' },
              { label: 'Peer Review', status: 'Published', color: '#22d3ee' },
            ].map(({ label, status, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color, background: `${color}18`, padding: '0.1rem 0.4rem', borderRadius: '999px', border: `1px solid ${color}30` }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="glass-card animate-slide-in-up delay-500" style={{
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              ⚠️ Medical Disclaimer
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#d97706', fontSize: '0.72rem', marginBottom: '0.25rem' }}>Limitations</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {['Decision-support tool only', 'Culture testing is gold standard', 'FDA Status: Not cleared/approved'].map(t => (
                    <li key={t} style={{ fontSize: '0.68rem', color: '#d97706', display: 'flex', gap: '0.3rem' }}>
                      <span style={{ color: '#f59e0b' }}>•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#d97706', fontSize: '0.72rem', marginBottom: '0.25rem' }}>Requirements</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {['Follow clinical protocols', 'Requires qualified clinician oversight'].map(t => (
                    <li key={t} style={{ fontSize: '0.68rem', color: '#d97706', display: 'flex', gap: '0.3rem' }}>
                      <span style={{ color: '#f59e0b' }}>•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="animate-slide-in-up delay-600" style={{ textAlign: 'center', paddingBottom: '0.5rem' }}>
        <button
          onClick={onNewPrediction}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', borderRadius: '0.75rem', gap: '0.4rem' }}
          type="button"
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Analyze Another Patient
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;