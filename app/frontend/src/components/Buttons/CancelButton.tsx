//components/Buttons/CancelButton.jsx

import React from "react";
import { ButtonHTMLAttributes } from "react";

/**
 * CancelButton Component
 *
 * A reusable button component with secondary styling.
 * This is typically used for secondary actions such as cancel.
 *
 * @component
 */

interface CancelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'purple' | 'gray' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const CancelButton: React.FC<CancelButtonProps> = ({ 
  children, 
  className = "", 
  variant = 'purple',
  size = 'md',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 w-full";
  
  const variantClasses = {
    purple: "text-white bg-purple-500 border border-purple-600 hover:bg-purple-600 focus:ring-purple-400",
    gray: "text-gray-700 bg-gray-200 border border-gray-300 hover:bg-gray-300 focus:ring-gray-400",
    outline: "text-purple-600 bg-white border border-purple-600 hover:bg-purple-50 focus:ring-purple-400"
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

export default CancelButton;
