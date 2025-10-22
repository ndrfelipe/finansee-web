import React, { useState, useEffect } from 'react'; // 1. Importa o useEffect
import { useNavigate } from 'react-router-dom';
import Telacategoria from './Telacategoria';

// 2. Importa as funções REAIS da API
import { getCategories, deleteCategory } from '../services/apiService';

// 3. Removemos o INITIAL_CATEGORIES (mock)

const CategoryFlowManager = () => {
    const navigate = useNavigate();
    
    // 4. Inicializa os estados como vazios/loading
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null); // Para feedback

    // --- FUNÇÕES DE NAVEGAÇÃO (Já estavam corretas) ---
    const handleCreateNewCategory = () => {
           navigate('/nova-categoria');
    };

    const handleEditCategory = (category) => {
           navigate(`/editar-categoria/${category.id}`);
    };
    
    // 5. ADICIONA O CARREGAMENTO REAL DOS DADOS
    useEffect(() => {
        fetchCategories();
    }, []); // O array vazio [] faz isso rodar uma vez quando o componente é montado

    const fetchCategories = async () => {
        setLoading(true);
        setNotification(null);
        try {
            const data = await getCategories(); // Chama a API real
            setCategories(data);
        } catch (err) {
            console.error("Falha ao carregar categorias:", err);
            setNotification({ type: 'error', message: 'Falha ao carregar as categorias.' });
        } finally {
            setLoading(false);
        }
    };

    // 6. CORREÇÃO: Implementa a exclusão REAL
    const handleDeleteCategory = async (categoryId) => {
        // Confirmação com o usuário
        if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            return;
        }

        setNotification(null);
           try {
            // Chama a API real para deletar
            await deleteCategory(categoryId); 
            
            // Atualiza o estado local para remover a categoria da tela
            // (Isso é mais rápido do que chamar fetchCategories() de novo)
                        setCategories(prevCategories => 
                               prevCategories.filter(cat => cat.id !== categoryId)
                        );
            setNotification({ type: 'success', message: 'Categoria excluída com sucesso!' });

           } catch (error) {
            // Exibe a mensagem de erro que vem do apiService (ex: "Categoria em uso")
            console.error(`Erro ao excluir categoria ${categoryId}:`, error);
            setNotification({ type: 'error', message: error.message });
        }
    };
    
    const handleCloseModal = () => {
           navigate('/dashboard'); // (Isto está correto)
    };

    // Adiciona uma tela de loading
    if (loading) {
        return (
            <div className="form-modal-overlay">
                <div className="form-card category-list-modal">
                    <div className="loading-spinner">Carregando categorias...</div>
                </div>
            </div>
        );
    }

    return (
    <> 
        {/* Renderiza a notificação (opcional, mas bom para UX) */}
        {notification && (
            <div className={`notification notification-${notification.type}`}>
                {notification.message}
            </div>
        )}

           <Telacategoria
                        onClose={handleCloseModal}
                        onEditCategory={handleEditCategory}
                        onCreateNewCategory={handleCreateNewCategory}
                        onDeleteCategory={handleDeleteCategory} // Agora passa a função real
                        categories={categories} // Passa as categorias vindas do backend
           />
    </>
    );
};

export default CategoryFlowManager;