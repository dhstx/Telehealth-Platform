import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header.jsx';

function PageLink({ href, children }) {
  return (
    <a className="text-blue-600 hover:underline" href={href}>
      {children}
    </a>
  );
}

function App() {
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Dashboard</h2>
            <p>Clinician summary view and feedback aggregate.</p>
            <PageLink href="/pages/dashboard/index.html">Open</PageLink>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Encounter</h2>
            <p>Video + SOAP + AI summary + Corti insights.</p>
            <PageLink href="/pages/encounter/index.html">Open</PageLink>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Sandbox</h2>
            <p>Seed and preview demo encounters.</p>
            <PageLink href="/pages/sandbox/index.html">Open</PageLink>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">Feedback</h2>
            <p>Share clinician feedback.</p>
            <PageLink href="/pages/feedback/index.html">Open</PageLink>
          </div>
        </section>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
