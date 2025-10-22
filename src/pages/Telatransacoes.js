// src/pages/Telatransacoes.js

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SummaryCards from '../components/SummaryCards';
import MonthSelector from '../components/MonthSelector';
import TransactionList from '../components/TransactionList';
import Telacriacaodesp from './Telacriacaodesp'; 
import Telacriacaoreceita from './Telacriacaoreceita'; 
import Telacategoria from './Telacategoria'; 
import Telacriacaocateg from './Telacriacaocateg'; 
import Telaexcluirdr from './Telaexcluirdr';

import { 
    deleteTransaction, 
    getTransactions, 
    getCategories,      
    updateCategory,     
    createCategory,     
    deleteCategory      
} from '../services/apiService'; 


const Telatransacoes = () => {
    const navigate = useNavigate();

    // ESTADOS PRINCIPAIS
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [modalType, setModalType] = useState(null);

    // FILTROS
    const [filters, setFilters] = useState({
        categoria: "",
        dataInicio: "",
        dataFim: "",
        valorMin: "",
        valorMax: ""
    });

    // ESTADOS DE EDIÇÃO E NAVEGAÇÃO
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [showCategoryDetails, setShowCategoryDetails] = useState(false);
    const [currentPage] = useState('transacoes');
    const [currentMonth, setCurrentMonth] = useState('Setembro 2025');
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    // --- FUNÇÕES DE NAVEGAÇÃO ---
    const handleNavigate = (key) => {
        switch (key) {
            case 'dashboard': navigate('/dashboard'); break;
            case 'transacoes': navigate('/'); break;
            case 'categorias-list': navigate('/categorias'); break;
            case 'relatorio': navigate('/relatorios'); break;
            default: break;
        }
    };

    const handleDeleteClick = (transaction) => { setTransactionToDelete(transaction); };
    const handleConfirmDelete = async () => {
        if (!transactionToDelete) return;
        try {
            await deleteTransaction(transactionToDelete);
            setNotification({ type: 'success', message: 'Transação excluída com sucesso!' });
            fetchData();
        } catch (error) {
            setNotification({ type: 'error', message: error.message || 'Falha ao excluir a transação.' });
        } finally {
            setTransactionToDelete(null);
        }
    };
    const handleCancelDelete = () => setTransactionToDelete(null);
    const handleCloseModal = () => {
        setModalType(null);
        setTransactionToEdit(null);
        setCategoryToEdit(null);
        setShowCategoryDetails(false);
        setTransactionToDelete(null);
    };

    // --- FUNÇÕES DE CARREGAMENTO ---
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Falha ao carregar categorias:", err);
            setNotification({ type: 'error', message: 'Falha ao carregar as categorias.' });
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions();
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (err) {
            setNotification({ type: 'error', message: 'Falha ao carregar as transações.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    // --- LÓGICA DE FILTRO ---
    useEffect(() => {
        let resultado = [...transactions];

        if (filters.categoria) {
            resultado = resultado.filter(t => t.categoria?.toLowerCase() === filters.categoria.toLowerCase());
        }

        if (filters.dataInicio && filters.dataFim) {
            resultado = resultado.filter(t => {
                const dataTransacao = new Date(t.data);
                return dataTransacao >= new Date(filters.dataInicio) && dataTransacao <= new Date(filters.dataFim);
            });
        }

        if (filters.valorMin) {
            resultado = resultado.filter(t => t.valor >= parseFloat(filters.valorMin));
        }

        if (filters.valorMax) {
            resultado = resultado.filter(t => t.valor <= parseFloat(filters.valorMax));
        }

        setFilteredTransactions(resultado);
    }, [filters, transactions]);

    // --- MEMORIZAÇÃO E CÁLCULOS ---
    const { receitas, despesas, saldoAtual } = useMemo(() => {
        const totalReceitas = transactions.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
        const totalDespesas = transactions.filter(t => t.valor < 0).reduce((sum, t) => sum + Math.abs(t.valor), 0);
        const saldo = totalReceitas - totalDespesas;
        return { receitas: totalReceitas, despesas: totalDespesas, saldoAtual: saldo };
    }, [transactions]);

    const { despesaCategories, receitaCategories } = useMemo(() => {
        if (!categories) return { despesaCategories: [], receitaCategories: [] };
        const despesas = categories.filter(c => c.tipo.toUpperCase() === 'DESPESA');
        const receitas = categories.filter(c => c.tipo.toUpperCase() === 'RECEITA');
        return { despesaCategories: despesas, receitaCategories: receitas };
    }, [categories]);

    // --- HANDLERS ---
    const handleNewTransaction = (type) => {
        setTransactionToEdit(null);
        setCategoryToEdit(null);
        setShowCategoryDetails(false);
        if (type === 'despesa' || type === 'receita') setModalType(type);
        else if (type === 'categoria') setModalType('categoria');
    };

    const handleEdit = (transaction) => {
        setTransactionToEdit(transaction);
        setModalType(transaction.valor < 0 ? 'despesa' : 'receita');
    };

    const handleDelete = async (transaction) => {
        if (window.confirm(`Tem certeza que deseja excluir a transação de R$${Math.abs(transaction.valor).toFixed(2).replace('.', ',')} - "${transaction.description}"?`)) {
            try {
                await deleteTransaction(transaction);
                setNotification({ type: 'success', message: 'Transação excluída com sucesso!' });
                fetchData();
            } catch (error) {
                setNotification({ type: 'error', message: error.message || 'Falha ao excluir a transação.' });
            }
        }
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setShowCategoryDetails(true);
    };

    const handleCreateNewCategory = () => {
        setCategoryToEdit(null);
        setShowCategoryDetails(true);
    };

    const handleSaveCategorySuccess = async (savedCategory) => {
        setNotification(null);
        try {
            if (savedCategory.id) await updateCategory(savedCategory);
            else await createCategory(savedCategory);
            await fetchCategories();
            setCategoryToEdit(null);
            setShowCategoryDetails(false);
            setNotification({ type: 'success', message: `Categoria "${savedCategory.name}" salva com sucesso!` });
        } catch (error) {
            console.error("Erro na API ao salvar categoria:", error);
            setNotification({ type: 'error', message: `Erro ao salvar categoria: ${error.message}` });
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
        setNotification(null);
        try {
            await deleteCategory(categoryId);
            setNotification({ type: 'success', message: 'Categoria excluída com sucesso!' });
            fetchCategories();
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            setNotification({ type: 'error', message: error.message });
        }
    };

    const handleClearFilters = () => {
        setFilters({ categoria: "", dataInicio: "", dataFim: "", valorMin: "", valorMax: "" });
        setFilteredTransactions(transactions);
    };

    if (loading) return <div className="loading-spinner">Entrando no sistema...</div>;

    // --- RENDERIZAÇÃO ---
    return (
        <div className="page-layout">
            <Sidebar
                activePage={currentPage}
                onNavigate={handleNavigate}
                onNewTransaction={handleNewTransaction}
            />

            <div className="main-content-area">
                {notification && (
                    <div className={`notification notification-${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                {(modalType === 'despesa' || modalType === 'receita') && (
                    modalType === 'despesa' ? (
                        <Telacriacaodesp
                            transactionToEdit={transactionToEdit}
                            onClose={handleCloseModal}
                            onSaveSuccess={fetchData}
                            categories={despesaCategories}
                        />
                    ) : (
                        <Telacriacaoreceita
                            transactionToEdit={transactionToEdit}
                            onClose={handleCloseModal}
                            onSaveSuccess={fetchData}
                            categories={receitaCategories}
                        />
                    )
                )}

                {modalType === 'categoria' && !showCategoryDetails && (
                    <Telacategoria
                        onClose={handleCloseModal}
                        onEditCategory={handleEditCategory}
                        onCreateNewCategory={handleCreateNewCategory}
                        categories={categories}
                        onDeleteCategory={handleDeleteCategory}
                    />
                )}

                {modalType === 'categoria' && showCategoryDetails && (
                    <Telacriacaocateg
                        categoryToEdit={categoryToEdit}
                        onClose={handleCloseModal}
                        onBackToCategories={() => {
                            setCategoryToEdit(null);
                            setShowCategoryDetails(false);
                        }}
                        onSaveSuccess={handleSaveCategorySuccess}
                    />
                )}

                {transactionToDelete && (
                    <Telaexcluirdr
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}

                <div className="filters-section" style={{ marginBottom: '20px' }}>
                    <h2>Filtrar Transações</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <select
                            value={filters.categoria}
                            onChange={e => setFilters({ ...filters, categoria: e.target.value })}
                        >
                            <option value="">Todas as Categorias</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <input type="date" value={filters.dataInicio}
                            onChange={e => setFilters({ ...filters, dataInicio: e.target.value })}
                        />
                        <input type="date" value={filters.dataFim}
                            onChange={e => setFilters({ ...filters, dataFim: e.target.value })}
                        />

                        <input type="number" placeholder="Valor mínimo"
                            value={filters.valorMin}
                            onChange={e => setFilters({ ...filters, valorMin: e.target.value })}
                        />
                        <input type="number" placeholder="Valor máximo"
                            value={filters.valorMax}
                            onChange={e => setFilters({ ...filters, valorMax: e.target.value })}
                        />

                        <button onClick={handleClearFilters}>Limpar filtros</button>
                    </div>
                </div>

                <div className="transactions-header-section">
                    <h1>Transações</h1>
                    <div className="table-wrapper-card">
                        <MonthSelector
                            currentMonth={currentMonth}
                            onPrevious={() => setCurrentMonth('Agosto 2025')}
                            onNext={() => setCurrentMonth('Outubro 2025')}
                        />
                        <TransactionList
                            transactions={filteredTransactions}
                            onDelete={handleDeleteClick}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>

                <SummaryCards
                    saldoAtual={saldoAtual}
                    receitas={receitas}
                    despesas={despesas}
                />
            </div>
        </div>
    );
};

export default Telatransacoes;
