import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CategoryRouteWrapper from "./components/CategoryRouteWrapper";

import './App.css';

// Importando as páginas
import Telatransacoes from "./pages/Telatransacoes";
import Teladashboard from "./pages/Teladashboard"; 
import Telarelatorio from "./pages/Telarelatorio";
import Telacriacaoreceita from "./pages/Telacriacaoreceita";
import Telacriacaodesp from "./pages/Telacriacaodesp";
import Telacriacaocateg from "./pages/Telacriacaocateg";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Telatransacoes />} />
        <Route path="/dashboard" element={<Teladashboard />} /> 
        <Route path="/transacoes" element={<Telatransacoes />} />
        <Route path="/relatorios" element={<Telarelatorio />} />
        {/* <Route path="/categorias" element={<CategoryRouteWrapper />} /> */}
        <Route path="/nova-receita" element={<Telacriacaoreceita />} />
        <Route path="/nova-despesa" element={<Telacriacaodesp />} />
        <Route path="/nova-categoria" element={<Telacriacaocateg />} />
        <Route path="/editar-categoria/:id" element={<Telacriacaocateg />} />
      </Routes>
    </Router>
  );
}

export default App;
