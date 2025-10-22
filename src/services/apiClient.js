import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Busca o token de autenticação do localStorage (ou de onde você o salvou no login)
    const token = localStorage.getItem('authToken'); // O nome da chave que você usou ao salvar

    // Se o token existir, nós o adicionamos ao cabeçalho da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Retorna a configuração modificada para que a requisição possa continuar
    return config;
  },
  (error) => {
    // Em caso de erro na configuração, rejeita a promise
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Se a resposta for 2xx (sucesso), apenas a retorna
    return response;
  },
  (error) => {
    // Verifica se o erro é 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
      // Isso geralmente significa que o token é inválido ou expirou.
      
      // 1. Remove o token inválido
      localStorage.removeItem('authToken'); 
      
      // 2. Redireciona o usuário para a tela de login
      // (Não podemos usar hooks do React aqui, então usamos a API do navegador)
      window.location.href = '/login'; 
      
      // Você pode querer mostrar uma mensagem (ex: com react-toastify)
      alert('Sua sessão expirou. Por favor, faça login novamente.');
    }

    // Para qualquer outro erro, apenas rejeita a promise
    return Promise.reject(error);
  }
);

export default apiClient;