// src/pages/Telacategoria.js

import React, { useState } from 'react';
import { FaTimes, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const Telacategoria = ({ 
  onClose, 
  onEditCategory, 
  onCreateNewCategory,
  onDeleteCategory,
  categories = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isLightColor = (hex) => {
     if (!hex || hex.length < 7) return false;
     try {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.65;
    } catch (e) {
        return false;
    }
   };


  const filteredCategories = categories.filter(cat =>
     cat && cat.nome && cat.nome.toLowerCase().includes(searchTerm.toLowerCase())
   );

  return (
    <div className="form-modal-overlay">
      <div className="form-card category-list-modal">
        <div className="modal-header">
          <h2 style={{ width: '100%', textAlign: 'center' }}>Categorias</h2>
          <FaTimes className="icon-close" onClick={onClose} />
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Procurar categorias..."
            className="styled-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-list-section">
          <h3>Categorias</h3>

          {filteredCategories.map((category) => {
            // 3. CORREÇÃO: Lendo 'cor' (do backend) e calculando o 'textColor'
            const categoryColor = category.cor || '#0047AB'; // Pega a cor do DTO
            const textColor = isLightColor(categoryColor) ? '#333' : 'white';

            return (
               <div key={category.id} className="category-item-display">
                  <span
                    className="category-name-tag"
                    style={{ backgroundColor: categoryColor, color: textColor }} // <- Corrigido
                  >
                    {/* 4. CORREÇÃO: Lendo 'nome' (do backend) */}
                    {category.nome} 
                  </span>

                  <button
                    className="edit-icon-button"
                    onClick={() => onEditCategory(category)} // Isso já estava correto
                    title="Editar"
                  >
                    <FaPencilAlt />
                  </button>

                  <button
                    className="delete-icon-button" // (Use o CSS do seu action-button)
                    onClick={() => onDeleteCategory(category.id)}
                    title="Excluir"
                  >
                      <FaTrashAlt />
                  </button>
               </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <p className="no-data-message">Nenhuma categoria encontrada.</p>
          )}
        </div>

        <div className="modal-actions-footer">
          <button
            className="create-button full-width-button"
            onClick={onCreateNewCategory}
          >
            Criar uma nova categoria
          </button>
        </div>
      </div>
    </div>
  );
};

export default Telacategoria;
