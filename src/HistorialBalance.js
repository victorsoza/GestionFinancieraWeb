import { log } from './logger';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

export default function HistorialBalance({ user, mostrarTodos = true }) {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    if (!user) {
      log('HistorialBalance: user is null, no consulta');
      setMovimientos([]);
      return;
    }
    log('HistorialBalance: fetching movimientos for', user.uid);
    const q = query(
      collection(db, 'movimientos'),
      where('uid', '==', user.uid),
      orderBy('fecha', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      log('HistorialBalance: onSnapshot', snapshot.docs.length);
      setMovimientos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      log('HistorialBalance: unsubscribe');
      unsubscribe();
    };
  }, [user]);

  const balance = movimientos.reduce((acc, mov) => {
    return mov.tipo === 'ingreso' ? acc + mov.monto : acc - mov.monto;
  }, 0);

  return (
    <div>
      {mostrarTodos ? (
        <>
          <h3>Historial de Movimientos</h3>
          <ul>
            {movimientos.map(mov => (
              <li key={mov.id}>
                <b>{mov.tipo === 'ingreso' ? '+' : '-'}${mov.monto.toFixed(2)}</b>
                {' '}<span style={{ color: '#1976d2', fontWeight: 'bold' }}>{mov.categoria || 'Sin categoría'}</span>
                {' '} - {mov.descripcion} <i>({mov.fecha?.toDate?.().toLocaleString?.() || ''})</i>
              </li>
            ))}
          </ul>
          {/* Balance eliminado en pantalla de movimientos */}
        </>
      ) : (
        <>
          <h3>Últimos 5 Movimientos</h3>
          <ul>
            {movimientos.slice(0, 5).map(mov => (
              <li key={mov.id}>
                <b>{mov.tipo === 'ingreso' ? '+' : '-'}${mov.monto.toFixed(2)}</b>
                {' '}<span style={{ color: '#1976d2', fontWeight: 'bold' }}>{mov.categoria || 'Sin categoría'}</span>
                {' '} - {mov.descripcion} <i>({mov.fecha?.toDate?.().toLocaleString?.() || ''})</i>
              </li>
            ))}
          </ul>
          <h4>Balance: ${balance.toFixed(2)}</h4>
        </>
      )}
    </div>
  );
}
// ...existing code...
