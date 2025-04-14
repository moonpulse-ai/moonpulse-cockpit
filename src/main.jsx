import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const generateSignal = () => {
  const actions = ['ACHAT', 'VENTE', 'ATTENTE']
  const assets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)]
  return {
    actif: random(assets),
    action: random(actions),
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
    const enTetes = ['Actif', 'Action', 'Horodatage']
    const lignes = signaux.map(sig => [sig.actif, sig.action, sig.timestamp])
    const contenu = [enTetes, ...lignes].map(e => e.join(',')).join('\n')
    const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const lien = document.createElement('a')
    lien.href = url
    lien.setAttribute('download', 'signaux_IA.csv')
    document.body.appendChild(lien)
    lien.click()
    document.body.removeChild(lien)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>MoonPulse Cockpit</h1>
      <button onClick={ajouterSignal} style={{ marginRight: '1rem' }}>
        🧠 Générer des signaux IA
      </button>
      <button onClick={exporterCSV}>📁 Exporter CSV</button>

      <h2 style={{ marginTop: '2rem' }}>📉 Signaux IA simulés</h2>
      <ul>
        {signaux.map((sig, i) => (
          <li key={i}>
            <strong>{sig.actif}</strong> – {sig.action} – {sig.timestamp}
          </li>
        ))}
      </ul>

      <h2>📝 Journal IA</h2>
      <p>À venir…</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
