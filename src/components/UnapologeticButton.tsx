import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface ButtonProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export const UnapologeticButton = ({ 
  children, 
  className = '', 
  bgColor = 'bg-yellow-300', 
  ...props 
}: ButtonProps) => {
  return (
    <Link
      {...props}
      className={`inline-block px-8 py-3 border-2 border-black bg-transparent text-black font-bold relative group transition duration-200 ${className}`}
    >
      <div 
        className={`absolute -bottom-2 -right-2 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200 ${bgColor}`} 
      />
      <span className="relative">{children}</span>
    </Link>
  );
};