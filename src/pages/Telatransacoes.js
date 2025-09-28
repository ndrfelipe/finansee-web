import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Telacriacaorecei from "./Telacriacaoreceita";
import Telacriacaodesp from "./Telacriacaodesp";
import Telacriacaocateg from "./Telacriacaocateg";
import Telaexcluirdr from "./Telaexcluirdr";

function Telatransacoes() {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'despesa', situation: 'pendente', date: '08/09/2025', description: 'Alimentação', category: 'Alimentação', conta: 'Nubank', value: 410.90 },
    { id: 2, type: 'despesa', situation: 'pago', date: '08/09/2025', description: 'Alimentação', category: 'Alimentação', conta: 'Nubank', value: 15.90 },
    { id: 3, type: 'receita', situation: 'recebido', date: '08/09/2025', description: 'Renda extra', category: 'Renda extra', conta: 'Carteira', value: 500.00 },
  ]);

  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // --- LÓGICA DO DROPDOWN RESTAURADA ---
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  // ------------------------------------

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => { setNotification(''); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setTransactions(prev => [newTransaction, ...prev]);
    setNotification(`Nova ${transaction.type} adicionada com sucesso!`);
  };

  const deleteTransaction = () => {
    if (transactionToDelete) {
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      setNotification('Transação excluída com sucesso!');
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <div className="dashboard-layout">
        <aside className="sidebar">
          {/* --- BOTÃO "NOVA" COM DROPDOWN --- */}
          <div className="new-transaction-container">
            <button className="new-transaction" onClick={toggleDropdown}>
              Nova
            </button>
            {isDropdownOpen && (
              <div className="new-transaction-dropdown">
                <button onClick={() => { setShowReceitaModal(true); setDropdownOpen(false); }}>+ Receita</button>
                <button onClick={() => { setShowDespesaModal(true); setDropdownOpen(false); }}>+ Despesa</button>
                <button onClick={() => { setShowCategoriaModal(true); setDropdownOpen(false); }}>+ Categoria</button>
              </div>
            )}
          </div>
          {/* ------------------------------------ */}
          <nav className="menu">
            <NavLink to="/dashboard">📊 Dashboard</NavLink>
            <NavLink to="/transacoes">💰 Transações</NavLink>
            <NavLink to="/categorias">🏷️ Categorias</NavLink>
            <NavLink to="/relatorios">📑 Relatório</NavLink>
          </nav>
        </aside>

        <main className="main-content-split">
          <div className="content-left">
            <div className="main-header">
              <h1>Transações</h1>
              <div className="header-actions">
                <button className="icon-button">🔍</button>
                <button className="icon-button">🔽</button>
                <button className="icon-button">⋮</button>
              </div>
            </div>
            <div className="month-selector">
              <button className="arrow-button">‹</button>
              <span>Setembro 2025</span>
              <button className="arrow-button">›</button>
            </div>
            <div className="transaction-list">
              <div className="transaction-list-header-full">
                <span>Situação</span>
                <span>Data</span>
                <span>Descrição</span>
                <span>Categoria</span>
                <span>Conta</span>
                <span className="valor-header">Valor</span>
                <span>Ações</span>
              </div>
              {transactions.map(t => (
                <div key={t.id} className={`transaction-item-full ${t.type}`}>
                  <span className="status-cell">
                    <span className={`status-icon ${t.situation === 'pago' || t.situation === 'recebido' ? 'success' : 'pending'}`}>
                      {t.situation === 'pago' || t.situation === 'recebido' ? '✅' : '❗'}
                    </span>
                  </span>
                  <span>{t.date}</span>
                  <span>{t.description}</span>
                  <span>{t.category}</span>
                  <span>{t.conta}</span>
                  <span className="valor">{t.type === 'receita' ? `R$ ${t.value.toFixed(2)}` : `- R$ ${t.value.toFixed(2)}`}</span>
                  <span className="actions-cell">
                    <button className="action-icon-button">✏️</button>
                    <button onClick={() => setTransactionToDelete(t.id)} className="action-icon-button delete-button">🗑️</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="content-right">
            {/* ... seus cards de resumo ... */}
          </div>
        </main>
      </div>

      {showReceitaModal && <Telacriacaorecei addTransaction={addTransaction} onClose={() => setShowReceitaModal(false)} />}
      {showDespesaModal && <Telacriacaodesp addTransaction={addTransaction} onClose={() => setShowDespesaModal(false)} />}
      {showCategoriaModal && <Telacriacaocateg onClose={() => setShowCategoriaModal(false)} />}
      {transactionToDelete && <Telaexcluirdr onConfirm={deleteTransaction} onCancel={() => setTransactionToDelete(null)} />}
      {notification && <div className="notification success toast">{notification}</div>}
    </>
  );
}

export default Telatransacoes;