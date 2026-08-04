import React, { useState } from 'react';
import type { PatientData } from '../services/predictionApi';
import {
  User,
  TestTube,
  Microscope,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Brain,
} from 'lucide-react';
import FormSection from './FormSection';
import TextInput from './inputs/TextInput';
import SelectInput from './inputs/SelectInput';
import CheckboxInput from './inputs/CheckboxInput';

interface PatientFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const STEPS = [
  { id: 'demographics', title: 'Demographics',  subtitle: 'Basic patient info',      icon: User,        color: 'blue'    },
  { id: 'urinalysis',   title: 'Urinalysis',     subtitle: 'Lab test results',        icon: TestTube,    color: 'emerald' },
  { id: 'microscopy',   title: 'Microscopy',     subtitle: 'Cellular examination',    icon: Microscope,  color: 'violet'  },
  { id: 'symptoms',     title: 'Clinical Signs', subtitle: 'Patient presentation',    icon: Stethoscope, color: 'pink'    },
];

const STEP_ACCENT: Record<string, string> = {
  blue:    '#60a5fa',
  emerald: '#34d399',
  violet:  '#a78bfa',
  pink:    '#f472b6',
};

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 35,
    gender: 'female',
    urinePh: 6.5,
    specificGravity: 1.02,
    leukocyteEsterase: 'negative',
    nitrite: 'negative',
    protein: 'negative',
    glucose: 'negative',
    whiteBloodCell: 2,
    redBloodCell: 0,
    bilirubin: 'negative',
    urobilinogen: 'normal',
    dysuria: false,
    frequency: false,
    urgency: false,
    flankPain: false,
    fever: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.age < 0 || formData.age > 150) newErrors.age = 'Age must be between 0 and 150 years';
    if (formData.urinePh < 4.5 || formData.urinePh > 8.5) newErrors.urinePh = 'Urine pH must be between 4.5 and 8.5';
    if (formData.specificGravity < 1.0 || formData.specificGravity > 1.030) newErrors.specificGravity = 'Specific gravity must be between 1.000 and 1.030';
    if (formData.whiteBloodCell < 0) newErrors.whiteBloodCell = 'WBC count cannot be negative';
    if (formData.redBloodCell < 0) newErrors.redBloodCell = 'RBC count cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(formData);
  };

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const nextStep = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  const progressPct = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>

      {/* ── Step Progress Card ── */}
      <div className="glass-card animate-slide-in-down" style={{ padding: '1rem' }}>
        {/* Step Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Step {currentStep + 1} of {STEPS.length}
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9' }}>
              {STEPS[currentStep].title}
            </div>
          </div>
          <div className="badge badge-teal">
            {Math.round(progressPct)}%
          </div>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', position: 'relative', width: '100%' }}>
          {/* Connector track behind icons */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '18px',
            right: '18px',
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 0,
          }} />
          {/* Filled connector */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '18px',
            width: `calc((100% - 36px) * ${currentStep / (STEPS.length - 1)})`,
            height: '2px',
            background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 0,
          }} />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const accent = STEP_ACCENT[step.color];

            return (
              <button
                type="button"
                key={step.id}
                onClick={() => { if (isCompleted) setCurrentStep(index); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                  flex: 1, position: 'relative', zIndex: 1, background: 'none', border: 'none',
                  cursor: isCompleted ? 'pointer' : 'default',
                  padding: 0,
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : isActive
                    ? `linear-gradient(135deg, ${accent}, ${accent}bb)`
                    : 'rgba(10,22,40,0.95)',
                  border: isActive ? `2px solid ${accent}` : isCompleted ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: isActive ? `0 0 14px ${accent}50` : isCompleted ? '0 0 10px rgba(34,197,94,0.3)' : 'none',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                }}>
                  {isCompleted
                    ? <Check style={{ width: '16px', height: '16px', color: 'white' }} strokeWidth={2.5} />
                    : <Icon style={{ width: '16px', height: '16px', color: isActive ? 'white' : '#475569' }} />
                  }
                </div>
                <div className="hidden sm:block" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isActive ? accent : isCompleted ? '#4ade80' : '#475569', transition: 'color 0.3s' }}>
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
            borderRadius: '2px',
            transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 0 8px rgba(20,184,166,0.4)',
          }} />
        </div>
      </div>

      {/* ── Step Content ── */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <div className="animate-fade-in" key={currentStep} style={{ width: '100%' }}>

          {/* Step 0: Demographics */}
          {currentStep === 0 && (
            <FormSection title="Patient Demographics" subtitle="Basic patient information" icon={User} color="blue">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
                <TextInput
                  label="Patient Age"
                  type="number"
                  min="0" max="150"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  error={errors.age}
                  required
                  tooltip="Patient's age in years (0–150). Age affects UTI risk factors."
                  placeholder="35"
                />
                <SelectInput
                  label="Biological Sex"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female')}
                  options={[{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' }]}
                  required
                  tooltip="Biological sex affects UTI susceptibility."
                />
              </div>
            </FormSection>
          )}

          {/* Step 1: Urinalysis */}
          {currentStep === 1 && (
            <FormSection title="Urinalysis Results" subtitle="Chemical and physical properties from lab analysis" icon={TestTube} color="emerald">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>

                {/* Physical */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                    Physical Properties
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
                    <TextInput
                      label="Urine pH Level"
                      type="number" min="4.5" max="8.5" step="0.1"
                      value={formData.urinePh}
                      onChange={(e) => handleInputChange('urinePh', parseFloat(e.target.value) || 6.5)}
                      error={errors.urinePh}
                      required
                      tooltip="Normal range: 4.5–8.5. Higher pH (>7.0) may indicate bacterial infection."
                      placeholder="6.5"
                    />
                    <TextInput
                      label="Specific Gravity"
                      type="number" min="1.000" max="1.030" step="0.001"
                      value={formData.specificGravity}
                      onChange={(e) => handleInputChange('specificGravity', parseFloat(e.target.value) || 1.020)}
                      error={errors.specificGravity}
                      required
                      tooltip="Normal range: 1.005–1.030. Indicates urine concentration."
                      placeholder="1.020"
                    />
                  </div>
                </div>

                {/* Chemical group 1 */}
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                    Chemical Indicators
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', width: '100%' }}>
                    <SelectInput
                      label="Leukocyte Esterase"
                      value={formData.leukocyteEsterase}
                      onChange={(e) => handleInputChange('leukocyteEsterase', e.target.value)}
                      options={[
                        { value: 'negative', label: 'Negative' },
                        { value: 'trace',    label: 'Trace' },
                        { value: 'plus1',    label: '1+' },
                        { value: 'plus2',    label: '2+' },
                        { value: 'plus3',    label: '3+' },
                      ]}
                      required
                      tooltip="Indicates presence of WBCs and pyuria."
                    />
                    <SelectInput
                      label="Nitrite Test"
                      value={formData.nitrite}
                      onChange={(e) => handleInputChange('nitrite', e.target.value)}
                      options={[{ value: 'negative', label: 'Negative' }, { value: 'positive', label: 'Positive' }]}
                      required
                      tooltip="Highly specific for gram-negative bacteria."
                    />
                    <SelectInput
                      label="Protein"
                      value={formData.protein}
                      onChange={(e) => handleInputChange('protein', e.target.value)}
                      options={[
                        { value: 'negative', label: 'Negative' },
                        { value: 'trace',    label: 'Trace' },
                        { value: 'plus1',    label: '1+' },
                        { value: 'plus2',    label: '2+' },
                      ]}
                      tooltip="Proteinuria can indicate kidney involvement."
                    />
                  </div>
                </div>

                {/* Chemical group 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', width: '100%' }}>
                  <SelectInput
                    label="Glucose"
                    value={formData.glucose}
                    onChange={(e) => handleInputChange('glucose', e.target.value)}
                    options={[
                      { value: 'negative', label: 'Negative' },
                      { value: 'trace',    label: 'Trace' },
                      { value: 'plus1',    label: '1+' },
                      { value: 'plus2',    label: '2+' },
                    ]}
                    tooltip="Glucosuria may indicate diabetes mellitus."
                  />
                  <SelectInput
                    label="Bilirubin"
                    value={formData.bilirubin}
                    onChange={(e) => handleInputChange('bilirubin', e.target.value)}
                    options={[{ value: 'negative', label: 'Negative' }, { value: 'positive', label: 'Positive' }]}
                    tooltip="Bilirubinuria may suggest hepatic involvement."
                  />
                  <SelectInput
                    label="Urobilinogen"
                    value={formData.urobilinogen}
                    onChange={(e) => handleInputChange('urobilinogen', e.target.value)}
                    options={[
                      { value: 'normal',    label: 'Normal' },
                      { value: 'increased', label: 'Increased' },
                      { value: 'decreased', label: 'Decreased' },
                    ]}
                    tooltip="Abnormal levels suggest liver disease."
                  />
                </div>
              </div>
            </FormSection>
          )}

          {/* Step 2: Microscopy */}
          {currentStep === 2 && (
            <FormSection title="Microscopic Examination" subtitle="Cellular analysis in urine sediment" icon={Microscope} color="violet">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
                  <TextInput
                    label="White Blood Cells"
                    type="number" min="0"
                    value={formData.whiteBloodCell}
                    onChange={(e) => handleInputChange('whiteBloodCell', parseInt(e.target.value) || 0)}
                    error={errors.whiteBloodCell}
                    tooltip="Normal: 0–5 per μL. Elevated WBC indicates pyuria."
                    placeholder="2"
                    unit="cells/μL"
                  />
                  <TextInput
                    label="Red Blood Cells"
                    type="number" min="0"
                    value={formData.redBloodCell}
                    onChange={(e) => handleInputChange('redBloodCell', parseInt(e.target.value) || 0)}
                    error={errors.redBloodCell}
                    tooltip="Normal: 0–3 per μL. Hematuria suggests inflammation or stones."
                    placeholder="0"
                    unit="cells/μL"
                  />
                </div>

                {/* Reference values */}
                <div style={{
                  padding: '0.875rem', borderRadius: '0.65rem',
                  background: 'rgba(139,92,246,0.07)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                }}>
                  <Info style={{ width: '15px', height: '15px', color: '#a78bfa', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', flex: 1 }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.3rem' }}>WBC Ref</div>
                      {['Normal: 0–5 /μL', 'Significant: >5 /μL', 'Pyuria: >10 /μL'].map(t => (
                        <div key={t} style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.15rem' }}>• {t}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.3rem' }}>RBC Ref</div>
                      {['Normal: 0–3 /μL', 'Hematuria: >3 /μL', 'Gross: Visible blood'].map(t => (
                        <div key={t} style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.15rem' }}>• {t}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {/* Step 3: Symptoms */}
          {currentStep === 3 && (
            <FormSection title="Clinical Symptoms" subtitle="Patient presentation & observations" icon={Stethoscope} color="pink">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', width: '100%' }}>
                  <CheckboxInput
                    label="Dysuria"
                    sublabel="Painful/burning urination"
                    checked={formData.dysuria}
                    onChange={(v) => handleInputChange('dysuria', v)}
                    tooltip="Pain or burning during urination."
                  />
                  <CheckboxInput
                    label="Urinary Frequency"
                    sublabel="More frequent urination"
                    checked={formData.frequency}
                    onChange={(v) => handleInputChange('frequency', v)}
                    tooltip="Increased urination frequency."
                  />
                  <CheckboxInput
                    label="Urinary Urgency"
                    sublabel="Sudden, compelling urge"
                    checked={formData.urgency}
                    onChange={(v) => handleInputChange('urgency', v)}
                    tooltip="Sudden strong urge to urinate."
                  />
                  <CheckboxInput
                    label="Flank Pain"
                    sublabel="Back or side pain below ribs"
                    checked={formData.flankPain}
                    onChange={(v) => handleInputChange('flankPain', v)}
                    tooltip="Suggests upper UTI (pyelonephritis)."
                  />
                  <CheckboxInput
                    label="Fever"
                    sublabel="Body temp > 38°C (100.4°F)"
                    checked={formData.fever}
                    onChange={(v) => handleInputChange('fever', v)}
                    tooltip="Suggests systemic infection."
                  />
                </div>
              </div>
            </FormSection>
          )}
        </div>

        {/* ── Navigation Buttons ── */}
        <div className="glass-card" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 1rem', gap: '0.35rem', flex: '1 1 auto', minWidth: '90px' }}
          >
            <ChevronLeft style={{ width: '15px', height: '15px' }} />
            Previous
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1rem', gap: '0.35rem', flex: '1 1 auto', minWidth: '90px' }}
            >
              Continue
              <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', gap: '0.4rem', fontSize: '0.9rem', flex: '1 1 auto', minWidth: '150px' }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'rotateSpin 0.8s linear infinite' }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain style={{ width: '16px', height: '16px' }} />
                  Generate Assessment
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Disclaimer ── */}
        <div className="glass-card" style={{
          padding: '0.875rem 1rem',
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.2)',
          display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
        }}>
          <AlertCircle style={{ width: '16px', height: '16px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.2rem' }}>
              ⚠️ Medical Disclaimer
            </div>
            <p style={{ fontSize: '0.72rem', color: '#d97706', lineHeight: 1.45 }}>
              This is a clinical decision-support tool only. Confirmatory urine culture remains the gold standard.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;