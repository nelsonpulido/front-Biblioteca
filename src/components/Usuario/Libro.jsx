import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../services/style/Login.css";

function Login() {
  const { Login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(""); // 🔥 Nuevo estado
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoUsuario) {
      setErrorMsg("Selecciona tu tipo de usuario");
      return;
    }

    const tipo = await Login(email, password);

    console.log("TipoRecibido:", tipo);

    if (!tipo) {
      setErrorMsg("Credenciales incorrectas");
      return;
    }

    // 🔥 Validación para evitar entrar a un rol diferente
    if (tipo !== tipoUsuario.toLowerCase()) {
      setErrorMsg("El tipo de usuario no coincide con tu cuenta");
      return;
    }

    if (tipo === "admin") navigate("/admin");
    if (tipo === "bibliotecario") navigate("/bibliotecario");
    if (tipo === "usuario") navigate("/usuario");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🔥 Campo nuevo: seleccionar tipo */}
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
          >
            <option value="">Selecciona tipo de usuario</option>
            <option value="admin">Administrador</option>
            <option value="bibliotecario">Bibliotecario</option>
            <option value="usuario">Usuario</option>
          </select>

          <button type="submit">Entrar</button>
        </form>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <p style={{ marginTop: "15px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" style={{ color: "blue" }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;