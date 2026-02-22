
import React from 'react';
import { log } from './logger';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import LoginEmail from './LoginEmail';

export default function PantallaLogin({ onLogin }) {
  const handleLogin = async () => {
    log('PantallaLogin handleLogin');
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      log('PantallaLogin Google login result', result.user);
      if (onLogin) onLogin(result.user);
    } catch (error) {
      log('Error en PantallaLogin', error);
      alert('Error al iniciar sesión con Google');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f5f5f5',
    }}>
      <div style={{
        background: '#fff',
        padding: 32,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: 320,
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: 24 }}>Bienvenido a Gestión Financiera</h2>
        <p style={{ marginBottom: 24 }}>Inicia sesión para acceder a tu cuenta</p>
        <button
          style={{
            background: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 8,
          }}
          onClick={handleLogin}
        >
          Iniciar sesión con Google
        </button>
        <div style={{ marginTop: 24 }}>
          <LoginEmail onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}
