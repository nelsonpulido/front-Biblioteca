import api from './api';

export const getAuthors = async () => {
  try {
    const response = await api.get('/autores');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener autores:', error);
    throw error;
  }
};

export const createAuthor = async (authorData) => {
  try {
    const response = await api.post('/autores', authorData);
    return response.data;
  } catch (error) {
    console.error('Error al crear autor:', error);
    throw error;
  }
};

export const updateAuthor = async (authorId, authorData) => {
  try {
    const response = await api.put(`/autores/${authorId}`, authorData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar autor:', error);
    throw error;
  }
};

export const deleteAuthor = async (authorId) => {
  try {
    const response = await api.delete(`/autores/${authorId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar autor:', error);
    throw error;
  }
};
