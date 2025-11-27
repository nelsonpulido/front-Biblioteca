import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const dataToSend = {
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password,
      tipo_usuario: userData.rol,
      activo: 1
    };
    
    const response = await api.post('/usuarios', dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const dataToSend = {
      nombre: userData.nombre,
      email: userData.email,
      tipo_usuario: userData.rol
    };
    
    if (userData.password && userData.password.trim() !== '') {
      dataToSend.password = userData.password;
    }
    
    const response = await api.put(`/usuarios/${userId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};