
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, title, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-soft p-6 border border-slate-100 transition-all hover:shadow-md ${className} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
