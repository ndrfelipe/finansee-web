import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import './Auth.css';
import registerIllustration from '../assets/register-chart.png'; // imagem ilustrativa para registro

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await registerUser({ name, email, password });
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userName', response.name);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-content">
                <div className="auth-visual-side">
                    <img src={registerIllustration} alt="Ilustração de registro" className="login-illustration" />
                    <h1>Vamos começar!</h1>
                    <p>Crie sua conta e comece a gerenciar suas finanças com inteligência.</p>
                </div>

                <div className="auth-form-side">
                    <div className="auth-container">
                        <div className="auth-card">
                            <h2>Criar Conta</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Nome</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Senha</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <button type="submit" className="auth-button" disabled={loading}>
                                    {loading ? 'Criando...' : 'Criar Conta'}
                                </button>
                            </form>
                            <p className="switch-form-text">
                                Já tem uma conta? <Link to="/login">Faça login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
