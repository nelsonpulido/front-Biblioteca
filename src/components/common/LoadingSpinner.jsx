
// ==========================================
// src/components/common/LoadingSpinner.jsx
// ==========================================

export function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        color: '#64748b',
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string
};