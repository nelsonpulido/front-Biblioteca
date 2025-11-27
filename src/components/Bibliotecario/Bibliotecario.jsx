import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";


function Bibliotecario() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Bibliotecario</h2>
        <ul>
          <li>Préstamos</li>
          <li>Devoluciones</li>
          <li>Inventario</li>
          <li>Usuarios</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Hola, {user?.nombre || "Bibliotecario"}</h1>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </header>

        <div className="card-grid">
          <div className="card">
            <h3>Libros Disponibles</h3>
            <p>320</p>
          </div>

          <div className="card">
            <h3>Préstamos Activos</h3>
            <p>74</p>
          </div>

          <div className="card">
            <h3>Morosos</h3>
            <p>12 usuarios</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bibliotecario;


