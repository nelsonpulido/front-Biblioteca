import api from './api';

export const getBooks = async () => {
    try {
        const response = await api.get('/libros');
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error al obtener libros:', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const response = await api.post('/libros', bookData);
        return response.data;
    } catch (error) {
        console.error('Error al crear libro:', error);
        throw error;
    }
};

export const updateBook = async (id, bookData) => {
    try {
        const response = await api.put(`/libros/${id}`, bookData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        throw error;
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await api.delete(`/libros/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        throw error;
    }
};