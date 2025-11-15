import { useEffect, useState } from 'react'

export default function Admin() {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [email, setEmail] = useState('admin@admin.in')
  const [password, setPassword] = useState('Admin')
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ title: '', description: '', price: '', file_url: '' })
  const [msg, setMsg] = useState('')

  const authHeader = () => {
    const token = btoa(`${email}:${password}`)
    return { 'Authorization': `Basic ${token}` }
  }

  const load = async () => {
    const res = await fetch(`${backend}/admin/whoami`, { headers: authHeader() })
    if (res.ok) {
      setAuthed(true)
      const pr = await fetch(`${backend}/products`)
      setProducts(await pr.json())
    } else {
      setAuthed(false)
    }
  }

  useEffect(() => { load() }, [])

  const createProduct = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch(`${backend}/admin/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) })
      })
      if (!res.ok) throw new Error('Failed to create product')
      setForm({ title: '', description: '', price: '', file_url: '' })
      await load()
      setMsg('Product created')
    } catch (e) {
      setMsg(e.message)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow rounded p-6 w-full max-w-sm">
          <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border rounded px-3 py-2 w-full mb-3"/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border rounded px-3 py-2 w-full mb-4"/>
          <button onClick={load} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded">Login</button>
          {msg && <p className="text-sm text-red-600 mt-3">{msg}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <a href="/" className="text-indigo-600">Storefront</a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={createProduct} className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-3">Add Product</h2>
            <input value={form.title} onChange={e=>setForm({ ...form, title: e.target.value })} placeholder="Title" className="border rounded px-3 py-2 w-full mb-3" />
            <textarea value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} placeholder="Description" className="border rounded px-3 py-2 w-full mb-3" />
            <input value={form.price} onChange={e=>setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="Price" className="border rounded px-3 py-2 w-full mb-3" />
            <input value={form.file_url} onChange={e=>setForm({ ...form, file_url: e.target.value })} placeholder="Direct file URL (S3, etc.)" className="border rounded px-3 py-2 w-full mb-4" />
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Create</button>
            {msg && <p className="text-sm text-green-700 mt-3">{msg}</p>}
          </form>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-lg font-semibold mb-3">Products</h2>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="border rounded p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-600">${p.price.toFixed(2)}</div>
                </div>
              ))}
              {products.length === 0 && <p className="text-sm text-gray-500">No products yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
