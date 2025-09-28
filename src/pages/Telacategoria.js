// src/pages/Telacategoria.js

import React, { useState } from 'react';
import { FaTimes, FaPencilAlt } from 'react-icons/fa';

const Telacategoria = ({ 
  onClose, 
  onEditCategory, 
  onCreateNewCategory, 
  categories = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getBackgroundColor = (category) => {
    return category.color || (category.type === 'receita' ? '#3CB371' : '#FF6347');
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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

          {filteredCategories.map((category) => (
            <div key={category.id} className="category-item-display">
              <span
                className="category-name-tag"
                style={{ backgroundColor: getBackgroundColor(category), color: 'white' }}
              >
                {category.name}
              </span>

              <button
                className="edit-icon-button"
                onClick={() => onEditCategory(category)}
                title="Editar"
              >
                <FaPencilAlt />
              </button>
            </div>
          ))}

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
