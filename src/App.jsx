import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [email, setEmail] = useState('')
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/products`)
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const checkout = async () => {
    if (!selected || !email) return
    try {
      const res = await fetch(`${backend}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: selected.id, buyer_email: email }),
      })
      if (!res.ok) throw new Error('Checkout failed')
      const data = await res.json()
      alert(`Order placed! Invoice ${data.invoice_number}. A confirmation email was sent.\nUse the download link on the next screen.`)
      window.location.href = `/success?invoice=${data.invoice_number}&dl=${encodeURIComponent(data.download_url)}`
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Digital Store</h1>
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-indigo-600">Home</a>
          <a href="/admin" className="text-gray-700 hover:text-indigo-600">Admin</a>
          <a href="/test" className="text-gray-700 hover:text-indigo-600">System</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600 mb-6">Browse and purchase downloadable products. After checkout, you'll receive an invoice and a secure download link via email.</p>

        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-6">
          {products.map(p => (
            <div key={p.id} className={`bg-white rounded-lg shadow p-5 border ${selected?.id===p.id ? 'ring-2 ring-indigo-500' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.description || 'No description'}</p>
              <p className="text-indigo-700 font-bold mt-3">${p.price.toFixed(2)}</p>
              <button onClick={() => setSelected(p)} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">Select</button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-5">
          <h2 className="text-xl font-semibold text-gray-800">Checkout</h2>
          <p className="text-sm text-gray-600 mt-1">Enter your email to receive the invoice and download link.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="border rounded px-3 py-2 focus:outline-none focus:ring w-full" />
            <button onClick={checkout} disabled={!selected || !email} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 rounded">Pay & Get Invoice</button>
          </div>
          {selected && (
            <p className="text-sm text-gray-600 mt-3">Selected: <span className="font-medium">{selected.title}</span> (${selected.price.toFixed(2)})</p>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">DDoS protection with request throttling is enabled.</footer>
    </div>
  )
}

export default App
