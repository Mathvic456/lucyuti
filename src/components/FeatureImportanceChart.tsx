import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { FeatureImportance } from '../services/predictionApi';

interface FeatureImportanceChartProps {
  features: FeatureImportance[];
}

const COLORS = [
  '#22d3ee', // cyan
  '#14b8a6', // teal
  '#4ade80', // green
  '#a78bfa', // violet
  '#fb923c', // orange
  '#f472b6', // pink
  '#facc15', // yellow
  '#64748b', // slate
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,22,40,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '0.65rem 0.875rem',
        boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.8rem', marginBottom: '0.3rem' }}>{label}</p>
        <p style={{ color: '#22d3ee', fontSize: '0.78rem', fontWeight: 600 }}>
          Importance: <span style={{ color: '#f1f5f9' }}>{payload[0].value}%</span>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.68rem', marginTop: '0.25rem' }}>
          Contributed {payload[0].value}% to the prediction
        </p>
      </div>
    );
  }
  return null;
};

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ features }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartData = [...features]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8)
    .map((f, index) => ({
      name: f.feature,
      shortName: f.feature.length > 12 ? f.feature.slice(0, 10) + '…' : f.feature,
      weight: Math.round(f.weight * 100),
      index,
    }));

  const yAxisWidth = isSmallScreen ? 80 : 125;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 25, left: 0, bottom: 4 }}
        >
          <defs>
            {chartData.map((_, i) => (
              <linearGradient key={i} id={`barGrad${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            dataKey={isSmallScreen ? 'shortName' : 'name'}
            type="category"
            width={yAxisWidth}
            tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="weight"
            radius={[0, 6, 6, 0]}
            animationDuration={900}
            animationBegin={100}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#barGrad${index})`} />
            ))}
            <LabelList
              dataKey="weight"
              position="insideRight"
              formatter={(v: number) => `${v}%`}
              style={{ fontSize: '9px', fontWeight: 800, fill: '#0a1628', paddingRight: '4px' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend dots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.4rem', width: '100%' }}>
        {chartData.map((item, index) => (
          <div
            key={item.name}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.5rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
              minWidth: 0,
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: COLORS[index % COLORS.length], flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#c4cdd9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS[index % COLORS.length], flexShrink: 0 }}>
              {item.weight}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
