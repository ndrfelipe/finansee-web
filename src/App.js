import React, { useState } from "react";
// Importando useNavigate para navegação
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';

// Importando as páginas
import Telatransacoes from "./pages/Telatransacoes";
import Teladashboard from "./pages/Teladashboard"; 
import Telacategoria from "./pages/Telacategoria"; // O componente de lista
import Telarelatorio from "./pages/Telarelatorio";
import Telacriacaoreceita from "./pages/Telacriacaoreceita";
import Telacriacaodesp from "./pages/Telacriacaodesp";
import Telacriacaocateg from "./pages/Telacriacaocateg"; // O formulário C/E

// MOCK DE DADOS INICIAIS
const INITIAL_CATEGORIES = [
    { id: 'c1', name: 'Alimentação', color: '#FF6347', type: 'despesa' },
    { id: 'c2', name: 'Salário', color: '#3CB371', type: 'receita' },
    { id: 'c3', name: 'Transporte', color: '#4682B4', type: 'despesa' },
];

// Componente que gerencia o fluxo de categorias (Estado + Funções)
const CategoryRouteWrapper = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);

    const handleCreateNewCategory = () => {
        navigate('/nova-categoria');
    };

    const handleEditCategory = (category) => {
        navigate(`/editar-categoria/${category.id}`);
    };
    
    const handleDeleteCategory = (categoryId) => {
        // Lógica de exclusão no estado (FRONT-END)
        setCategories(prevCategories => 
            prevCategories.filter(cat => cat.id !== categoryId)
        );
        console.log(`Categoria ID ${categoryId} excluída.`);
        // Em um projeto real: chamar a API para exclusão.
    };
    
    const handleCloseModal = () => {
        // CORREÇÃO: Volta para a rota principal (Transações) ao fechar.
        navigate('/'); 
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas principais */}
        <Route path="/" element={<Telatransacoes />} />
        <Route path="/dashboard" element={<Teladashboard />} /> 
        <Route path="/transacoes" element={<Telatransacoes />} />
        <Route path="/relatorios" element={<Telarelatorio />} />

        {/* ROTA CATEGORIAS: Usando o wrapper que contém o estado e as funções de manipulação */}
        <Route path="/categorias" element={<CategoryRouteWrapper />} />
        
        {/* Rotas de formulários */}
        <Route path="/nova-receita" element={<Telacriacaoreceita />} />
        <Route path="/nova-despesa" element={<Telacriacaodesp />} />
        
        {/* Rota para CRIAR Categoria */}
        <Route path="/nova-categoria" element={<Telacriacaocateg />} />
        
        {/* Rota para EDITAR Categoria (com ID) */}
        <Route path="/editar-categoria/:id" element={<Telacriacaocateg />} />
      </Routes>
    </Router>
  );
}

export default App;