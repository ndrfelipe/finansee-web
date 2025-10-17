// src/pages/Telacriacaoreceita.js

import React, { useState, useEffect } from 'react'; 
import { FaTimes } from 'react-icons/fa'; 
import { createTransaction, updateTransaction } from '../services/mockApi'; 

const Telacriacaoreceita = ({ transactionToEdit, onClose, onSaveSuccess, categories = [] }) => {
    
  const [formData, setFormData] = useState({
    id: null,
    valor: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    account: '',
    tipoPagamento: 'pix',
    tipo: 'receita'
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        id: transactionToEdit.id,
        valor: Math.abs(transactionToEdit.valor).toFixed(2), 
        date: transactionToEdit.date, 
        description: transactionToEdit.description,
        category: transactionToEdit.category,
        account: transactionToEdit.account,
        tipoPagamento: transactionToEdit.tipoPagamento,
        tipo: 'receita'
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [transactionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = { ...formData, valor: parseFloat(formData.valor) };

    try {
      if (isEditing) {
        await updateTransaction(formData.id, dataToSave);
      } else {
        await createTransaction(dataToSave);
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const incomeCategories = categories.filter(cat => cat.type === 'receita');

  return (
    <div className="form-modal-overlay">
      <div className="form-card transaction-modal">
        <div className="modal-header">
          <h2>{isEditing ? "Editar Receita" : "Nova Receita"}</h2>
          <FaTimes className="icon-close" onClick={onClose} />
        </div>
        
        <form onSubmit={handleSave}>
          <label>Valor</label>
          <div className="input-group">
            <span className="currency-symbol">R$</span>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="styled-input"
            />
          </div>
          
          <label>Data</label>
          <input 
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="styled-input"
          />

          <label>Descrição</label>
          <input 
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Salário, Venda de Produto"
            required
            className="styled-input"
          />
          
          <label>Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="styled-select" 
            required
            disabled={loading}
          >
            <option value="" disabled>Selecione uma categoria...</option>
            {incomeCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Conta</label>
          <input 
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
            placeholder="Ex: Nubank, Carteira, Banco do Brasil"
            required
            className="styled-input"
          />

          <label>Tipo de pagamento</label>
          <select
            name="tipoPagamento"
            value={formData.tipoPagamento}
            onChange={handleChange}
            className="styled-select"
            required
          >
            <option value="pix">Pix</option>
            <option value="boleto">Boleto</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
          </select>

          <button type="submit" className="create-button" disabled={loading}>
            {loading ? "Salvando..." : (isEditing ? "Editar" : "Criar")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Telacriacaoreceita;
