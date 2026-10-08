import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Reusable Distribution Histogram Bar Chart
 */
export const DistributionBarChart = ({ buckets = [], label = 'Frequency', color = '#10b981', unit = '' }) => {
  const data = {
    labels: buckets.map(b => b.range),
    datasets: [
      {
        label: `${label} (${buckets.reduce((a, c) => a + c.count, 0)} samples)`,
        data: buckets.map(b => b.count),
        backgroundColor: color,
        borderRadius: 6,
        borderWidth: 0,
        hoverBackgroundColor: '#047857'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `Frequency: ${context.parsed.y} records`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

/**
 * Metric Comparison Bar Chart (MAE, MSE, RMSE, R2)
 */
export const MetricComparisonChart = ({ models = [], metricKey = 'r2_score', metricTitle = 'R² Score', higherIsBetter = true }) => {
  const colors = [
    'rgba(16, 185, 129, 0.85)', // Emerald
    'rgba(245, 158, 11, 0.85)', // Amber
    'rgba(2, 132, 199, 0.85)'   // Sky
  ];

  const data = {
    labels: models.map(m => m.model_name),
    datasets: [
      {
        label: metricTitle,
        data: models.map(m => m[metricKey]),
        backgroundColor: colors.slice(0, models.length),
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context) => `${metricTitle}: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '250px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

/**
 * Interactive Correlation Heatmap Grid
 */
export const CorrelationHeatmap = ({ matrix = {} }) => {
  const keys = Object.keys(matrix);
  if (!keys.length) return <div>No correlation data</div>;

  const getColor = (val) => {
    if (val === 1) return '#047857';
    if (val > 0.7) return '#10b981';
    if (val > 0.4) return '#6ee7b7';
    if (val > 0.1) return '#d1fae5';
    if (val >= -0.1 && val <= 0.1) return '#f8fafc';
    if (val < -0.1) return '#fee2e2';
    return '#fecaca';
  };

  const getTextColor = (val) => {
    if (Math.abs(val) > 0.6) return '#ffffff';
    return '#0f172a';
  };

  return (
    <div style={{ overflowX: 'auto', padding: '0.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.6rem', textAlign: 'left', color: 'var(--text-muted)' }}>Feature</th>
            {keys.map(k => (
              <th key={k} style={{ padding: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {k.replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map(rowKey => (
            <tr key={rowKey}>
              <td style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-main)' }}>
                {rowKey.replace('_', ' ')}
              </td>
              {keys.map(colKey => {
                const val = matrix[rowKey]?.[colKey] !== undefined ? matrix[rowKey][colKey] : 0;
                return (
                  <td
                    key={colKey}
                    style={{
                      padding: '0.6rem',
                      backgroundColor: getColor(val),
                      color: getTextColor(val),
                      fontWeight: 600,
                      borderRadius: '4px',
                      border: '2px solid #ffffff'
                    }}
                    title={`${rowKey} vs ${colKey}: ${val}`}
                  >
                    {val.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
