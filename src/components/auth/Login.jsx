import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../services/style/Login.css";

function Login() {
  const { login } = useAuth(); // ← Mantenido en minúscula
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Función de validación básica
  const validateForm = () => {
    if (!email.trim()) {
      setErrorMsg("El correo es obligatorio.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("Ingresa un correo válido.");
      return false;
    }
    if (!password.trim()) {
      setErrorMsg("La contraseña es obligatoria.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiar errores previos

    if (!validateForm()) return;

    setLoading(true);
    try {
      const Tipo = await login(email, password); // ← Mantenido en minúscula

      console.log("TipoRecibido:", Tipo);

      if (!Tipo) {
        setErrorMsg("Credenciales incorrectas. Verifica tu email y contraseña.");
        return;
      }

      if (Tipo === "admin") navigate("/admin");
      else if (Tipo === "bibliotecario") navigate("/bibliotecario");
      else if (Tipo === "usuario") navigate("/usuario");
    } catch (error) {
      setErrorMsg("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensaje de error después de 5 segundos
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Correo electrónico"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Contraseña"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/registro">Regístrate aquí</Link>
        </p>

        <p>
          <Link to="/forgot-password" style={{ color: "#4b7bec" }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;