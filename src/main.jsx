
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function generateSignal() {
  const actions = ['ACHAT', 'VENTE', 'ATTENTE'];
  const actifs = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
  const random = arr => arr[Math.floor(Math.random() * arr.length)];
  return {
    actif: random(actifs),
    action: random(actions),
    timestamp: new Date().toLocaleString(),
  };
}

const sendToTelegram = async (signal) => {
  try {
    await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signal)
    });
  } catch (err) {
    console.error('Erreur envoi Telegram :', err);
  }
};

function App() {
  const [signaux, setSignaux] = useState([]);

  const ajouterSignal = async () => {
    const nouveau = generateSignal();
    setSignaux([nouveau, ...signaux]);
    await sendToTelegram(nouveau);
  };

  const exporterCSV = () => {
    const enTetes = ['Actif', 'Action', 'Horodatage'];
    const lignes = signaux.map(s => [s.actif, s.action, s.timestamp]);
    const contenu = [enTetes, ...lignes].map(l => l.join(',')).join('\n');
    const blob = new Blob([contenu], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'signaux_moonpulse.csv';
    lien.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      color: '#f5f5f5',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '2rem'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem' }}>🌙 MoonPulse Cockpit</h1>
        <span style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#aaa' }}>
          “Ce n’est pas une IA qui rêve pour moi. C’est une IA qui travaille pour que je puisse vivre mes rêves.”
        </span>
      </header>

      <section style={{ marginBottom: '1.5rem' }}>
        <button onClick={ajouterSignal} style={buttonStyle}>🧠 Générer un signal IA</button>
        <button onClick={exporterCSV} style={{ ...buttonStyle, backgroundColor: '#444' }}>📁 Exporter CSV</button>
      </section>

      <section>
        <h2 style={sectionTitle}>📊 Signaux IA</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {signaux.map((sig, i) => (
            <div key={i} style={cardStyle}>
              <strong>{sig.actif}</strong> — {sig.action} <br />
              <small style={{ color: '#999' }}>{sig.timestamp}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const buttonStyle = {
  marginRight: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
};

const sectionTitle = {
  fontSize: '1.2rem',
  marginBottom: '1rem',
  color: '#eee'
};

const cardStyle = {
  backgroundColor: '#222',
  padding: '1rem',
  borderRadius: '10px',
  border: '1px solid #333'
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
