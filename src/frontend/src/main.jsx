import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import EncounterPage from './pages/encounter/EncounterPage.jsx'
import SandboxPage from './pages/sandbox/SandboxPage.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/encounter/:id" element={<EncounterPage />} />
          <Route path="/sandbox" element={<SandboxPage />} />
        </Routes>
      </div>
    </div>
  )
}

function Banner() {
  return (
    <div className="bg-primary-700 text-white text-center py-2 text-sm">
      DaleyHealth Telemedicine Sandbox — Clinical Workflow Preview
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
