import React, { useState } from 'react';
import { log } from './logger';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginEmail({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setError('');
    try {
      let result;
      if (isRegister) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        log('Registro por email', result.user);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
        log('Login por email', result.user);
      }
      if (onLogin) onLogin(result.user);
    } catch (err) {
      log('Error email auth', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, textAlign: 'center' }}>
      <h3>{isRegister ? 'Registrarse' : 'Iniciar sesión'} con Email</h3>
      <input
          type="email" autoComplete="username"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ marginBottom: 8, width: '80%' }}
      />
      <br />
      <input
          type="password" autoComplete="current-password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ marginBottom: 8, width: '80%' }}
      />
      <br />
      <button type="submit" style={{ marginBottom: 8 }}>
        {isRegister ? 'Registrarse' : 'Iniciar sesión'}
      </button>
      <br />
      <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ fontSize: 12 }}>
        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
}
