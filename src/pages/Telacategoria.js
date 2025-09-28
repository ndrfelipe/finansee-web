// src/pages/Telacategoria.js - Adicione valores padrão (Default Props)

import React from 'react';
import { FaTimes, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; 

// Função de segurança que não faz nada (No Operation)
const NOOP = () => {}; 

const Telacategoria = ({ 
    onClose = NOOP, // Valor padrão de segurança
    onEditCategory = NOOP, // Valor padrão de segurança
    onCreateNewCategory = NOOP, // Valor padrão de segurança
    onDeleteCategory = NOOP, // <--- AQUI! Evita o crash se não for fornecida
    categories = [], 
}) => {
    
    // Função auxiliar para cor de fundo (usa a cor do mock ou padrão)
    const getBackgroundColor = (category) => {
        return category.color || (category.type === 'receita' ? '#3CB371' : '#FF6347');
    };

    // Função para confirmar e chamar a exclusão
    const handleDeleteClick = (category) => {
        const isConfirmed = window.confirm(
            `Tem certeza que deseja EXCLUIR a categoria "${category.name}"? Esta ação não pode ser desfeita e pode afetar transações existentes.`
        );
        if (isConfirmed) {
            // Chama a função. Se ela não foi passada, ele chama a NOOP (que não quebra o app).
            onDeleteCategory(category.id); 
        }
    };

    return (
        <div className="form-modal-overlay">
            <div className="form-card category-list-modal">
                <div className="modal-header">
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
                            
                            <div className="category-actions">
                                {/* BOTÃO DE EXCLUIR */}
                                <button 
                                    className="action-icon-button delete-button"
                                    onClick={() => handleDeleteClick(category)}
                                >
                                    <FaTrashAlt />
                                </button>
                                
                                {/* BOTÃO DE EDIÇÃO */}
                                <button 
                                    className="action-icon-button edit-icon-button"
                                    onClick={() => onEditCategory(category)}
                                >
                                    <FaPencilAlt />
                                </button>
                            </div>
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