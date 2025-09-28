// src/pages/CategoryFlowManager.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Telacategoria from './Telacategoria';

// MOCK DE DADOS INICIAIS (SIMULAÇÃO)
const INITIAL_CATEGORIES = [
    { id: 'c1', name: 'Alimentação', color: '#FF6347', type: 'despesa' },
    { id: 'c2', name: 'Salário', color: '#3CB371', type: 'receita' },
    { id: 'c3', name: 'Transporte', color: '#4682B4', type: 'despesa' },
];

const CategoryFlowManager = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    // --- FUNÇÕES DE MANIPULAÇÃO DE ESTADO ---

    const handleCreateNewCategory = () => {
        // Leva o usuário para a rota de criação
        navigate('/nova-categoria');
    };

    const handleEditCategory = (category) => {
        // Leva o usuário para a rota de edição, passando o ID
        navigate(`/editar-categoria/${category.id}`);
    };
    
    // Função de Exclusão (Implementada aqui no gerenciador de estado)
    const handleDeleteCategory = (categoryId) => {
        setCategories(prevCategories => 
            prevCategories.filter(cat => cat.id !== categoryId)
        );
        console.log(`Categoria ID ${categoryId} excluída.`);
    };
    
    // Simula o fechamento do modal voltando para a tela anterior (Ex: Dashboard)
    const handleCloseModal = () => {
        // Assumindo que /dashboard é a tela principal
        navigate('/dashboard'); 
    };

    return (
        <Telacategoria
            onClose={handleCloseModal}
            onEditCategory={handleEditCategory}
            onCreateNewCategory={handleCreateNewCategory}
            onDeleteCategory={handleDeleteCategory}
            categories={categories}
        />
    );
};

export default CategoryFlowManager;