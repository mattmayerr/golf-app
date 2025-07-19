import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsDashboard = ({ rounds }) => {
  if (!rounds || rounds.length === 0) {
    return <div>No data to display statistics yet.</div>;
  }

  // Prepare data for average score per round
  const labels = rounds.map(round => round.date);
  const avgScores = rounds.map(round => {
    const total = round.scores.reduce((a, b) => a + b, 0);
    return (total / round.scores.length).toFixed(2);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Score per Round',
        data: avgScores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#fff' },
      },
      title: {
        display: true,
        text: 'Average Score per Round',
        color: '#fff',
        font: { size: 20 },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Avg: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StatisticsDashboard; 