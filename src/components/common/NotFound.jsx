// ==========================================
// src/components/common/NotFound.jsx
// ==========================================

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const roleRoutes = {
      'admin': '/admin',
      'bibliotecario': '/bibliotecario',
      'usuario': '/usuario/catalogo'
    };

    const redirectPath = roleRoutes[user.tipo_usuario?.toLowerCase()] || '/login';
    navigate(redirectPath);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          fontSize: '120px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          404
        </div>
        
        <h2 style={{
          fontSize: '1.75rem',
          color: '#333',
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Página No Encontrada
        </h2>
        
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Lo sentimos, la página que buscas no existe o no tienes permisos para acceder a ella.
        </p>
        
        <button
          onClick={handleGoHome}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🏠 Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default NotFound;








