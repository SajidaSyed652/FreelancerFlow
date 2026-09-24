import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, onClick, glowing = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl border border-white/[0.09] bg-white/[0.035] backdrop-blur-xl p-6
        ${hover ? 'hover:bg-white/[0.06] hover:border-purple-500/40 hover:shadow-glow-purple transition-all duration-300' : ''}
        ${glowing ? 'border-purple-500/50 shadow-glow-purple' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
