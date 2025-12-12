// src/services/api.js - Servicio API Mejorado con Seguridad

import axios from 'axios';

// ==========================================
// CONFIGURACIÓN SEGURA
// ==========================================

const API_BASE_URL = 'http://localhost:8000/api';
const API_TIMEOUT = 10000; // 10 segundos
const MAX_RETRIES = 3;

// Configuración base de axios con seguridad
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Protección CSRF básica
    },
    withCredentials: false // Cambiar a true si usas cookies
});

// ==========================================
// GESTIÓN DE TOKENS
// ==========================================

class TokenManager {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        }
    }

    static removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    static isTokenExpired(token) {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() >= exp;
        } catch (error) {
            return true;
        }
    }
}

// ==========================================
// INTERCEPTORES DE SEGURIDAD
// ==========================================

// Request Interceptor - Agregar token y headers de seguridad
api.interceptors.request.use(
    (config) => {
        const token = TokenManager.getToken();
        
        // Agregar token si existe
        if (token) {
            // Verificar si el token está expirado
            if (TokenManager.isTokenExpired(token)) {
                TokenManager.removeToken();
                window.location.href = '/login';
                return Promise.reject(new Error('Token expirado'));
            }
            
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar timestamp para prevenir cache
        config.params = {
            ...config.params,
            _t: Date.now()
        };

        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        
        return config;
    },
    (error) => {
        console.error('❌ Error en request:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Manejo de errores y renovación de token
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
        
        // Si el backend envía un nuevo token, actualizarlo
        const newToken = response.headers['x-new-token'];
        if (newToken) {
            TokenManager.setToken(newToken);
        }
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Manejo de diferentes códigos de error
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Token inválido o expirado
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;
                        
                        // Intentar renovar token
                        try {
                            const refreshResponse = await axios.post(
                                `${API_BASE_URL}/refresh-token`,
                                {},
                                {
                                    headers: {
                                        Authorization: `Bearer ${TokenManager.getToken()}`
                                    }
                                }
                            );

                            const { token: newToken } = refreshResponse.data;
                            TokenManager.setToken(newToken);
                            
                            // Reintentar petición original
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return api(originalRequest);
                        } catch (refreshError) {
                            // Si falla la renovación, cerrar sesión
                            TokenManager.removeToken();
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    }
                    
                    // Si ya se intentó renovar, cerrar sesión
                    TokenManager.removeToken();
                    window.location.href = '/login';
                    break;

                case 403:
                    console.error('🚫 Acceso prohibido');
                    break;

                case 404:
                    console.error('🔍 Recurso no encontrado');
                    break;

                case 429:
                    console.error('⚠️ Demasiadas peticiones');
                    break;

                case 500:
                case 502:
                case 503:
                    console.error('⚙️ Error del servidor');
                    break;

                default:
                    console.error(`❌ Error ${status}:`, data?.message || error.message);
            }
        } else if (error.request) {
            console.error('🌐 Sin respuesta del servidor');
        } else {
            console.error('❌ Error:', error.message);
        }

        return Promise.reject(error);
    }
);

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

export const authAPI = {
    login: async (email, password) => {
        try {
            const response = await api.post('/login', {
                email: email.trim().toLowerCase(),
                password
            });
            
            const { token, user, tipo_usuario } = response.data;
            
            if (!token || !user) {
                throw new Error('Respuesta inválida del servidor');
            }
            
            TokenManager.setToken(token);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { token, user, tipo_usuario };
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/registrar', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.warn('Error al cerrar sesión en servidor:', error);
        } finally {
            TokenManager.removeToken();
        }
    },

    validateToken: async () => {
        try {
            const response = await api.get('/validate-token');
            return response.data.valid;
        } catch (error) {
            return false;
        }
    },

    refreshToken: async () => {
        try {
            const response = await api.post('/refresh-token');
            const { token } = response.data;
            TokenManager.setToken(token);
            return token;
        } catch (error) {
            throw error;
        }
    }
};

// ==========================================
// FUNCIONES CRUD GENÉRICAS SEGURAS
// ==========================================

const createCRUDService = (endpoint) => ({
    getAll: async (params = {}) => {
        try {
            const response = await api.get(endpoint, { params });
            return response.data.data || response.data || [];
        } catch (error) {
            console.error(`Error en getAll ${endpoint}:`, error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`${endpoint}/${id}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error(`Error en getById ${endpoint}/${id}:`, error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await api.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`Error en create ${endpoint}:`, error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`${endpoint}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error en update ${endpoint}/${id}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error en delete ${endpoint}/${id}:`, error);
            throw error;
        }
    }
});

// ==========================================
// SERVICIOS POR ENTIDAD
// ==========================================

export const userService = {
    ...createCRUDService('/usuarios'),
    
    getByRole: async (role) => {
        try {
            const response = await api.get('/usuarios', {
                params: { tipo_usuario: role }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        try {
            const response = await api.post(`/usuarios/${userId}/change-password`, {
                old_password: oldPassword,
                new_password: newPassword
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const employeeService = createCRUDService('/empleados');
export const bookService = createCRUDService('/libros');
export const authorService = createCRUDService('/autores');
export const editorialService = createCRUDService('/editoriales');
export const categoryService = createCRUDService('/categorias');

export const loanService = {
    ...createCRUDService('/prestamos'),
    
    getByUser: async (userId) => {
        try {
            const response = await api.get(`/prestamos/usuario/${userId}`);
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    },

    getActive: async () => {
        try {
            const response = await api.get('/prestamos', {
                params: { estado: 'activo' }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    },

    return: async (loanId) => {
        try {
            const response = await api.post(`/prestamos/${loanId}/devolver`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// ==========================================
// SERVICIO DE ESTADÍSTICAS Y REPORTES
// ==========================================

export const dashboardService = {
    getStatistics: async () => {
        try {
            const response = await api.get('/statistics');
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                activeUsers: 0,
                borrowedBooks: 0,
                pendingAlerts: 0,
                totalBooks: 0,
                totalAuthors: 0
            };
        }
    },

    getRecentActivity: async (limit = 10) => {
        try {
            const response = await api.get('/recent-activity', {
                params: { limit }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    },

    getPopularBooks: async (limit = 10) => {
        try {
            const response = await api.get('/popular-books', {
                params: { limit }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    },

    getReports: async (type = 'monthly') => {
        try {
            const response = await api.get('/reports', {
                params: { type }
            });
            return response.data.data || response.data || [];
        } catch (error) {
            throw error;
        }
    }
};

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

export const apiUtils = {
    // Realizar múltiples peticiones en paralelo
    parallel: async (requests) => {
        try {
            return await Promise.all(requests);
        } catch (error) {
            throw error;
        }
    },

    // Reintentar petición con backoff exponencial
    retryWithBackoff: async (fn, maxRetries = MAX_RETRIES) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                
                const delay = Math.pow(2, i) * 1000;
                console.log(`⏳ Reintentando en ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    },

    // Sanitizar input del usuario
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
    },

    // Validar email
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar contraseña segura
    isStrongPassword: (password) => {
        // Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }
};

export default api;