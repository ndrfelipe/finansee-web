import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Telatransacoes from "./pages/Telatransacoes";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/tela-transacoes" element={<Telatransacoes />} />
      </Routes>
    </Router>
  );
}

export default App;
