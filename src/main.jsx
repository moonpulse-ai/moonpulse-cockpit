import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const generateSignal = () => {
  const actions = ['ACHAT', 'VENTE', 'ATTENTE']
  const assets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']
  const random = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const actif = random(assets)
  const action = random(actions)
  const timestamp = new Date().toLocaleString()

  const explication = `L'IA a détecté une opportunité de ${action.toLowerCase()} sur ${actif} à ${timestamp}`

  return {
    actif,
    action,
    timestamp,
    explication
  }
}

function App() {
  const [signaux, setSignaux] = useState([])
  const [journal, setJournal] = useState([])

  const ajouterSignal = () => {
    const nouveau = generateSignal()
    setSignaux([nouveau, ...signaux])
    setJournal([nouveau.explication, ...journal])
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
      <ul>
        {journal.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
