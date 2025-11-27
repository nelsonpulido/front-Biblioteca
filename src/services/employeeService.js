import api from './api';

export const getEmployees = async () => {
    try {
        const response = await api.get('/empleados');
        return response.data.data || response.data || [];
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        throw error;
    }
};

export const createEmployee = async (employeeData) => {
    try {
        const response = await api.post('/empleados', employeeData);
        return response.data;
    } catch (error) {
        console.error('Error al crear empleado:', error);
        throw error;
    }
};

export const updateEmployee = async (id, employeeData) => {
    try {
        const response = await api.put(`/empleados/${id}`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        throw error;
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await api.delete(`/empleados/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        throw error;
    }
};

export const deactivateEmployee = async (id) => {
    try {
        const response = await api.put(`/empleados/${id}/desactivar`);
        return response.data;
    } catch (error) {
        console.error('Error al desactivar empleado:', error);
        throw error;
    }
};