import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, onClick, glowing = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-3xl p-6 relative overflow-hidden
        ${hover ? 'hover:shadow-lg' : ''}
        ${glowing ? 'ring-2 ring-[#9B83BD]/30' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
