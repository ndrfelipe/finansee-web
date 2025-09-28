import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Importando todas as páginas da sua aplicação
import Telatransacoes from "./pages/Telatransacoes";
import Teladashboard from "./pages/Teladashboard";
import Telacategoria from "./pages/Telacategoria";
import Telarelatorio from "./pages/Telarelatorio";
import Telacriacaoreceita from "./pages/Telacriacaoreceita";
import Telacriacaodesp from "./pages/Telacriacaodesp";
import Telacriacaocateg from "./pages/Telacriacaocateg";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas da navegação principal */}
        <Route path="/" element={<Telatransacoes />} /> {}
        <Route path="/dashboard" element={<Teladashboard />} />
        <Route path="/transacoes" element={<Telatransacoes />} />
        <Route path="/categorias" element={<Telacategoria />} />
        <Route path="/relatorios" element={<Telarelatorio />} />

        {/* Rotas para os formulários de criação */}
        <Route path="/nova-receita" element={<Telacriacaoreceita />} />
        <Route path="/nova-despesa" element={<Telacriacaodesp />} />
        <Route path="/nova-categoria" element={<Telacriacaocateg />} />
      </Routes>
    </Router>
  );
}

export default App;