// ==========================================
// src/components/layouts/ProtectedLayout.jsx
// ==========================================

import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

function ProtectedLayout({ children, role }) {
  const { user } = useAuth();

  // Verificar que el usuario tenga el rol correcto
  if (user?.tipo_usuario?.toLowerCase() !== role.toLowerCase()) {
    return null; // La RutaProtegida ya redirige, esto es una capa extra
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9'
    }}>
      {/* Header opcional común para todas las vistas protegidas */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.5rem 1rem',
        display: 'none' // Oculto por ahora, puedes activarlo
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            Usuario: <strong>{user?.nombre}</strong> ({role})
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main>{children}</main>
    </div>
  );
}

ProtectedLayout.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string.isRequired
};

export default ProtectedLayout;