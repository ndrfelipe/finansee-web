import React, { useState } from 'react';

function Telacriacaoreceita({ addTransaction, onClose }) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('hoje');
  const [situation, setSituation] = useState(true); // true = recebida

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      type: 'receita',
      description,
      category,
      value: parseFloat(value),
      date: new Date().toLocaleDateString('pt-BR'), // Simplificado, pode ser melhorado
      situation: situation ? 'Recebida' : 'Pendente',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Nova Receita</h2>
          <div className="form-group-valor">
            <input type="number" placeholder="R$ 0,00" value={value} onChange={e => setValue(e.target.value)} required />
          </div>
          <div className="form-group-toggle">
            <label>Foi recebida</label>
            <label className="switch">
              <input type="checkbox" checked={situation} onChange={() => setSituation(!situation)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="form-group-date">
            {/* Lógica de data aqui */}
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="submit-button">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Telacriacaoreceita;