import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function SandboxPage() {
  const [status, setStatus] = useState('')

  async function resetData() {
    setStatus('Resetting...')
    const { data } = await axios.post(`${API}/api/auth/login`, { email: 'physician@example.com' })
    const token = data.token
    await axios.post(`${API}/api/sandbox/reset`, {}, { headers: { Authorization: `Bearer ${token}` } })
    setStatus('Reseeded synthetic data.')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sandbox</h1>
      <button onClick={resetData} className="px-3 py-1 bg-primary-600 text-white rounded">Reset / Reseed Data</button>
      <div className="mt-2 text-sm text-gray-700">{status}</div>
    </div>
  )
}
