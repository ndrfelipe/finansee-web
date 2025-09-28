import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';

// Importando as páginas
import Telatransacoes from "./pages/Telatransacoes";
import Teladashboard from "./pages/Teladashboard"; 
import Telacategoria from "./pages/Telacategoria";
import Telarelatorio from "./pages/Telarelatorio";
import Telacriacaoreceita from "./pages/Telacriacaoreceita";
import Telacriacaodesp from "./pages/Telacriacaodesp";
import Telacriacaocateg from "./pages/Telacriacaocateg";

// MOCK DE DADOS INICIAIS
const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Alimentação', color: '#FF6347', type: 'despesa' },
  { id: 'c2', name: 'Salário', color: '#3CB371', type: 'receita' },
  { id: 'c3', name: 'Transporte', color: '#4682B4', type: 'despesa' },
];

// Componente que gerencia o fluxo de categorias
const CategoryRouteWrapper = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const handleCreateNewCategory = () => {
    navigate('/nova-categoria');
  };

  const handleEditCategory = (category) => {
    navigate(`/editar-categoria/${category.id}`);
  };

  const handleCloseModal = () => {
    navigate('/');
  };

  return (
    <Telacategoria
      categories={categories}
      onEditCategory={handleEditCategory}
      onCreateNewCategory={handleCreateNewCategory}
      onClose={handleCloseModal}
    />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Telatransacoes />} />
        <Route path="/dashboard" element={<Teladashboard />} /> 
        <Route path="/transacoes" element={<Telatransacoes />} />
        <Route path="/relatorios" element={<Telarelatorio />} />
        <Route path="/categorias" element={<CategoryRouteWrapper />} />
        <Route path="/nova-receita" element={<Telacriacaoreceita />} />
        <Route path="/nova-despesa" element={<Telacriacaodesp />} />
        <Route path="/nova-categoria" element={<Telacriacaocateg />} />
        <Route path="/editar-categoria/:id" element={<Telacriacaocateg />} />
      </Routes>
    </Router>
  );
}

export default App;
