import api from './api';

export const getLoans = async () => {
  try {
    const response = await api.get('/prestamos');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    throw error;
  }
};

export const createLoan = async (loanData) => {
  try {
    const response = await api.post('/prestamos', loanData);
    return response.data;
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    throw error;
  }
};

export const updateLoan = async (loanId, loanData) => {
  try {
    const response = await api.put(`/prestamos/${loanId}`, loanData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar préstamo:', error);
    throw error;
  }
};

export const deleteLoan = async (loanId) => {
  try {
    const response = await api.delete(`/prestamos/${loanId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    throw error;
  }
};