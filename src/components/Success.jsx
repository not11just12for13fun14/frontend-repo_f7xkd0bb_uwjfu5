export default function Success() {
  const params = new URLSearchParams(window.location.search)
  const invoice = params.get('invoice')
  const dl = params.get('dl')
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const url = dl?.startsWith('/') ? `${backend}${dl}` : dl

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white shadow rounded p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful</h1>
        <p className="text-gray-700 mt-2">Your invoice number is <span className="font-mono font-semibold">{invoice}</span>.</p>
        <a href={url} className="inline-block mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Download your product</a>
        <div className="mt-6">
          <a href="/" className="text-indigo-600">Back to store</a>
        </div>
      </div>
    </div>
  )
}
