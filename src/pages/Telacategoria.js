// src/pages/Telacategoria.js

import React from 'react';
import { FaTimes, FaPencilAlt } from 'react-icons/fa';

const Telacategoria = ({ 
    onClose, 
    onEditCategory, 
    onCreateNewCategory, 
    categories = [], 
}) => {
    
    // Função auxiliar para cor de fundo (usa a cor do mock ou padrão)
    const getBackgroundColor = (category) => {
        return category.color || (category.type === 'receita' ? '#3CB371' : '#FF6347');
    };

    return (
        <div className="form-modal-overlay">
            <div className="form-card category-list-modal">
                <div className="modal-header">
                    {/* Estilizado no CSS para centralizar */}
                    <h2 style={{width: '100%', textAlign: 'center'}}>Categorias</h2>
                    <FaTimes className="icon-close" onClick={onClose} />
                </div>
                
                <div className="search-bar">
                    <input type="text" placeholder="Procurar categorias..." className="styled-input" />
                </div>

                <div className="category-list-section">
                    <h3>Categorias</h3>
                    
                    {categories.map((category) => (
                        <div key={category.id} className="category-item-display">
                            <span 
                                className="category-name-tag" 
                                style={{ backgroundColor: getBackgroundColor(category), color: 'white' }}
                            >
                                {category.name}
                            </span>
                            
                            {/* CHAMA A EDIÇÃO PASSANDO O OBJETO COMPLETO */}
                            <button 
                                className="edit-icon-button"
                                onClick={() => onEditCategory(category)}
                            >
                                <FaPencilAlt />
                            </button>
                        </div>
                    ))}
                    
                    {categories.length === 0 && (
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
                    <button 
                        className="secondary-button full-width-button"
                        onClick={() => alert("Função 'Mostrar mais categorias' mockada.")}
                    >
                        Mostrar mais categorias
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Telacategoria;