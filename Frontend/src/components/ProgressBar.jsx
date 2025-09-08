import React from 'react';

const ProgressBar = ({ progress = 0, text = '', showPercentage = true }) => {
  const containerStyle = {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '8px 0',
  };

  const progressStyle = {
    height: '8px',
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    transition: 'width 0.3s ease',
    width: `${Math.min(progress, 100)}%`,
  };

  const textStyle = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
    textAlign: 'center',
  };

  return (
    <div>
      <div style={containerStyle}>
        <div style={progressStyle}></div>
      </div>
      {(text || showPercentage) && (
        <p style={textStyle}>
          {text} {showPercentage && `${Math.round(progress)}%`}
        </p>
      )}
    </div>
  );
};

export default ProgressBar; 