import React from "react";
import { Link } from "react-router-dom";

function Telatransacoes() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <button className="new-transaction">Nova</button>
        <nav className="menu">
          <Link to="/">📊 Dashboard</Link>
          <Link to="/tela-transacoes" className="active">💰 Transações</Link>
          <Link to="/categorias">🏷️ Categorias</Link>
          <Link to="/relatorios">📑 Relatório</Link>
        </nav>
      </aside>

      <main className="main-content">
        <h1>Transações</h1>

        <div className="filters">
          <input type="text" placeholder="Buscar transação..." />
          <div className="actions">
            <button>Filtrar</button>
            <button>Exportar</button>
          </div>
        </div>

        <div className="transaction-list">
          <p>Lista de transações aparecerá aqui...</p>
        </div>

        <div className="summary">
          <div className="summary-card saldo">
            <p>Saldo atual</p>
            <h3>R$ 80,00</h3>
          </div>
          <div className="summary-card receita">
            <p>Receitas</p>
            <h3>R$ 100,00</h3>
          </div>
          <div className="summary-card despesa">
            <p>Despesas</p>
            <h3>R$ 20,00</h3>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Telatransacoes;