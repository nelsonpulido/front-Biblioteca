import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [TipoUsuario, setTipoUsuario] = useState(null);

  const location = useLocation();

  const Login = async (email, password) => {
    try {
      const response = await api.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data?.user) {
        setUser(response.data.user);
        setTipoUsuario(response.data.user.TipoUsuario);
        return response.data.user.TipoUsuario;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      setUser(null);
      setTipoUsuario(null);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await api.get("/user", { withCredentials: true });
      setUser(response.data.user);
      setTipoUsuario(response.data.user.TipoUsuario);
    } catch (error) {
      setUser(null);
      setTipoUsuario(null);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, TipoUsuario, Login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
