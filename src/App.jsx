// src/App.jsx - Configuración de Rutas Mejorada con Seguridad

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Componentes de autenticación
import Login from "./components/auth/Login.jsx";
import Registro from "./components/auth/Registro.jsx";
import RutaProtegida from "./components/auth/RutaProtegida.jsx";

// Componentes de Usuario
import ULibro from "./components/Usuario/Libro.jsx";
import UAutor from "./components/Usuario/Autor.jsx";
import UCategoria from "./components/Usuario/Categoria.jsx";
import UPrestamo from "./components/Usuario/Prestamo.jsx";

// Componentes de Admin
import Admin from "./components/Admin/Admin.jsx";

// Componentes de Bibliotecario
import Bibliotecario from "./components/Bibliotecario/Bibliotecario.jsx";

// Componente 404
import NotFound from "./components/common/NotFound.jsx";

// Componente de layout para rutas protegidas
import ProtectedLayout from "./components/layouts/ProtectedLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ==========================================
              RUTAS PÚBLICAS
          ========================================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Redirección de raíz a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ==========================================
              RUTAS ADMIN (tipo_usuario = 'admin')
          ========================================== */}
          <Route
            path="/admin/*"
            element={
              <RutaProtegida role="admin">
                <ProtectedLayout role="admin">
                  <Routes>
                    <Route index element={<Admin />} />
                    <Route path="usuarios" element={<Admin />} />
                    <Route path="libros" element={<Admin />} />
                    <Route path="prestamos" element={<Admin />} />
                    <Route path="empleados" element={<Admin />} />
                    <Route path="reportes" element={<Admin />} />
                    <Route path="configuracion" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedLayout>
              </RutaProtegida>
            }
          />

          {/* ==========================================
              RUTAS BIBLIOTECARIO
          ========================================== */}
          <Route
            path="/bibliotecario/*"
            element={
              <RutaProtegida role="bibliotecario">
                <ProtectedLayout role="bibliotecario">
                  <Routes>
                    <Route index element={<Bibliotecario />} />
                    <Route path="prestamos" element={<Bibliotecario />} />
                    <Route path="devoluciones" element={<Bibliotecario />} />
                    <Route path="inventario" element={<Bibliotecario />} />
                    <Route path="usuarios" element={<Bibliotecario />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedLayout>
              </RutaProtegida>
            }
          />

          {/* ==========================================
              RUTAS USUARIO
          ========================================== */}
          <Route
            path="/usuario/*"
            element={
              <RutaProtegida role="usuario">
                <ProtectedLayout role="usuario">
                  <Routes>
                    <Route index element={<Navigate to="/usuario/catalogo" replace />} />
                    <Route path="catalogo" element={<ULibro />} />
                    <Route path="autores" element={<UAutor />} />
                    <Route path="categorias" element={<UCategoria />} />
                    <Route path="prestamos" element={<UPrestamo />} />
                    <Route path="perfil" element={<ULibro />} /> {/* Crear componente Perfil */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedLayout>
              </RutaProtegida>
            }
          />

          {/* ==========================================
              RUTA 404 - NO ENCONTRADO
          ========================================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


// ==========================================
// CONFIGURACIÓN DE ROLES Y PERMISOS
// ==========================================

export const ROLES = {
  ADMIN: 'admin',
  BIBLIOTECARIO: 'bibliotecario',
  USUARIO: 'usuario'
};

export const PERMISSIONS = {
  // Permisos de Admin
  [ROLES.ADMIN]: [
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'employees.view',
    'employees.create',
    'employees.update',
    'employees.delete',
    'books.view',
    'books.create',
    'books.update',
    'books.delete',
    'loans.view',
    'loans.create',
    'loans.update',
    'loans.delete',
    'reports.view',
    'reports.generate',
    'settings.manage'
  ],
  
  // Permisos de Bibliotecario
  [ROLES.BIBLIOTECARIO]: [
    'books.view',
    'books.update',
    'loans.view',
    'loans.create',
    'loans.update',
    'users.view',
    'reports.view'
  ],
  
  // Permisos de Usuario
  [ROLES.USUARIO]: [
    'books.view',
    'authors.view',
    'categories.view',
    'loans.view_own'
  ]
};

/**
 * Verificar si un rol tiene un permiso específico
 */
export function hasPermission(role, permission) {
  return PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Obtener todos los permisos de un rol
 */
export function getRolePermissions(role) {
  return PERMISSIONS[role] || [];
}

/**
 * Verificar si un rol puede acceder a una ruta
 */
export function canAccessRoute(role, route) {
  const routePermissions = {
    '/admin': [ROLES.ADMIN],
    '/bibliotecario': [ROLES.BIBLIOTECARIO],
    '/usuario': [ROLES.USUARIO]
  };

  for (const [path, allowedRoles] of Object.entries(routePermissions)) {
    if (route.startsWith(path)) {
      return allowedRoles.includes(role);
    }
  }

  return false;
}