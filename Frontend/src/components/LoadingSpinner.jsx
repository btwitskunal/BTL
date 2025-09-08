import React from 'react';

const LoadingSpinner = ({ size = 24, color = '#3b82f6', text = 'Loading...' }) => {
  const spinnerStyle = {
    display: 'inline-block',
    width: size,
    height: size,
    border: `3px solid #f3f3f3`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  const textStyle = {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {text && <p style={textStyle}>{text}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 