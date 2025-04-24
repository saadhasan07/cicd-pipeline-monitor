import React from 'react';

type PulsingAnimationProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  color?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
};

export default function PulsingAnimation({
  children,
  className = "",
  delay = 0,
  duration = 3,
  color = 'primary',
  size = 'md'
}: PulsingAnimationProps) {
  
  const getSize = () => {
    switch (size) {
      case 'sm': return 'scale(1.05)';
      case 'md': return 'scale(1.1)';
      case 'lg': return 'scale(1.15)';
      default: return 'scale(1.1)';
    }
  };
  
  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'hsl(var(--primary))';
      case 'secondary': return 'hsl(var(--secondary))';
      case 'accent': return 'hsl(var(--accent))';
      default: return 'hsl(var(--primary))';
    }
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ animation: `pulse ${duration}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      {/* The main content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated shadow/glow */}
      <div 
        className="absolute inset-0 rounded-md opacity-0 z-0"
        style={{
          animation: `pulseShadow ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          boxShadow: `0 0 10px 5px ${getColorClass()}30`,
          backgroundColor: `${getColorClass()}05`,
        }}
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: ${getSize()}; }
          }
          
          @keyframes pulseShadow {
            0%, 100% { opacity: 0; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `
      }} />
    </div>
  );
}