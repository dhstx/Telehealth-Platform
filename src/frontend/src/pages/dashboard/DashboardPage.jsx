import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function DashboardPage() {
  const [encounters, setEncounters] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    async function init() {
      // Sandbox auth: create or get a clinician
      const email = 'physician@example.com'
      const name = 'Sandbox Physician'
      const { data } = await axios.post(`${API}/api/auth/login`, { email, name })
      const t = data.token
      setToken(t)
      const enc = await axios.get(`${API}/api/encounter`, { headers: { Authorization: `Bearer ${t}` } })
      setEncounters(enc.data)
    }
    init()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h1>
      <div className="grid gap-3">
        {encounters.map((e) => (
          <Link key={e._id} to={`/encounter/${e._id}`} className="block border rounded p-3 bg-white hover:bg-gray-50">
            <div className="text-sm text-gray-600">{new Date(e.date).toLocaleString()}</div>
            <div className="font-medium">Encounter {e._id.slice(-6)}</div>
            <div className="text-gray-700 text-sm truncate">{e.aiSummary || 'No AI summary yet'}</div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link to="/sandbox" className="text-primary-700 hover:underline">Sandbox tools</Link>
      </div>
    </div>
  )
}
