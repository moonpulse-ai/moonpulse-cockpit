import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function generateSignal() {
  const actifs = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']
  const actions = ['ACHAT', 'VENTE', 'ATTENTE']
  const random = arr => arr[Math.floor(Math.random() * arr.length)]
  return {
    actif: random(actifs),
    action: random(actions),
    confiance: (Math.random() * 40 + 60).toFixed(2), // entre 60 et 100%
    timestamp: new Date().toLocaleString()
  }
}

function App() {
  const [signaux, setSignaux] = useState([])

  const ajouterSignal = () => {
    const nouveau = generateSignal()
    setSignaux([nouveau, ...signaux])
  }

  const exporterCSV = () => {
    const enTetes = ['Actif', 'Action', 'Confiance', 'Horodatage']
    const lignes = signaux.map(s => [s.actif, s.action, s.confiance, s.timestamp])
    const contenu = [enTetes, ...lignes].map(l => l.join(',')).join('\n')
    const blob = new Blob([contenu], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const lien = document.createElement('a')
    lien.href = url
    lien.download = 'signaux_moonpulse.csv'
    lien.click()
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0e0e0e',
      color: '#f0f0f0',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '2rem'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>🌙 MoonPulse Cockpit</h1>
        <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#aaa' }}>
          “Ce n’est pas une IA qui rêve pour moi. C’est une IA qui travaille pour que je puisse vivre mes rêves.”
        </div>
      </header>

      <section style={{ marginBottom: '1.5rem' }}>
        <button onClick={ajouterSignal} style={buttonStyle}>🧠 Générer un signal IA</button>
        <button onClick={exporterCSV} style={{ ...buttonStyle, backgroundColor: '#333' }}>📁 Exporter CSV</button>
      </section>

      <section>
        <h2 style={sectionTitle}>📊 Signaux IA simulés</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {signaux.map((sig, i) => (
            <div key={i} style={cardStyle}>
              <strong>{sig.actif}</strong> — {sig.action}<br />
              <span style={{ color: '#1abc9c' }}>Confiance IA : {sig.confiance}%</span><br />
              <small style={{ color: '#888' }}>{sig.timestamp}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const buttonStyle = {
  marginRight: '1rem',
  padding: '0.7rem 1.5rem',
  fontSize: '1rem',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#1e88e5',
  color: '#fff'
}

const sectionTitle = {
  fontSize: '1.3rem',
  marginBottom: '1rem',
  color: '#eee'
}

const cardStyle = {
  backgroundColor: '#1c1c1c',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #333'
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
