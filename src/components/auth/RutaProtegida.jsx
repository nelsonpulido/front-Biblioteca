// src/components/auth/RutaProtegida.jsx - Protección de Rutas Mejorada

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";

/**
 * Componente para proteger rutas basado en autenticación y roles
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar si está autorizado
 * @param {string|string[]} props.role - Rol(es) requerido(s) para acceder
 * @param {string} props.redirectTo - Ruta de redirección si no está autorizado
 * @param {boolean} props.requireAuth - Si requiere autenticación (default: true)
 */
function RutaProtegida({ 
    children, 
    role, 
    roles = [], 
    redirectTo = "/login",
    requireAuth = true 
}) {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p style={{ color: '#333', fontWeight: 600 }}>Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Verificar autenticación
    if (requireAuth && !isAuthenticated) {
        console.warn('⚠️ Usuario no autenticado, redirigiendo a login');
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Si no requiere rol específico, mostrar contenido
    if (!role && roles.length === 0) {
        return children;
    }

    // Normalizar roles para comparación
    const allowedRoles = [];
    if (role) {
        allowedRoles.push(role.toLowerCase());
    }
    if (roles.length > 0) {
        allowedRoles.push(...roles.map(r => r.toLowerCase()));
    }

    const userRole = user?.tipo_usuario?.toLowerCase();

    // Verificar si el usuario tiene el rol requerido
    if (!allowedRoles.includes(userRole)) {
        console.warn('🚫 Acceso denegado. Rol requerido:', allowedRoles, 'Rol del usuario:', userRole);
        
        // Redirigir según el rol del usuario
        const redirectPath = getRoleRedirectPath(userRole);
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Usuario autorizado, mostrar contenido
    return children;
}

/**
 * Obtener la ruta de redirección según el rol del usuario
 */
function getRoleRedirectPath(role) {
    const roleRoutes = {
        'admin': '/admin',
        'bibliotecario': '/bibliotecario',
        'usuario': '/usuario/catalogo'
    };

    return roleRoutes[role] || '/login';
}

RutaProtegida.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    redirectTo: PropTypes.string,
    requireAuth: PropTypes.bool
};

export default RutaProtegida;


// ==========================================
// COMPONENTE ADICIONAL: VerificadorRol
// ==========================================

/**
 * Componente para renderizar contenido condicionalmente según el rol
 * Útil para mostrar/ocultar elementos dentro de una página
 */
export function VerificadorRol({ children, role, roles = [], fallback = null }) {
    const { user } = useAuth();

    const allowedRoles = [];
    if (role) allowedRoles.push(role.toLowerCase());
    if (roles.length > 0) allowedRoles.push(...roles.map(r => r.toLowerCase()));

    const userRole = user?.tipo_usuario?.toLowerCase();

    if (allowedRoles.includes(userRole)) {
        return children;
    }

    return fallback;
}

VerificadorRol.propTypes = {
    children: PropTypes.node.isRequired,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    fallback: PropTypes.node
};


// ==========================================
// HOOK PERSONALIZADO: useRoleAccess
// ==========================================

/**
 * Hook para verificar permisos de acceso basados en roles
 */
export function useRoleAccess() {
    const { user } = useAuth();

    const hasRole = (role) => {
        if (!user) return false;
        return user.tipo_usuario?.toLowerCase() === role.toLowerCase();
    };

    const hasAnyRole = (roles) => {
        if (!user || !Array.isArray(roles)) return false;
        return roles.some(role => 
            user.tipo_usuario?.toLowerCase() === role.toLowerCase()
        );
    };

    const hasAllRoles = (roles) => {
        if (!user || !Array.isArray(roles)) return false;
        return roles.every(role => 
            user.tipo_usuario?.toLowerCase() === role.toLowerCase()
        );
    };

    return {
        hasRole,
        hasAnyRole,
        hasAllRoles,
        userRole: user?.tipo_usuario?.toLowerCase(),
        isAdmin: hasRole('admin'),
        isBibliotecario: hasRole('bibliotecario'),
        isUsuario: hasRole('usuario')
    };
}


// ==========================================
// ESTILOS PARA LOADING (Agregar a CSS global)
// ==========================================

/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/