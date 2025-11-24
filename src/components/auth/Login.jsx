import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import "../../services/style/login.css"

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError("Credenciales incorrectas o error en el servidor");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-group">
          <label>Ingrese correo electrónico</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ingrese la contraseña</label>
          <input      
            type="password"
            placeholder="•••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;