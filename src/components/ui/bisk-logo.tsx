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
        <img 
          src="/lovable-uploads/db0412b3-3f7b-4463-b4ec-8d8b39d6709e.png"
          alt="Bisk"
          className="h-8 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/db0412b3-3f7b-4463-b4ec-8d8b39d6709e.png"
        alt="Bisk"
        className="h-8 w-auto object-contain"
      />
    </div>
  );
};