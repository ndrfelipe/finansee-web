import React from 'react';
// Removemos os ícones de status, pois o DTO não tem mais esse campo
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

/**
 * Componente TransactionList
 * * Recebe a lista de transações (já formatada pelo backend)
 * e as funções de onEdit e onDelete.
 * * Não precisa mais do prop 'categoryColors', pois a cor vem
 * em cada objeto de transação (t.categoriaCor).
 */
const TransactionList = ({ transactions, onDelete, onEdit }) => {
    
    // Função para verificar se a cor é clara e precisa de texto escuro
    const isLightColor = (hex) => {
        // Se a cor não for definida (ex: #null), usa um padrão
        if (!hex || hex.length < 4) return false; // Assume fundo escuro -> texto claro

        try {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            
            // Fórmula de luminância
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.65; // Retorna true se a cor for clara
        } catch (e) {
            return false; // Retorna false em caso de erro no parse da cor
        }
    };

    // Formata o valor para a moeda brasileira
    const formatCurrencyValue = (value) => {
        if (value == null) return "R$ 0,00";
        
        const formatted = Math.abs(value).toFixed(2).replace('.', ',');
        // O valor já vem negativo do backend para despesas
        return value < 0 ? `R$ -${formatted}` : `R$ ${formatted}`;
    };

    // Formata a data do backend (AAAA-MM-DD) para DD/MM/AAAA
    const formatDate = (dateString) => {
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString; // Retorna a string original se o formato falhar
        }
    };

    return (
        <div className="transaction-list-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        {/* Coluna 'Situação' removida, pois não vem do DTO */}
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Conta</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Verifica se transactions existe e tem itens antes de mapear */}
                    {transactions && transactions.length > 0 ? (
                        transactions.map((t) => {
                            // Pega a cor direto da transação! Não precisa de lookup.
                            const categoryColor = t.categoriaCor;
                            const textColor = isLightColor(categoryColor) ? '#333' : 'white';
                            
                            return (
                                <tr key={t.id} className={t.valor < 0 ? 'expense-row' : 'income-row'}>
                                    
                                    {/* Usa o formatador de data */}
                                    <td>{formatDate(t.data)}</td>
                                    
                                    {/* Usa o campo 'descricao' do DTO */}
                                    <td>{t.descricao}</td>
                                    
                                    <td>
                                        <span 
                                            className="category-tag-display" 
                                            style={{ 
                                                backgroundColor: categoryColor || '#0047AB', // Cor padrão
                                                color: textColor,
                                                padding: '4px 8px',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {/* Usa o campo 'categoriaNome' do DTO */}
                                            {t.categoriaNome}
                                        </span>
                                    </td>
                                    
                                    {/* Usa o campo 'conta' do DTO */}
                                    <td>{t.conta}</td>
                                    
                                    <td className={t.valor < 0 ? 'expense-value' : 'income-value'}>
                                        {formatCurrencyValue(t.valor)}
                                    </td>
                                    
                                    <td className="actions-cell">
                                        <button onClick={() => onEdit(t)} className="action-button edit-button">
                                            <FaPencilAlt />
                                        </button>
                                        <button onClick={() => onDelete(t)} className="action-button delete-button">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                Nenhuma transação encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;