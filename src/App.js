import { log } from './logger';

import React, { useEffect, useState } from 'react';
import { useCategorias } from './useCategorias';
import CategoriaManager from './CategoriaManager';
import './App.css';
import RegistroMovimiento from './RegistroMovimiento';
import HistorialBalance from './HistorialBalance';
import LoginGoogle from './LoginGoogle';
import PantallaLogin from './PantallaLogin';
import BottomNav from './BottomNav';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('movimientos');
  const [showRegistro, setShowRegistro] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    categoriasIngreso,
    categoriasGasto,
    handleAddCategoria,
    handleEditCategoria,
    handleDeleteCategoria,
    setUserUid
  } = useCategorias();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      log('onAuthStateChanged', user);
      setUser(user);
      if (user) setUserUid(user.uid);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUserUid]);

  if (loading) {
    return (
      <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '1.3rem', color: '#1976d2' }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <>
          <div className="container">
            {screen === 'movimientos' && (
              <div className="card">
                <h2 className="title">Gestión Financiera</h2>
                {/* LoginGoogle eliminado en pantalla de movimientos */}
                {/* ...existing code... */}
                <HistorialBalance user={user} mostrarTodos={true} />
                {showRegistro && (
                  <div className="panel-float">
                    <h3 className="title">Registrar Movimiento</h3>
                    <RegistroMovimiento uid={user.uid} categoriasIngreso={categoriasIngreso} categoriasGasto={categoriasGasto} />
                    <button
                      className="button"
                      style={{ marginTop: 8 }}
                      onClick={() => setShowRegistro(false)}
                    >Cerrar</button>
                  </div>
                )}
                <button
                  className="fab"
                  onClick={() => setShowRegistro(v => !v)}
                  aria-label="Agregar registro"
                >
                  {showRegistro ? '×' : '+'}
                </button>
              </div>
            )}
            {screen === 'balance' && (
              <div className="card">
                <h2 className="title">Balance</h2>
                <HistorialBalance user={user} mostrarTodos={false} />
              </div>
            )}
            {screen === 'perfil' && (
              <div className="card">
                <h2 className="title">Perfil</h2>
                <LoginGoogle user={user} onLogin={setUser} onLogout={() => setUser(null)} />
                <CategoriaManager
                  categoriasIngreso={categoriasIngreso}
                  categoriasGasto={categoriasGasto}
                  onAddCategoria={handleAddCategoria}
                  onEditCategoria={handleEditCategoria}
                  onDeleteCategoria={handleDeleteCategoria}
                />
              </div>
            )}
          </div>
          <BottomNav current={screen} onNavigate={setScreen} />
        </>
      ) : (
        <div className="container">
          <div className="card">
            <PantallaLogin onLogin={setUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
