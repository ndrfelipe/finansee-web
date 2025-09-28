// src/pages/Telaexcluirdr.js
import React from 'react';

// Nome da função atualizado para Telaexcluirdr
function Telaexcluirdr({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal-content">
        <h4>Deseja mesmo excluir essa despesa/receita?</h4>
        <div className="confirm-modal-actions">
          <button onClick={onCancel} className="cancel-button">
            Cancelar
          </button>
          <button onClick={onConfirm} className="confirm-button">
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Telaexcluirdr; 