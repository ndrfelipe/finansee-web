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
import { 
    deleteTransaction, 
    getTransactions, 
    getCategoriesMock, 
    updateCategoryMock, 
    createCategoryMock 
} from '../services/mockApi'; 

const Telatransacoes = () => {
    const navigate = useNavigate();

    // ESTADOS PRINCIPAIS
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [modalType, setModalType] = useState(null); 
    
    // ESTADOS DE EDIÇÃO E NAVEGAÇÃO
    const [transactionToEdit, setTransactionToEdit] = useState(null); 
    const [categoryToEdit, setCategoryToEdit] = useState(null); 
    const [showCategoryDetails, setShowCategoryDetails] = useState(false);
    const [currentPage] = useState('transacoes');
    const [currentMonth, setCurrentMonth] = useState('Setembro 2025');

    // --- FUNÇÕES DE NAVEGAÇÃO ---
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

    // --- FUNÇÕES DE CARREGAMENTO ---
    const fetchCategories = async () => {
        try {
            const data = await getCategoriesMock(); 
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

    // --- MEMORIZAÇÃO E CÁLCULOS ---
    const { receitas, despesas, saldoAtual } = useMemo(() => {
        const totalReceitas = transactions.filter(t => t.valor > 0).reduce((sum, t) => sum + t.valor, 0);
        const totalDespesas = transactions.filter(t => t.valor < 0).reduce((sum, t) => sum + Math.abs(t.valor), 0);
        const saldo = totalReceitas - totalDespesas;
        return { receitas: totalReceitas, despesas: totalDespesas, saldoAtual: saldo };
    }, [transactions]);
    
    const categoryColors = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.name] = cat.color;
            return acc;
        }, {});
    }, [categories]);

    // --- HANDLERS ---
    const handleNewTransaction = (type) => { 
        setTransactionToEdit(null); 
        setCategoryToEdit(null); 
        setShowCategoryDetails(false); 
        if (type === 'despesa' || type === 'receita') { 
            setModalType(type); 
        } else if (type === 'categoria') { 
            setModalType('categoria'); 
        } 
    };
    
    const handleEdit = (transaction) => { 
        setTransactionToEdit(transaction); 
        setModalType(transaction.valor < 0 ? 'despesa' : 'receita'); 
    };

    const handleDelete = async (transaction) => { 
        if (window.confirm(`Tem certeza que deseja excluir a transação de R$${Math.abs(transaction.valor).toFixed(2).replace('.', ',')} - "${transaction.description}"?`)) { 
            try { 
                await deleteTransaction(transaction.id); 
                setNotification({ type: 'success', message: 'Transação excluída com sucesso!' }); 
                fetchData(); 
            } catch (error) { 
                setNotification({ type: 'error', message: error.message || 'Falha ao excluir a transação.' }); 
            } 
        } 
    };

    const handleCloseModal = () => { 
        setModalType(null); 
        setTransactionToEdit(null); 
        setCategoryToEdit(null); 
        setShowCategoryDetails(false); 
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
            if (savedCategory.id) {
                await updateCategoryMock(savedCategory);
            } else {
                await createCategoryMock(savedCategory);
            }
            await fetchCategories();
            setCategoryToEdit(null); 
            setShowCategoryDetails(false);
            setNotification({ type: 'success', message: `Categoria "${savedCategory.name}" salva com sucesso!` });
        } catch (error) {
            console.error("Erro na API ao salvar categoria:", error);
            setNotification({ type: 'error', message: `Erro ao salvar categoria: ${error.message}` });
        }
    };

    if (loading) return <div className="loading-spinner">Carregando transações...</div>;

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
                    modalType === 'despesa' ? 
                        <Telacriacaodesp 
                            transactionToEdit={transactionToEdit} 
                            onClose={handleCloseModal} 
                            onSaveSuccess={fetchData} 
                            categories={categories}
                        /> 
                        :
                        <Telacriacaoreceita 
                            transactionToEdit={transactionToEdit} 
                            onClose={handleCloseModal} 
                            onSaveSuccess={fetchData} 
                            categories={categories}
                        /> 
                )}
                
                {modalType === 'categoria' && !showCategoryDetails && (
                    <Telacategoria 
                        onClose={handleCloseModal} 
                        onEditCategory={handleEditCategory}
                        onCreateNewCategory={handleCreateNewCategory}
                        categories={categories} 
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
                
                <div className="transactions-header-section">
                    <h1>Transações</h1>
                    <div className="table-wrapper-card">
                        <MonthSelector 
                            currentMonth={currentMonth} 
                            onPrevious={() => setCurrentMonth('Agosto 2025')} 
                            onNext={() => setCurrentMonth('Outubro 2025')} 
                        />
                        <TransactionList 
                            transactions={transactions} 
                            onDelete={handleDelete} 
                            onEdit={handleEdit} 
                            categoryColors={categoryColors}
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
