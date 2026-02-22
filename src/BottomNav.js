import React from 'react';
import './App.css';

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button className={current === 'movimientos' ? 'nav-active' : ''} onClick={() => onNavigate('movimientos')}>
        Movimientos
      </button>
      <button className={current === 'balance' ? 'nav-active' : ''} onClick={() => onNavigate('balance')}>
        Balance
      </button>
      <button className={current === 'perfil' ? 'nav-active' : ''} onClick={() => onNavigate('perfil')}>
        Perfil
      </button>
    </nav>
  );
}
