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
    getCategories,      // <- NOVO
    updateCategory,     // <- NOVO
    createCategory,     // <- NOVO
    deleteCategory      // <- NOVO (para o futuro)
} from '../services/apiService'; // Aponta para o seu novo arquivo de API


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

    const [transactionToDelete, setTransactionToDelete] = useState(null);

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

    const handleDeleteClick = (transaction) => { 
        setTransactionToDelete(transaction); // Guarda a transação que queremos deletar
    };

    const handleConfirmDelete = async () => {
        if (!transactionToDelete) return; // Segurança

        try { 
            // Usa a função do apiService que já criamos
            await deleteTransaction(transactionToDelete); 
            setNotification({ type: 'success', message: 'Transação excluída com sucesso!' }); 
            fetchData(); // Atualiza a lista
        } catch (error) { 
            setNotification({ type: 'error', message: error.message || 'Falha ao excluir a transação.' }); 
        } finally {
            setTransactionToDelete(null); // Fecha o modal
        }
    };

    // 6. CRIE A FUNÇÃO DE CANCELAMENTO (QUE SERÁ PASSADA PARA O MODAL)
    const handleCancelDelete = () => {
        setTransactionToDelete(null); // Apenas fecha o modal
    };

    const handleCloseModal = () => { 
        setModalType(null); 
        setTransactionToEdit(null); 
        setCategoryToEdit(null); 
        setShowCategoryDetails(false); 
        // Também garanta que o modal de delete feche se outro for aberto
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
    
    const { despesaCategories, receitaCategories } = useMemo(() => {
        if (!categories) {
            return { despesaCategories: [], receitaCategories: [] };
        }
        
        const despesas = categories.filter(c => c.tipo.toUpperCase() === 'DESPESA');
        const receitas = categories.filter(c => c.tipo.toUpperCase() === 'RECEITA');
        
        return { despesaCategories: despesas, receitaCategories: receitas };
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
            if (savedCategory.id) {
                await updateCategory(savedCategory);
            } else {
                await createCategory(savedCategory);
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

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            return;
        }
        
        setNotification(null); // Limpa notificações antigas
        try {
            await deleteCategory(categoryId);
            
            setNotification({ type: 'success', message: 'Categoria excluída com sucesso!' });
            
            // 3. Atualiza a lista de categorias na tela
            fetchCategories(); // (Esta é a sua função que chama getCategories)
            
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            setNotification({ type: 'error', message: error.message });
        }
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
                    modalType === 'despesa' ? 
                        <Telacriacaodesp 
                            transactionToEdit={transactionToEdit} 
                            onClose={handleCloseModal} 
                            onSaveSuccess={fetchData} 
                            categories={despesaCategories}
                        /> 
                        :
                        <Telacriacaoreceita 
                            transactionToEdit={transactionToEdit} 
                            onClose={handleCloseModal} 
                            onSaveSuccess={fetchData} 
                            categories={receitaCategories}
                        /> 
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
