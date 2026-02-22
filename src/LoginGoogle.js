
import { log } from './logger';
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export default function LoginGoogle({ onLogin, onLogout, user }) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    log('LoginGoogle handleLogin');
    try {
      const result = await signInWithPopup(auth, provider);
      log('Google login result', result.user);
      if (onLogin) onLogin(result.user);
    } catch (error) {
      log('Error al iniciar sesión con Google', error);
      alert('Error al iniciar sesión con Google');
    }
  };

  const handleLogout = async () => {
    log('LoginGoogle handleLogout');
    try {
      await signOut(auth);
      log('Google logout');
      if (onLogout) onLogout();
    } catch (error) {
      log('Error al cerrar sesión', error);
      alert('Error al cerrar sesión');
    }
  };

  if (user) {
    return (
      <div style={{ marginBottom: 20 }}>
        <span>Bienvenido, {user.displayName}</span>
        <button onClick={handleLogout} style={{ marginLeft: 10 }}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} style={{ marginBottom: 20 }}>
      Iniciar sesión con Google
    </button>
  );
}
