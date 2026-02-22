import React, { useState } from 'react';

export default function CategoriaManager({ categoriasIngreso, categoriasGasto, onAddCategoria, onEditCategoria, onDeleteCategoria }) {
  const [tipo, setTipo] = useState('ingreso');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [editCat, setEditCat] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (nuevaCategoria.trim()) {
      onAddCategoria(tipo, nuevaCategoria.trim());
      setNuevaCategoria('');
    }
  };

  const handleEdit = (cat) => {
    setEditCat(cat);
    setEditValue(cat);
  };

  const handleEditSave = () => {
    if (editValue.trim() && editCat) {
      onEditCategoria(tipo, editCat, editValue.trim());
      setEditCat(null);
      setEditValue('');
    }
  };

  const handleDelete = (cat) => {
    onDeleteCategoria(tipo, cat);
    if (editCat === cat) {
      setEditCat(null);
      setEditValue('');
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Gestionar categorías</h3>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontWeight: 'bold', marginRight: 8 }}>Tipo:</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
      </div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevaCategoria}
          onChange={e => setNuevaCategoria(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button className="button" type="button" onClick={handleAdd}>Añadir</button>
      </div>
      <div>
        <b>Categorías de {tipo}:</b>
        <ul>
          {(tipo === 'ingreso' ? categoriasIngreso : categoriasGasto).map(cat => (
            <li key={cat} style={{ marginBottom: 4 }}>
              {editCat === cat ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    style={{ marginRight: 8 }}
                  />
                  <button className="button" type="button" style={{ marginRight: 4 }} onClick={handleEditSave}>Guardar</button>
                  <button className="button" type="button" onClick={() => setEditCat(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  {cat}
                  <button className="button" type="button" style={{ marginLeft: 8 }} onClick={() => handleEdit(cat)}>Editar</button>
                  <button className="button" type="button" style={{ marginLeft: 4 }} onClick={() => handleDelete(cat)}>Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
