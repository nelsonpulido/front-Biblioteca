import api from './api';

export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      activeUsers: 0,
      borrowedBooks: 0,
      pendingAlerts: 0
    };
  }
};

export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    return [];
  }
};

export const getDashboardOverview = async () => {
  try {
    const response = await api.get('/dashboard/overview');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al obtener vista general:', error);
    throw error;
  }
}