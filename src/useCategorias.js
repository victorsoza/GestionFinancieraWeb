import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export function useCategorias() {
  const categoriasIngresoDefault = ['Salario', 'Venta', 'Premio', 'Otro'];
  const categoriasGastoDefault = ['Alimentación', 'Transporte', 'Servicios', 'Educación', 'Salud', 'Entretenimiento', 'Otro'];

  const [categoriasIngreso, setCategoriasIngreso] = useState(categoriasIngresoDefault);
  const [categoriasGasto, setCategoriasGasto] = useState(categoriasGastoDefault);
  const [uid, setUid] = useState(null);

  // Recibe el uid del usuario desde App.js
  const setUserUid = (userUid) => {
    setUid(userUid);
  };

  useEffect(() => {
    if (!uid) return;
    const fetchCategorias = async () => {
      const catDoc = doc(db, 'categorias', uid);
      const snap = await getDoc(catDoc);
      if (snap.exists()) {
        const data = snap.data();
        setCategoriasIngreso(data.ingreso?.length ? data.ingreso : categoriasIngresoDefault);
        setCategoriasGasto(data.gasto?.length ? data.gasto : categoriasGastoDefault);
      } else {
        await setDoc(catDoc, { ingreso: categoriasIngresoDefault, gasto: categoriasGastoDefault });
        setCategoriasIngreso(categoriasIngresoDefault);
        setCategoriasGasto(categoriasGastoDefault);
      }
    };
    fetchCategorias();
    // eslint-disable-next-line
  }, [uid]);

  const handleAddCategoria = async (tipo, nuevaCategoria) => {
    if (!uid) return;
    if (tipo === 'ingreso') {
      setCategoriasIngreso(prev => prev.includes(nuevaCategoria) ? prev : [...prev, nuevaCategoria]);
      await updateDoc(doc(db, 'categorias', uid), {
        ingreso: categoriasIngreso.includes(nuevaCategoria) ? categoriasIngreso : [...categoriasIngreso, nuevaCategoria]
      });
    } else {
      setCategoriasGasto(prev => prev.includes(nuevaCategoria) ? prev : [...prev, nuevaCategoria]);
      await updateDoc(doc(db, 'categorias', uid), {
        gasto: categoriasGasto.includes(nuevaCategoria) ? categoriasGasto : [...categoriasGasto, nuevaCategoria]
      });
    }
  };

  const handleEditCategoria = async (tipo, oldCat, newCat) => {
    if (!uid) return;
    if (tipo === 'ingreso') {
      const updated = categoriasIngreso.map(cat => cat === oldCat ? newCat : cat);
      setCategoriasIngreso(updated);
      await updateDoc(doc(db, 'categorias', uid), { ingreso: updated });
    } else {
      const updated = categoriasGasto.map(cat => cat === oldCat ? newCat : cat);
      setCategoriasGasto(updated);
      await updateDoc(doc(db, 'categorias', uid), { gasto: updated });
    }
  };

  const handleDeleteCategoria = async (tipo, cat) => {
    if (!uid) return;
    if (tipo === 'ingreso') {
      const updated = categoriasIngreso.filter(c => c !== cat);
      setCategoriasIngreso(updated);
      await updateDoc(doc(db, 'categorias', uid), { ingreso: updated });
    } else {
      const updated = categoriasGasto.filter(c => c !== cat);
      setCategoriasGasto(updated);
      await updateDoc(doc(db, 'categorias', uid), { gasto: updated });
    }
  };

  return {
    categoriasIngreso,
    categoriasGasto,
    handleAddCategoria,
    handleEditCategoria,
    handleDeleteCategoria,
    categoriasIngresoDefault,
    categoriasGastoDefault,
    setUserUid
  };
}
