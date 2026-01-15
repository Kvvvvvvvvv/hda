import React from 'react'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          HealVision Hub
        </h1>
        <p style={{ color: '#6b7280' }}>
          React is working correctly!
        </p>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '0.375rem', color: '#166534' }}>
          Success! The frontend is rendering properly.
        </div>
      </div>
    </div>
  )
}