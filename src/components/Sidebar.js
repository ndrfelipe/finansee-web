import React, { useState } from 'react';
import { 
    FaChartPie, FaExchangeAlt, FaTags, FaFileAlt, 
    FaPlus, FaChevronDown, FaChevronUp, 
    FaChartLine, FaChartArea 
} from 'react-icons/fa'; 

const Sidebar = ({ activePage, onNavigate, onNewTransaction }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // DEFINIÇÃO CORRIGIDA DO navItems
  const navItems = [
    { name: 'Dashboard', icon: FaChartPie, key: 'dashboard' },
    { name: 'Transações', icon: FaExchangeAlt, key: 'transacoes' },
    // { name: 'Categorias', icon: FaTags, key: 'categorias-list' }, // Renomeei para evitar conflito
    { name: 'Relatório', icon: FaFileAlt, key: 'relatorio' },
  ];

  // VARIÁVEL QUE ESTAVA FALTANDO E CAUSANDO O ERRO
  const dropdownItems = [
    { name: 'Receita', icon: FaChartLine, key: 'receita' },
    { name: 'Despesa', icon: FaChartArea, key: 'despesa' },
    { name: 'Categoria', icon: FaTags, key: 'categoria' },
  ];

  const handleDropdownClick = (type) => {
    setIsDropdownOpen(false); // Fecha o menu ao selecionar
    onNewTransaction(type);   // Chama a função handleNewTransaction na Telatransacoes.js
  };

  return (
    <div className="sidebar-container">
        
      {/* Botão Nova Transação com Dropdown */}
      <div className="new-transaction-wrapper">
          <button 
              className="new-transaction-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
              <FaPlus /> Nova
              {isDropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
          
          {isDropdownOpen && (
              <div className="new-transaction-dropdown">
                  {dropdownItems.map(item => (
                      <div 
                          key={item.key} 
                          className="dropdown-item"
                          onClick={() => handleDropdownClick(item.key)}
                      >
                          <item.icon size={16} />
                          <span>{item.name}</span>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Links de Navegação */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.key}
            className={`nav-item ${activePage === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <item.icon className="nav-icon" />
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;