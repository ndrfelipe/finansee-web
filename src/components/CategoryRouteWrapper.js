import React, { useState, useEffect } from "react"; 
import { BrowserRouter, useNavigate } from "react-router-dom";
import Telacategoria from "../pages/Telacategoria";
import { getCategories, deleteCategory } from "../services/apiService";
import '../App.css';

// Componente que gerencia o fluxo de categorias
const 
CategoryRouteWrapper = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCreateNewCategory = () => {
    navigate('/nova-categoria');
  };

  const handleEditCategory = (category) => {
    navigate(`/editar-categoria/${category.id}`);
  };
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
        return;
    }
    setNotification(null);
    try {
        await deleteCategory(categoryId); // Chama a API real
        setNotification({ type: 'success', message: 'Categoria excluída com sucesso!' });
        // Atualiza a lista na tela sem precisar recarregar tudo
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        setNotification({ type: 'error', message: error.message });
    }
  };

  const handleCloseModal = () => {
    navigate('/');
  };

  if (loading) {
    // Pode retornar um spinner ou null enquanto carrega
    return <div>Carregando categorias...</div>; 
  }

  return (
  <>
    {/* Exibe a notificação */}
    {notification && (
        <div className={`notification notification-${notification.type}`}>
            {notification.message}
        </div>
    )}
     <Telacategoria
        categories={categories} // Passa as categorias reais
        onEditCategory={handleEditCategory}
        onCreateNewCategory={handleCreateNewCategory}
      onDeleteCategory={handleDeleteCategory} // <-- 7. PASSA A FUNÇÃO REAL
        onClose={handleCloseModal}
     />
  </>
   );
};

export default CategoryRouteWrapper