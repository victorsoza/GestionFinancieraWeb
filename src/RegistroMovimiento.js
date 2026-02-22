
import { log } from './logger';
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function RegistroMovimiento({ uid, categoriasIngreso = [], categoriasGasto = [] }) {
  const [tipo, setTipo] = useState('ingreso');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [notif, setNotif] = useState({ show: false, text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    log('RegistroMovimiento submit', { tipo, monto, descripcion, categoria });
    if (!monto || isNaN(monto)) {
      setNotif({ show: true, text: 'Ingrese un monto válido', type: 'error' });
      setTimeout(() => setNotif({ show: false, text: '', type: '' }), 2000);
      return;
    }
    if (!categoria) {
      setNotif({ show: true, text: 'Seleccione una categoría', type: 'error' });
      setTimeout(() => setNotif({ show: false, text: '', type: '' }), 2000);
      return;
    }
    try {
      await addDoc(collection(db, 'movimientos'), {
        tipo,
        monto: parseFloat(monto),
        descripcion,
        categoria,
        fecha: Timestamp.now(),
        uid: uid || '',
      });
      log('Registro guardado', { tipo, monto, descripcion, categoria });
      setNotif({ show: true, text: '¡Registro guardado!', type: 'success' });
      setMonto('');
      setDescripcion('');
      setCategoria('');
      setTipo('ingreso');
      setTimeout(() => setNotif({ show: false, text: '', type: '' }), 2000);
    } catch (error) {
      log('Error al guardar', error);
      setNotif({ show: true, text: 'Error al guardar', type: 'error' });
      setTimeout(() => setNotif({ show: false, text: '', type: '' }), 2000);
    }
  };

  return (
    <>
      {notif.show && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: notif.type === 'success' ? '#43a047' : '#d32f2f',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            zIndex: 999,
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {notif.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="container" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="tipo" style={{ fontWeight: 'bold', marginRight: 8 }}>Tipo:</label>
          <select
            id="tipo"
            className="input"
            value={tipo}
            onChange={e => {
              setTipo(e.target.value);
              setCategoria('');
            }}
            style={{ width: 'auto', minWidth: 120 }}
          >
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="categoria" style={{ fontWeight: 'bold', marginRight: 8 }}>Categoría:</label>
          <select
            id="categoria"
            className="input"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={{ width: 'auto', minWidth: 120 }}
            required
          >
            <option value="">Selecciona...</option>
            {(tipo === 'ingreso' ? categoriasIngreso : categoriasGasto).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <input
          type="number"
          className="input"
          placeholder="Monto"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          required
        />
        <input
          type="text"
          className="input"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <button type="submit" className="button">Registrar</button>
      </form>
    </>
  );
}
