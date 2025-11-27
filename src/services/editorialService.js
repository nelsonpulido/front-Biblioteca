import api from './api';

export const getEditorials = async () => {
  try {
    const response = await api.get('/editoriales');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener editoriales:', error);
    throw error;
  }
};

export const createEditorial = async (editorialData) => {
  try {
    const response = await api.post('/editoriales', editorialData);
    return response.data;
  } catch (error) {
    console.error('Error al crear editorial:', error);
    throw error;
  }
};

export const updateEditorial = async (editorialId, editorialData) => {
  try {
    const response = await api.put(`/editoriales/${editorialId}`, editorialData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar editorial:', error);
    throw error;
  }
};

export const deleteEditorial = async (editorialId) => {
  try {
    const response = await api.delete(`/editoriales/${editorialId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar editorial:', error);
    throw error;
  }
};