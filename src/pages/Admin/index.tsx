import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { productRepository } from '@lib/products'
import './admin.css'

interface FormState {
  id?: number
  name: string
  price: string
  stock: string
  description: string
}

export default function Admin() {
  const [products, setProducts] = useState<Awaited<ReturnType<typeof productRepository.list>>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', price: '', stock: '', description: '' })

  async function refresh() {
    setIsLoading(true)
    try {
      const items = await productRepository.list()
      setProducts(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  function startEdit(id: number) {
    const p = products.find((x) => x.id === id)
    if (!p) return
    setForm({ id: p.id, name: p.name, price: String(p.price), stock: String(p.stock), description: p.description ?? '' })
  }

  function resetForm() {
    setForm({ name: '', price: '', stock: '', description: '' })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name || Number.isNaN(price) || Number.isNaN(stock)) {
      setError('Please provide valid name, price and stock')
      return
    }
    try {
      if (form.id != null) {
        await productRepository.update(form.id, { name: form.name, price, stock, description: form.description || undefined })
      } else {
        await productRepository.create({ name: form.name, price, stock, description: form.description || undefined })
      }
      resetForm()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function onDelete(id: number) {
    setError(null)
    try {
      await productRepository.delete(id)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const isEditing = useMemo(() => form.id != null, [form.id])

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin · Products</h1>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          <input className="input" placeholder="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          <input className="input" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="actions">
            <button className="button button-primary" type="submit">{isEditing ? 'Update' : 'Create'} Product</button>
            {isEditing && (
              <button className="button button-secondary" type="button" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {error && <p role="alert">{error}</p>}
      <div className="panel table-wrapper">
        {isLoading ? (
          <p>Loading…</p>
        ) : products.length === 0 ? (
          <p>No products</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Name</th>
                <th align="left">Price</th>
                <th align="left">Stock</th>
                <th align="left">Updated</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{new Date(p.updatedAt).toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <button className="button button-secondary" onClick={() => startEdit(p.id)}>Edit</button>
                      <button className="button button-danger" onClick={() => onDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


