import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-flow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
