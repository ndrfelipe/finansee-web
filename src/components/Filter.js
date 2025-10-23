import React, { useState, useEffect, useMemo, useCallback } from 'react';

const Filters = ({}){
    return (
        <>
            <div className="filters-section" style={{ marginBottom: '20px' }}>
                    <h2>Filtrar Transações</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Categoria:</span>
                        <select
                        name='categoriaId'
                        value={filters.categoriaId}
                        onChange={handleFilterChange}
                        >
                        <option value="">Todas as Categorias</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                            {cat.nome}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Data de Início:</span>
                        <input
                        type="date"
                        name='dataInicio'
                        value={filters.dataInicio}
                        onChange={handleFilterChange}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Data de Fim:</span>
                        <input
                        type="date"
                        name='dataFim'
                        value={filters.dataFim}
                        onChange={handleFilterChange}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Valor mínimo:</span>
                        <input
                        type="number"
                        name='valorMinimo'
                        placeholder="0"
                        value={filters.valorMin}
                        onChange={handleFilterChange}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>Valor máximo:</span>
                        <input
                        type="number"
                        name='valorMax'
                        placeholder="0"
                        value={filters.valorMax}
                        onChange={handleFilterChange}
                        />
                    </div>

                    <button onClick={handleClearFilters}>Limpar filtros</button>
                </div>
            </div>

                <div className="transactions-header-section">
                    <h1>Transações</h1>
                    <div className="table-wrapper-card">
                        
                        <TransactionList
                            transactions={transactions}
                            onDelete={handleDeleteClick}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
        </>
    )
}