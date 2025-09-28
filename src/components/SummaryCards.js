import React from 'react';
import { FaUniversity, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Card = ({ title, value, icon: Icon, color, isIncome }) => (
    <div className="summary-card">
        <div className="card-header">
            <h3>{title}</h3>
            <Icon size={24} className={isIncome ? "income-icon" : "expense-icon"} />
        </div>
        <p className="card-value" style={{ color: color }}>
            {value}
        </p>
    </div>
);

const SummaryCards = ({ saldoAtual, receitas, despesas }) => {
  const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <div className="summary-cards-container">
      <Card 
        title="Saldo atual"
        value={formatCurrency(saldoAtual)}
        icon={FaUniversity}
        color="#0047AB"
      />

      <Card 
        title="Receitas"
        value={formatCurrency(receitas)}
        icon={FaArrowUp}
        color="green"
        isIncome={true}
      />
      
      <Card 
        title="Despesas"
        value={formatCurrency(despesas)}
        icon={FaArrowDown}
        color="red"
        isIncome={false}
      />
    </div>
  );
};

export default SummaryCards;