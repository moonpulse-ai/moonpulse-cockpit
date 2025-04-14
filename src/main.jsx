import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [signaux, setSignaux] = useState([]);
  const [journal, setJournal] = useState([]);

  const genererSignaux = () => {
    const nouveaux = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      nom: `Signal #${i + 1}`,
      score: (Math.random() * 100).toFixed(2),
      date: new Date().toLocaleString(),
    }));
    setSignaux(nouveaux);
    setJournal(prev => [...prev, `🧠 ${nouveaux.length} signaux générés à ${new Date().toLocaleTimeString()}`]);
  };

  const exporterCSV = () => {
    const lignes = ['id,nom,score,date', ...signaux.map(s => `${s.id},${s.nom},${s.score},${s.date}`)];
    const blob = new Blob([lignes.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signaux_moonpulse.csv';
    a.click();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>MoonPulse Cockpit</h1>
      <button onClick={genererSignaux}>🔁 Générer des signaux IA</button>
      <button onClick={exporterCSV} style={{ marginLeft: '1rem' }}>📤 Exporter CSV</button>

      <h2>📈 Signaux IA simulés</h2>
      <ul>
        {signaux.map(s => (
          <li key={s.id}>
            <strong>{s.nom}</strong> – Score : {s.score} – {s.date}
          </li>
        ))}
      </ul>

      <h2>🗒️ Journal IA</h2>
      <ul>
        {journal.map((log, i) => <li key={i}>{log}</li>)}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
