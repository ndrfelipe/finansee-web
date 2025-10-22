import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import './Auth.css';
import loginIllustration from '../assets/chart-login.png'; // sua imagem

const LoginPage = () => {
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
            const response = await loginUser({ email, password });
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
                    <img src={loginIllustration} alt="Gráfico financeiro" className="login-illustration" />
                    <h1>Que bom te ver de novo!</h1>
                    <p>Gerencie suas finanças com facilidade e segurança.</p>
                </div>

                <div className="auth-form-side">
                    <div className="auth-container">
                        <div className="auth-card">
                            <h2>Entrar</h2>
                            <form onSubmit={handleSubmit}>
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
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </button>
                            </form>
                            <p className="switch-form-text">
                                Não tem uma conta? <Link to="/register">Cadastre-se</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
