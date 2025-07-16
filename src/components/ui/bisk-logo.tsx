import React from 'react';

interface BiskLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const BiskLogo: React.FC<BiskLogoProps> = ({ 
  className = "", 
  variant = 'full' 
}) => {
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-accent border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">B</span>
          <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-accent border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
        </div>
      </div>
      <span className="text-xl font-bold text-primary tracking-wide">BISK</span>
    </div>
  );
};