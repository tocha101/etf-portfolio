import React, { useState, useEffect } from 'react';
import ETFTable from './ETFTable';

function App() {
  const [etfs, setEtfs] = useState([]);

  useEffect(() => {
    // 從 localStorage 讀取
    const stored = localStorage.getItem('etfs');
    if (stored) setEtfs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    // 儲存到 localStorage
    localStorage.setItem('etfs', JSON.stringify(etfs));
  }, [etfs]);

  const addETF = () => {
    const code = prompt("Enter ETF code (US or TW):");
    if (code && !etfs.includes(code.toUpperCase())) {
      setEtfs([...etfs, code.toUpperCase()]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>ETF Portfolio</h1>
      <button onClick={addETF}>Add ETF</button>
      <ETFTable etfs={etfs} setEtfs={setEtfs} />
    </div>
  );
}

export default App;
