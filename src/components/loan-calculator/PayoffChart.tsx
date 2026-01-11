import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import type { LoanResults } from '../../utils/calculator';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PayoffChartProps {
  results: LoanResults | null;
}

const COLORS = ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'];

function getColorHash(index: number): string {
  return COLORS[index % COLORS.length];
}

export function PayoffChart({ results }: PayoffChartProps) {
  const chartData = useMemo<ChartData<'line'> | null>(() => {
    if (!results || Object.keys(results.loans).length === 0) {
      return null;
    }

    const datasets: ChartData<'line'>['datasets'] = [];
    let maxLength = 0;

    // Find max length and build datasets
    let colorIndex = 0;
    for (const loanKey in results.loans) {
      const loan = results.loans[loanKey];
      if (loan.rows.length > maxLength) {
        maxLength = loan.rows.length;
      }

      const data = loan.rows.map((row) => row.balance_remaining);
      datasets.push({
        label: loan.loan_name || `Loan ${loanKey}`,
        data,
        borderColor: getColorHash(colorIndex),
        backgroundColor: getColorHash(colorIndex),
        fill: false,
        tension: 0.1,
      });
      colorIndex++;
    }

    // Get labels from the first loan (all loans have same timeline)
    const firstLoanKey = Object.keys(results.loans)[0];
    const allLabels = results.loans[firstLoanKey].rows.map((row) => row.date);

    // Downsample to ~20 labels for readability
    const step = Math.ceil(allLabels.length / 20);
    const labels = allLabels.filter((_, i) => i % step === 0 || i === allLabels.length - 1);

    // Downsample data to match labels
    datasets.forEach((dataset) => {
      const fullData = dataset.data as number[];
      dataset.data = fullData.filter((_, i) => i % step === 0 || i === fullData.length - 1);
    });

    return { labels, datasets };
  }, [results]);

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Loan Payoff Timeline',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Balance ($)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
    }),
    []
  );

  if (!chartData) {
    return null;
  }

  return (
    <div className="payoff-chart" style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PayoffChart;
