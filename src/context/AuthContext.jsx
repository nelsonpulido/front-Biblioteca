import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
import axios from 'axios';

const AuthContext = createContext();

// Configuración segura de axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Función para validar token
  const validateToken = useCallback(async (authToken) => {
    try {
      const response = await api.get('/validate-token', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      return response.data.valid;
    } catch (error) {
      console.error('❌ Token inválido:', error);
      return false;
    }
  }, []);

  // Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        // Validar token antes de restaurar sesión
        const isValid = await validateToken(savedToken);
        
        if (isValid) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          console.log('✅ Sesión restaurada desde localStorage');
        } else {
          // Token inválido, limpiar storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setSessionExpired(true);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [validateToken]);

  // Interceptor para agregar token a peticiones
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores de autenticación
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('⚠️ Sesión expirada');
          logout();
          setSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Renovar token automáticamente
  useEffect(() => {
    if (!token) return;

    const renewInterval = setInterval(async () => {
      try {
        const response = await api.post('/refresh-token');
        const { token: newToken } = response.data;
        
        setToken(newToken);
        localStorage.setItem('token', newToken);
        console.log('🔄 Token renovado');
      } catch (error) {
        console.error('❌ Error renovando token:', error);
        logout();
      }
    }, 15 * 60 * 1000); // Renovar cada 15 minutos

    return () => clearInterval(renewInterval);
  }, [token]);

  /**
   * Login: Autenticación segura
   */
  const login = async (email, password) => {
    try {
      // Validación básica
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      console.log('🔐 Intentando login...');

      const response = await api.post('/login', {
        email: email.trim().toLowerCase(),
        password
      });

      const { token: authToken, user: userData, tipo_usuario } = response.data;

      // Validaciones de seguridad
      if (!authToken || !userData || !tipo_usuario) {
        throw new Error('Respuesta del servidor incompleta');
      }

      // Guardar datos de forma segura
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setSessionExpired(false);

      console.log('✅ Login exitoso:', tipo_usuario);

      return tipo_usuario.toLowerCase();

    } catch (error) {
      console.error('❌ Error en login:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Demasiados intentos. Espera unos minutos.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas');
      }
      
      throw new Error('Error al iniciar sesión. Intenta nuevamente.');
    }
  };

  /**
   * Logout: Limpia la sesión de forma segura
   */
  const logout = useCallback(async () => {
    try {
      // Notificar al servidor para invalidar el token
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('⚠️ Error al cerrar sesión en servidor:', error);
    } finally {
      // Limpiar estado y storage
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('👋 Sesión cerrada');
    }
  }, [token]);

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    return user.tipo_usuario?.toLowerCase() === requiredRole.toLowerCase();
  }, [user]);

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  const hasAnyRole = useCallback((roles) => {
    if (!user) return false;
    return roles.some(role => 
      user.tipo_usuario?.toLowerCase() === role.toLowerCase()
    );
  }, [user]);

  const value = {
    user,
    token,
    loading,
    sessionExpired,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;