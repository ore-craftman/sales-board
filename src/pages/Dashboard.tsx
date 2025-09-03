import { useEffect, useMemo, useState } from 'react'
import { fetchCarts } from '@lib/dummyjson'
import SalesChart from '@components/SalesChart'

export default function Dashboard() {
  const [orders, setOrders] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [avgOrder, setAvgOrder] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const carts = await fetchCarts(50)
        if (!mounted) return
        const totalRevenue = carts.reduce((sum, c) => sum + c.total, 0)
        const totalOrders = carts.length
        setOrders(totalOrders)
        setRevenue(totalRevenue)
        setAvgOrder(totalOrders ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const kpiItems = useMemo(() => [
    { label: 'Orders', value: orders.toLocaleString() },
    { label: 'Revenue', value: `$${revenue.toLocaleString()}` },
    { label: 'Avg. Order', value: `$${avgOrder.toLocaleString()}` },
  ], [orders, revenue, avgOrder])

  return (
    <div>
      <h1>Sales Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1rem 0' }}>
        {kpiItems.map((kpi) => (
          <div key={kpi.label} style={{ border: '1px solid #333', borderRadius: 8, padding: '1rem' }}>
            <div style={{ color: '#888', fontSize: 12 }}>{kpi.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{kpi.value}</div>
          </div>
        ))}
      </div>
      {loading ? <p>Loading…</p> : <SalesChart />}
    </div>
  )
}


