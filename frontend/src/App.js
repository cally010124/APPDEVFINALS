import React, { useEffect } from 'react';
import AppRoutes from './routes';
import './App.css';
import bgImage from './PTCBG.png';

function App() {
  useEffect(() => {
    document.body.style.setProperty('--ptc-bg', `url(${bgImage})`);
  }, []);
  return <AppRoutes />;
}

export default App;
