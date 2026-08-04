import React, { useState } from 'react';
import type { PatientData } from './services/predictionApi';
import type { HistoryEntry } from './hooks/useHistory';
import { usePrediction } from './hooks/usePrediction';
import { useHistory } from './hooks/useHistory';
import PatientForm from './components/PatientForm';
import PredictionResult from './components/PredictionResult';
import PredictionHistory from './components/PredictionHistory';
import {
  Activity,
  Brain,
  Clock,
  BarChart3,
  Shield,
  Home,
  Plus,
  Menu,
  X,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

type View = 'dashboard' | 'form' | 'result' | 'history';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<HistoryEntry | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { loading, error, result, predict, reset } = usePrediction();
  const { entries, addEntry, removeEntry, clearHistory } = useHistory();

  const handleFormSubmit = async (patientData: PatientData) => {
    try {
      const predictionResult = await predict(patientData);
      addEntry(patientData, predictionResult);
      setSelectedHistoryEntry(null);
      setView('result');
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleNewPrediction = () => {
    reset();
    setSelectedHistoryEntry(null);
    setView('form');
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setSelectedHistoryEntry(entry);
    setView('result');
  };

  const navigateTo = (v: View) => {
    setView(v);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: entries.length,
    likelyUTI: entries.filter((e) => e.result.prediction === 'likely_uti').length,
    unlikelyUTI: entries.filter((e) => e.result.prediction === 'unlikely_uti').length,
    avgConfidence:
      entries.length > 0
        ? Math.round(entries.reduce((sum, e) => sum + e.result.confidence, 0) / entries.length)
        : 0,
  };

  const navItems = [
    { key: 'dashboard' as View, label: 'Dashboard', icon: Home },
    { key: 'form' as View, label: 'New Analysis', icon: Plus },
    { key: 'history' as View, label: `History${entries.length > 0 ? ` (${entries.length})` : ''}`, icon: Clock },
  ];

  // Active result: from history entry OR fresh form prediction
  const activeResult = selectedHistoryEntry?.result ?? result;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy-950)', width: '100%', overflowX: 'hidden' }}>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        flexDirection: 'column',
        background: 'rgba(10,22,40,0.9)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }} className="desktop-only no-print">
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(20,184,166,0.3)',
              flexShrink: 0,
            }}>
              <Brain style={{ width: '22px', height: '22px', color: '#0a1628' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.2 }}>
                UTI Decision
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                Support System
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          <div style={{ marginBottom: '0.375rem', padding: '0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Navigation
          </div>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigateTo(key)}
              className={`nav-link${view === key ? ' active' : ''}`}
              style={{ width: '100%', marginBottom: '0.25rem', textAlign: 'left' }}
            >
              <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              {label}
              {view === key && (
                <ChevronRight style={{ width: '14px', height: '14px', marginLeft: 'auto', color: '#14b8a6' }} />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '10px',
            padding: '0.75rem',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.65rem', color: '#d97706', lineHeight: 1.5 }}>
                For clinical decision support only. Not FDA approved.
              </div>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: '#334155', textAlign: 'center' }}>
            v2.0 · AI Clinical Platform
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>

        {/* ===== TOP BAR HEADER ===== */}
        <header style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.875rem',
          background: 'rgba(10,22,40,0.92)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
        }}>
          {/* Logo / Page Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            {/* Mobile Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }} className="mobile-only">
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Brain style={{ width: '15px', height: '15px', color: '#0a1628' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                UTI Decision
              </span>
            </div>
            {/* Desktop page title */}
            <div className="desktop-only-block">
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>
                {view === 'dashboard' && 'Dashboard'}
                {view === 'form' && 'New Patient Analysis'}
                {view === 'result' && 'Prediction Result'}
                {view === 'history' && 'Analysis History'}
              </h1>
            </div>
          </div>

          {/* Right Header items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Online status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} className="animate-pulse-gentle" />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#4ade80' }}>AI Online</span>
            </div>
            {/* Mobile hamburger button */}
            <button
              className="mobile-only btn btn-ghost"
              style={{ padding: '0.4rem 0.6rem', minHeight: '36px' }}
              onClick={() => setMobileNavOpen(prev => !prev)}
              aria-label="Toggle navigation"
              type="button"
            >
              {mobileNavOpen
                ? <X style={{ width: '20px', height: '20px', color: '#2dd4bf' }} />
                : <Menu style={{ width: '20px', height: '20px', color: '#e2e8f0' }} />
              }
            </button>
          </div>
        </header>

        {/* ===== MOBILE NAV OVERLAY & DRAWER ===== */}
        {mobileNavOpen && (
          <>
            {/* Dark backdrop overlay to dismiss drawer on tap outside */}
            <div
              className="mobile-only"
              onClick={() => setMobileNavOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(5, 12, 24, 0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 90,
              }}
            />
            {/* Slide down drawer */}
            <div className="mobile-only animate-slide-in-down" style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              zIndex: 100,
              background: 'rgba(10,22,40,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              padding: '1rem 0.875rem',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                Menu
              </div>
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => navigateTo(key)}
                  className={`nav-link${view === key ? ' active' : ''}`}
                  style={{ width: '100%', marginBottom: '0.35rem', justifyContent: 'flex-start' }}
                  type="button"
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                  {label}
                  {view === key && (
                    <ChevronRight style={{ width: '14px', height: '14px', marginLeft: 'auto', color: '#14b8a6' }} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ===== PAGE CONTENT ===== */}
        <main style={{ flex: 1, padding: '1.25rem 0.875rem 4.5rem 0.875rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          {/* ─── DASHBOARD ─── */}
          {view === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">

              {/* Hero */}
              <div style={{ textAlign: 'center', padding: '1.5rem 0.25rem 1rem' }}>
                <div className="badge badge-teal animate-slide-in-down" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
                  <Activity style={{ width: '12px', height: '12px' }} />
                  AI Medical Intelligence
                </div>
                <h2 className="animate-slide-in-up delay-100" style={{
                  fontSize: 'clamp(1.6rem, 5vw, 3rem)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: '0.75rem',
                  color: '#f1f5f9',
                }}>
                  Advanced UTI Risk
                  <span className="gradient-text-teal" style={{ display: 'block' }}>Assessment Platform</span>
                </h2>
                <p className="animate-slide-in-up delay-200" style={{
                  fontSize: '0.9rem', color: '#64748b', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.65
                }}>
                  Leverage machine learning to analyze patient urinalysis data and deliver
                  evidence-based UTI predictions with clinical confidence.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-slide-in-up delay-300">
                  <button onClick={() => navigateTo('form')} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }} type="button">
                    <Plus style={{ width: '16px', height: '16px', marginRight: '0.4rem' }} />
                    Start New Analysis
                  </button>
                  {entries.length > 0 && (
                    <button onClick={() => navigateTo('history')} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }} type="button">
                      <Clock style={{ width: '16px', height: '16px', marginRight: '0.4rem' }} />
                      History ({entries.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Session Stats */}
              {entries.length > 0 && (
                <div className="animate-slide-in-up delay-400">
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                    Session Analytics
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                    {[
                      { label: 'Total Analyses', value: stats.total, color: '#22d3ee', icon: Activity },
                      { label: 'Positive Cases', value: stats.likelyUTI, color: '#f87171', icon: AlertCircle },
                      { label: 'Negative Cases', value: stats.unlikelyUTI, color: '#4ade80', icon: Shield },
                      { label: 'Avg. Confidence', value: `${stats.avgConfidence}%`, color: '#a78bfa', icon: BarChart3 },
                    ].map(({ label, value, color, icon: Icon }, i) => (
                      <div key={label} className="stat-card animate-slide-in-up" style={{ animationDelay: `${0.4 + i * 0.06}s` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                            <Icon style={{ width: '15px', height: '15px', color }} />
                          </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem', fontWeight: 500 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Cards */}
              <div className="animate-slide-in-up delay-500">
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  Platform Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
                  {[
                    {
                      title: 'AI-Powered Analysis',
                      desc: 'GA-GWO hybrid tuned Random Forest trained on 50,000+ clinical cases for accurate UTI prediction.',
                      icon: Brain,
                      grad: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                      glow: 'rgba(20,184,166,0.15)',
                    },
                    {
                      title: 'Clinical Accuracy',
                      desc: 'Validated models with 94.2% sensitivity and 87.1% specificity for decision support.',
                      icon: Shield,
                      grad: 'linear-gradient(135deg, #22c55e, #10b981)',
                      glow: 'rgba(34,197,94,0.15)',
                    },
                    {
                      title: 'Comprehensive Reports',
                      desc: 'Detailed ROC curves, feature importance rankings, and confidence metrics for every patient.',
                      icon: BarChart3,
                      grad: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      glow: 'rgba(139,92,246,0.15)',
                    },
                  ].map(({ title, desc, icon: Icon, grad, glow }, i) => (
                    <div key={title} className="glass-card animate-slide-in-up" style={{ padding: '1.15rem', animationDelay: `${0.45 + i * 0.08}s` }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: grad, boxShadow: `0 0 16px ${glow}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '0.875rem',
                      }}>
                        <Icon style={{ width: '18px', height: '18px', color: 'white' }} />
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.35rem' }}>{title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.55 }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── FORM ─── */}
          {view === 'form' && (
            <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                  Patient Analysis
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
                  Enter patient information for AI-powered UTI risk assessment
                </p>
              </div>
              <PatientForm onSubmit={handleFormSubmit} isLoading={loading} />
              {error && (
                <div className="animate-scale-in" style={{
                  marginTop: '1rem',
                  padding: '0.75rem 0.875rem',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', color: '#f87171', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.8rem' }}>Analysis Error</div>
                    <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.1rem' }}>{error}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── RESULT ─── */}
          {view === 'result' && activeResult && (
            <div className="animate-fade-in" style={{ width: '100%' }}>
              <PredictionResult
                result={activeResult}
                onNewPrediction={handleNewPrediction}
              />
            </div>
          )}

          {/* Edge case: result view with no result */}
          {view === 'result' && !activeResult && (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.85rem' }}>No result to display.</p>
              <button onClick={() => navigateTo('form')} className="btn btn-primary" style={{ padding: '0.65rem 1.35rem' }} type="button">
                Start New Analysis
              </button>
            </div>
          )}

          {/* ─── HISTORY ─── */}
          {view === 'history' && (
            <div className="animate-fade-in" style={{ width: '100%' }}>
              <PredictionHistory
                entries={entries}
                onRemove={removeEntry}
                onClearAll={clearHistory}
                onSelectEntry={handleSelectHistoryEntry}
              />
            </div>
          )}
        </main>

        {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
        <nav className="mobile-only no-print" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'rgba(10,22,40,0.96)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 80,
          padding: '0 0.25rem',
        }}>
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = view === key;
            return (
              <button
                key={key}
                onClick={() => navigateTo(key)}
                type="button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#2dd4bf' : '#64748b',
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 700 : 500,
                  flex: 1,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: isActive ? '#2dd4bf' : '#64748b' }} />
                <span>{label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}

export default App;