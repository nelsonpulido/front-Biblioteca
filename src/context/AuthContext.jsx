import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Cargar usuario y token desde localStorage al iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      console.log('✅ Sesión restaurada desde localStorage');
    }
  }, []);

  /**
   * Login: hace la petición al backend y guarda los datos
   * Retorna el tipo de usuario si es exitoso, o null si falla
   */
  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', email);

      // Petición al backend
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });

      console.log('✅ Respuesta del servidor:', response.user);

      // Extraer datos
      const { token: authToken, user: userData, tipo_usuario } = response.data;

      // Guardar en el estado y localStorage
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Token guardado:', authToken);
      console.log('✅ Usuario guardado:', userData);
      console.log('✅ Tipo de usuario:', tipo_usuario);

      // Retornar el tipo de usuario para que Login.jsx pueda redirigir
      return tipo_usuario;

    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('Detalles:', error.response?.data);

      // Si hay error, retornar null
      return null;
    }
  };

  /**
   * Logout: limpia la sesión
   */
  const logout = () => {
    console.log('👋 Cerrando sesión...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validación de props
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
