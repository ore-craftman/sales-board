export interface DummyCartProduct {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountPercentage: number
  discountedTotal: number
  thumbnail?: string
}

export interface DummyCart {
  id: number
  products: DummyCartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

export interface DummyCartsResponse {
  carts: DummyCart[]
  total: number
  skip: number
  limit: number
}

const BASE_URL = 'https://dummyjson.com'

export async function fetchCarts(limit = 20): Promise<DummyCart[]> {
  const response = await fetch(`${BASE_URL}/carts?limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch carts: ${response.status}`)
  }
  const data: DummyCartsResponse = await response.json()
  return data.carts
}

export interface SalesPoint {
  label: string
  total: number
}

export function aggregateSales(carts: DummyCart[]): SalesPoint[] {
  // DummyJSON carts do not include a date. For demo purposes, spread carts over recent days.
  const today = new Date()
  const buckets = new Map<string, number>()
  carts.forEach((cart, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - ((carts.length - index - 1) % 7))
    const label = date.toLocaleDateString()
    buckets.set(label, (buckets.get(label) ?? 0) + cart.total)
  })
  return Array.from(buckets.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([label, total]) => ({ label, total }))
}


