import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

// Recebemos `categoryColors` como um novo prop:
// categoryColors deve ser um objeto: { 'Alimentação': '#FF6347', 'Salário': '#3CB371', ... }
const TransactionList = ({ transactions, onDelete, onEdit, categoryColors = {} }) => {
    
    // Função para obter a cor da categoria
    const getCategoryColor = (categoryName) => {
        // Busca a cor no mapa fornecido, usa um azul escuro padrão se não encontrar
        return categoryColors[categoryName] || '#0047AB'; 
    };

    // Função para verificar se a cor é clara e precisa de texto escuro (como o dourado)
    const isLightColor = (hex) => {
        // Lógica simples para verificar se a cor é clara para garantir o contraste
        // Esta é uma checagem comum para cores como Amarelo, Dourado, etc.
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        // Usa a fórmula de luminância
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.65; // Ajuste este valor conforme necessário
    };

    const formatCurrencyValue = (value) => {
        const formatted = Math.abs(value).toFixed(2).replace('.', ',');
        // Corrigido para não ter um segundo 'R$' no valor negativo, mas sim o sinal de menos.
        return value < 0 ? `R$ -${formatted}` : `R$ ${formatted}`;
    };

    return (
        <div className="transaction-list-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Situação</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th> {/* Aqui será a tag colorida */}
                        <th>Conta</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => {
                        const categoryColor = getCategoryColor(t.category);
                        const textColor = isLightColor(categoryColor) ? '#333' : 'white';
                        
                        return (
                            <tr key={t.id} className={t.valor < 0 ? 'expense-row' : 'income-row'}>
                                <td>
                                    {t.status === 'ok' ? (
                                        <FaCheckCircle className="status-icon status-ok" title="Concluído" />
                                    ) : (
                                        <FaExclamationCircle className="status-icon status-warning" title="Pendente/Erro" />
                                    )}
                                </td>
                                <td>{t.date}</td>
                                <td>{t.description}</td>
                                
                                {/* CÉLULA DA CATEGORIA REFORMULADA */}
                                <td>
                                    <span 
                                        className="category-tag-display" 
                                        style={{ 
                                            backgroundColor: categoryColor,
                                            color: textColor, // Define a cor do texto (preto ou branco)
                                            padding: '4px 8px', // Ajusta o padding para caber melhor na tabela
                                            fontSize: '0.85rem' // Tamanho menor para caber na linha
                                        }}
                                    >
                                        {t.category}
                                    </span>
                                </td>
                                
                                <td>{t.account}</td>
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
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;