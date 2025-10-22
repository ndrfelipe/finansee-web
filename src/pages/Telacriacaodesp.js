// src/pages/Telacriacaodesp.js

import React, { useState, useEffect } from 'react'; 
import { FaTimes } from 'react-icons/fa'; 
import { createTransaction, updateTransaction } from '../services/apiService'; 

const Telacriacaodesp = ({ transactionToEdit, onClose, onSaveSuccess, categories = [] }) => {
    
  const [formData, setFormData] = useState({
     id: null,
     valor: '',
     data: new Date().toISOString().split('T')[0],
     descricao: '',   // <- Corrigido de 'description'
     categoriaId: '', // <- Corrigido de 'category' (agora armazena o ID)
     conta: '',       // <- Corrigido de 'account'
     formaPagamento: 'PIX', // <- Corrigido de 'tipoPagamento'
     tipo: 'despesa'
   });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
     if (transactionToEdit) {
      // O 'transactionToEdit' vem do GET /api/transacoes
        setFormData({
          id: transactionToEdit.id,
          valor: Math.abs(transactionToEdit.valor).toFixed(2), // O valor vem negativo
          data: transactionToEdit.data, 
          descricao: transactionToEdit.descricao,     // <- Corrigido
          categoriaId: transactionToEdit.categoriaId, // <- Corrigido
          conta: transactionToEdit.conta,             // <- Corrigido
          formaPagamento: transactionToEdit.formaPagamento, // <- Corrigido
          tipo: 'despesa'
        });
        setIsEditing(true);
     } else {
      // Reseta o formulário para criação
        setFormData({
        id: null,
        valor: '',
        data: new Date().toISOString().split('T')[0],
        descricao: '',
        categoriaId: '',
        conta: '',
        formaPagamento: 'PIX',
        tipo: 'despesa'
      });
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

    try {
      const dataToSave = {
        ...formData,
        valor: parseFloat(formData.valor)
      };

      if (isEditing) {
          await updateTransaction(dataToSave); // Passa o objeto inteiro
        } else {
          await createTransaction(dataToSave); // Passa o objeto inteiro
        }
        onSaveSuccess(); // Recarrega os dados na tela principal
        onClose();       // Fecha o modal
     } catch (error) {
        console.error("Erro ao salvar despesa:", error);
        alert(`Erro: ${error.message}`);
     } finally {
        setLoading(false);
     }
  };

  const expenseCategories = categories.filter(cat => cat.tipo === 'DESPESA');

  return (
    <div className="form-modal-overlay">
      <div className="form-card transaction-modal">
        <div className="modal-header">
          <h2>{isEditing ? "Editar Despesa" : "Nova Despesa"}</h2>
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
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            className="styled-input"
          />

          <label>Descrição</label>
          <input 
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Ex: Conta de luz, Supermercado"
            required
            className="styled-input"
          />
          
          <label>Categoria</label>
          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            className="styled-select" 
            required
            disabled={loading}
          >
            <option value="" disabled>Selecione uma categoria...</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <label>Conta</label>
          <input 
            type="text"
            name="conta"
            value={formData.conta}
            onChange={handleChange}
            placeholder="Ex: Nubank, Carteira, Banco do Brasil"
            required
            className="styled-input"
          />

          <label>Tipo de pagamento</label>
          <select
            name="formaPagamento"
            value={formData.formaPagamento}
            onChange={handleChange}
            className="styled-select"
            required
          >
            <option value="PIX">Pix</option>
            <option value="BOLETO">Boleto</option>
            <option value="CARTAO_DEBITO">Cartão de Débito</option>
            <option value="CARTAO_CREDITO">Cartão de Crédito</option>
          </select>

          <button type="submit" className="create-button" disabled={loading}>
            {loading ? "Salvando..." : (isEditing ? "Editar" : "Criar")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Telacriacaodesp;
