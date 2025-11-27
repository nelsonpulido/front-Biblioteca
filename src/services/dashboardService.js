import api from './api';

/**
 * Obtener estadísticas generales del dashboard
 */
export const getStatistics = async () => {
    try {
        console.log('📊 Obteniendo estadísticas...');
        const response = await api.get('/statistics');
        console.log('✅ Estadísticas obtenidas:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        console.error('Detalles del error:', error.response?.data);
        throw error;
    }
};

/**
 * Obtener actividad reciente
 */
export const getRecentActivity = async () => {
    try {
        console.log('📋 Obteniendo actividad reciente...');
        const response = await api.get('/recent-activity');
        return response.data;
    } catch (error) {
        console.error('❌ Error al obtener actividad reciente:', error);
        throw error;
    }
};

/**
 * Obtener libros populares
 */
export const getPopularBooks = async () => {
    try {
        console.log('📚 Obteniendo libros populares...');
        const response = await api.get('/popular-books');
        return response.data;
    } catch (error) {
        console.error('❌ Error al obtener libros populares:', error);
        throw error;
    }
};

/**
 * Obtener reportes
 */
export const getReports = async () => {
    try {
        console.log('📈 Obteniendo reportes...');
        const response = await api.get('/reports');
        return response.data;
    } catch (error) {
        console.error('❌ Error al obtener reportes:', error);
        throw error;
    }
};