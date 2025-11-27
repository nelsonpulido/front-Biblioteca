import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Login
import Login from "./components/auth/Login.jsx";
import Registro from "./components/auth/Registro.jsx";

import RutaProtegida from "./components/auth/RutaProtegida.jsx";

// Usuario
import ULibro from "./components/Usuario/Libro.jsx";
import UAutor from "./components/Usuario/Autor.jsx";
import UCategoria from "./components/Usuario/Categoria.jsx";
import UPrestamo from "./components/Usuario/Prestamo.jsx";

// Admin
import Admin from "./components/Admin/Admin.jsx";
import Usuario from "./components/Admin/Usuario.jsx";
import Libro from "./components/Admin/Libro.jsx";
import Prestamo from "./components/Admin/Prestamo.jsx";
import Empleados from "./components/Admin/Empleados.jsx";

// Bibliotecario
import Bibliotecario from "./components/Bibliotecario/Bibliotecario.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* ADMIN (tipo_usuario = 'admin') */}
          <Route
            path="/admin"
            element={<RutaProtegida role="admin"><Admin /></RutaProtegida>}
          />
          <Route
            path="/admin/usuarios"
            element={<RutaProtegida role="admin"><Usuario /></RutaProtegida>}
          />
          <Route
            path="/admin/libros"
            element={<RutaProtegida role="admin"><Libro /></RutaProtegida>}
          />
          <Route
            path="/admin/prestamos"
            element={<RutaProtegida role="admin"><Prestamo /></RutaProtegida>}
          />
          <Route
            path="/admin/empleados"
            element={<RutaProtegida role="admin"><Empleados /></RutaProtegida>}
          />

          {/* BIBLIOTECARIO */}
          <Route
            path="/bibliotecario"
            element={<RutaProtegida role="bibliotecario"><Bibliotecario /></RutaProtegida>}
          />

          {/* USUARIO */}
          <Route
            path="/usuario/catalogo"
            element={<RutaProtegida role="usuario"><ULibro /></RutaProtegida>}
          />
          <Route
            path="/usuario/autores"
            element={<RutaProtegida role="usuario"><UAutor /></RutaProtegida>}
          />
          <Route
            path="/usuario/categorias"
            element={<RutaProtegida role="usuario"><UCategoria /></RutaProtegida>}
          />
          <Route
            path="/usuario/prestamos"
            element={<RutaProtegida role="usuario"><UPrestamo /></RutaProtegida>}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
