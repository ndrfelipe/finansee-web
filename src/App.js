import React, { useState, useEffect } from "react";
// Adicionado 'Navigate' para redirecionamento
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
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

// Componente para proteger rotas que exigem login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
 return (
 <Router>
   <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Protegidas */}
    <Route path="/" element={<ProtectedRoute><Telatransacoes /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Teladashboard /></ProtectedRoute>} /> 
    <Route path="/transacoes" element={<ProtectedRoute><Telatransacoes /></ProtectedRoute>} />
    <Route path="/relatorios" element={<ProtectedRoute><Telarelatorio /></ProtectedRoute>} />
    {/* <Route path="/categorias" element={<CategoryRouteWrapper />} /> */}
    <Route path="/nova-receita" element={<ProtectedRoute><Telacriacaoreceita /></ProtectedRoute>} />
    <Route path="/nova-despesa" element={<ProtectedRoute><Telacriacaodesp /></ProtectedRoute>} />
    <Route path="/nova-categoria" element={<ProtectedRoute><Telacriacaocateg /></ProtectedRoute>} />
    <Route path="/editar-categoria/:id" element={<ProtectedRoute><Telacriacaocateg /></ProtectedRoute>} />

        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
   </Routes>
 </Router>
 );
}

export default App;