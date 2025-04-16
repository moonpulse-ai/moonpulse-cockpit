import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'

function generateSignal(actifs, risque) {
  const actions = ['ACHAT', 'VENTE', 'ATTENTE']
  const random = arr => arr[Math.floor(Math.random() * arr.length)]
  const actif = random(actifs)
  return {
    actif,
    action: random(actions),
    confiance: (risque * 10 + Math.random() * 40).toFixed(2),
    timestamp: new Date().toLocaleString()
  }
}

function App() {
  const [signaux, setSignaux] = useState([])
  const [niveauRisque, setNiveauRisque] = useState(3)
  const [actifs, setActifs] = useState(['BTC', 'ETH', 'SOL'])
  const [modeAuto, setModeAuto] = useState(false)
  const [alerteStop, setAlerteStop] = useState(false)

  const tousActifs = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP']
  const intervalRef = useRef(null)

  // Charger les signaux au démarrage depuis localStorage
  useEffect(() => {
    const data = localStorage.getItem('moonpulse_signaux')
    if (data) {
      setSignaux(JSON.parse(data))
    }
  }, [])

  // Sauvegarder les signaux à chaque modification
  useEffect(() => {
    localStorage.setItem('moonpulse_signaux', JSON.stringify(signaux))
  }, [signaux])

  const toggleActif = (actif) => {
    setActifs(prev =>
      prev.includes(actif) ? prev.filter(a => a !== actif) : [...prev, actif]
    )
  }

  const ajouterSignal = () => {
    const nouveau = generateSignal(actifs, niveauRisque)
    setSignaux(prev => {
      const updated = [nouveau, ...prev]
      if (updated.length >= 20 && modeAuto) {
        console.log('🛑 Limite de signaux atteinte — arrêt automatique.')
        setModeAuto(false)
        setAlerteStop(true)
      }
      return updated
    })
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

  useEffect(() => {
    if (modeAuto) {
      intervalRef.current = setInterval(() => {
        ajouterSignal()
      }, 10000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [modeAuto, actifs, niveauRisque])

  const badgeStyle = (confiance) => {
    const score = parseFloat(confiance)
    if (score > 80) return { color: '#2ecc71' }
    if (score > 70) return { color: '#f39c12' }
    return { color: '#e74c3c' }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#111', color: '#f0f0f0', fontFamily: 'Segoe UI' }}>
      
      <div style={{ flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1>🌙 MoonPulse Cockpit</h1>
          <span style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#aaa' }}>
            “Ce n’est pas une IA qui rêve pour moi. C’est une IA qui travaille pour que je puisse vivre mes rêves.”
          </span>
        </header>

        <section style={{ marginBottom: '1.5rem' }}>
          <button onClick={ajouterSignal} style={buttonStyle}>🧠 Générer un signal IA</button>
          <button onClick={exporterCSV} style={{ ...buttonStyle, backgroundColor: '#333' }}>📁 Exporter CSV</button>
        </section>

        {alerteStop && (
          <div style={{
            backgroundColor: '#222',
            padding: '1rem',
            border: '1px solid #c0392b',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            color: '#e74c3c'
          }}>
            🚨 Limite atteinte : l’IA automatique a été stoppée pour éviter la surcharge.
          </div>
        )}

        <section>
          <h2 style={sectionTitle}>📊 Signaux IA simulés</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {signaux.map((sig, i) => (
              <div key={i} style={cardStyle}>
                <strong>{sig.actif}</strong> — {sig.action}<br />
                <span style={badgeStyle(sig.confiance)}>Confiance IA : {sig.confiance}%</span><br />
                <small style={{ color: '#888' }}>{sig.timestamp}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ width: '300px', backgroundColor: '#1b1b1b', padding: '2rem', borderLeft: '1px solid #333' }}>
        <h2 style={{ marginBottom: '1rem' }}>⚙️ Paramètres IA</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="risque">🎯 Niveau de risque : {niveauRisque}</label>
          <input type="range" id="risque" min="1" max="5" value={niveauRisque}
            onChange={(e) => setNiveauRisque(Number(e.target.value))}
            style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p>💰 Actifs surveillés :</p>
          {tousActifs.map(actif => (
            <div key={actif}>
              <label>
                <input
                  type="checkbox"
                  checked={actifs.includes(actif)}
                  onChange={() => toggleActif(actif)}
                /> {actif}
              </label>
            </div>
          ))}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={modeAuto}
              onChange={() => {
                setModeAuto(!modeAuto)
                setAlerteStop(false)
              }}
            /> 🔄 Mode automatique
          </label>
        </div>
      </div>
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
  backgroundColor: '#1c1c1
