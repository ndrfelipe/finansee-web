import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Telacriacaodesp() {
  // Estados para cada campo do formulário
  const [valor, setValor] = useState('');
  const [paga, setPaga] = useState(true); // Mudamos de 'recebida' para 'paga'
  const [data, setData] = useState('hoje');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar a despesa virá aqui
    console.log({ valor, paga, data, descricao, categoria });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Nova Despesa</h2> {/* Título alterado */}

          <div className="form-group-valor">
            <span>$</span>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
            <span className="currency">BRL</span>
          </div>

          <div className="form-group-toggle">
            <label>Foi paga</label> {/* Label alterada */}
            <label className="switch">
              <input
                type="checkbox"
                checked={paga}
                onChange={() => setPaga(!paga)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="form-group-date">
            <button
              type="button"
              className={data === 'hoje' ? 'active' : ''}
              onClick={() => setData('hoje')}
            >
              Hoje
            </button>
            <button
              type="button"
              className={data === 'ontem' ? 'active' : ''}
              onClick={() => setData('ontem')}
            >
              Ontem
            </button>
            <button
              type="button"
              className={data === 'outros' ? 'active' : ''}
              onClick={() => setData('outros')}
            >
              Outros
            </button>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <Link to="/transacoes" className="cancel-button">Cancelar</Link>
            <button type="submit" className="submit-button">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Telacriacaodesp;