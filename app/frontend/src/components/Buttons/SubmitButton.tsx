//components/Buttons/SubmitButton.jsx

import React from "react";
import { ButtonHTMLAttributes } from "react";

/**
 * SubmitButton Component
 *
 * A reusable button component with primary styling.
 * This is typically used for submit or primary actions in forms.
 *
 * @component
 */

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  children, 
  className = "", 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full";
  
  const variantClasses = {
    primary: "text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    danger: "text-white bg-red-600 border border-red-700 hover:bg-red-700 focus:ring-red-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
