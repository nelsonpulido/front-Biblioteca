import axios from 'axios';

// Configuración base de axios
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


/* ==========================================================
                    RUTAS DEL LOGIN
========================================================== */
export const login = (data) => api.post('/login', data);
export const registrar = (data) => api.post('/registro', data);


/* ==========================================================
                    RUTAS ADMIN (ROLE: admin)
========================================================== */
export const adminGetUsuarios = () => api.get('/admin/usuarios');
export const adminGetLibros = () => api.get('/admin/libros');
export const adminGetPrestamos = () => api.get('/admin/prestamos');
export const adminGetEmpleados = () => api.get('/admin/empleados');


/* ==========================================================
                RUTAS BIBLIOTECARIO (ROLE: bibliotecario)
========================================================== */
export const bibliotecarioGetDashboard = () => api.get('/bibliotecario/dashboard');


/* ==========================================================
                    RUTAS USUARIO (ROLE: usuario)
========================================================== */
export const usuarioCatalogo = () => api.get('/usuario/catalogo');
export const usuarioAutores = () => api.get('/usuario/autores');
export const usuarioCategorias = () => api.get('/usuario/categorias');
export const usuarioPrestamos = () => api.get('/usuario/prestamos');


export default api;
