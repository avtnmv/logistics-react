import React from 'react';

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({ isVisible, onToggle, className = '' }) => {
  return (
    <button
      type="button"
      className={`password-toggle ${className}`}
      onClick={onToggle}
      aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
    >
      <svg 
        className={`eye-icon ${isVisible ? '' : 'eye-off-icon'}`} 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {isVisible ? (
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
    </button>
  );
};

export default PasswordToggle;
