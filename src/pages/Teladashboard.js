// src/pages/Teladashboard.js

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaArrowUp, FaArrowDown, FaUniversity } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getTransactions } from '../services/mockApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Teladashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
      }
    };
    fetchData();
  }, []);

  const { receitas, despesas, saldoAtual } = useMemo(() => {
    const totalReceitas = transactions.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
    const totalDespesas = transactions.filter(t => t.valor < 0).reduce((sum, t) => sum + Math.abs(t.valor), 0);
    const saldo = totalReceitas - totalDespesas;
    return { receitas: totalReceitas, despesas: totalDespesas, saldoAtual: saldo };
  }, [transactions]);

  const despesasPorCategoria = {
    labels: ['Alimentação', 'Transporte', 'Lazer', 'Outros'],
    datasets: [
      {
        label: 'Despesas (%)',
        data: [40, 25, 20, 15],
        backgroundColor: ['#FF6347', '#8B4513', '#FFA500', '#1E3A8A'],
        borderRadius: 6,
      },
    ],
  };

  const receitasPorCategoria = {
    labels: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    datasets: [
      {
        label: 'Receitas (%)',
        data: [70, 15, 10, 5],
        backgroundColor: ['#3CB371', '#00CED1', '#1E90FF', '#FFD700'],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = context.label;
            const value = context.parsed.y;
            return `${category}: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
  };

  const handleNavigate = (key) => {
    switch (key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'transacoes':
        navigate('/');
        break;
      case 'categorias-list':
        navigate('/categorias');
        break;
      case 'relatorio':
        navigate('/relatorios');
        break;
      default:
        break;
    }
  };

  return (
    <div className="page-layout">
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        onNewTransaction={(type) => navigate(`/nova-${type}`)}
      />

      <div className="main-content-area">
        <h1>Dashboard</h1>

        {/* Cards de saldo, receitas e despesas */}
        <div className="summary-cards-container">
          <div className="summary-card">
            <div className="card-header">
              <h3>Saldo atual</h3>
              <FaUniversity className="income-icon" />
            </div>
            <p className="card-value">R$ {saldoAtual.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <div className="card-header">
              <h3>Receitas</h3>
              <FaArrowUp className="income-icon" />
            </div>
            <p className="card-value">R$ {receitas.toFixed(2)}</p>
          </div>

          <div className="summary-card">
            <div className="card-header">
              <h3>Despesas</h3>
              <FaArrowDown className="expense-icon" />
            </div>
            <p className="card-value">R$ {despesas.toFixed(2)}</p>
          </div>
        </div>

        {/* Gráficos lado a lado */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Despesas por categoria</h3>
            <Bar data={despesasPorCategoria} options={chartOptions} />
            <button className="secondary-button" onClick={() => navigate('/relatorios')}>
              Ver mais
            </button>
          </div>

          <div className="chart-card">
            <h3>Receitas por categoria</h3>
            <Bar data={receitasPorCategoria} options={chartOptions} />
            <button className="secondary-button" onClick={() => navigate('/relatorios')}>
              Ver mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teladashboard;
