import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { aggregateSales, fetchCarts } from '@lib/dummyjson'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

export function SalesChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataPoints, setDataPoints] = useState<{ label: string; total: number }[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setIsLoading(true)
        const carts = await fetchCarts(50)
        if (!mounted) return
        setDataPoints(aggregateSales(carts))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const chartData = useMemo(() => {
    return {
      labels: dataPoints.map((d) => d.label),
      datasets: [
        {
          label: 'Sales Total',
          data: dataPoints.map((d) => d.total),
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
        },
      ],
    }
  }, [dataPoints])

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Weekly Sales (DummyJSON carts)' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }
  }, [])

  if (isLoading) return <p>Loading sales…</p>
  if (error) return <p role="alert">Failed to load: {error}</p>
  if (dataPoints.length === 0) return <p>No sales data</p>

  return (
    <div style={{ height: 360 }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default SalesChart


