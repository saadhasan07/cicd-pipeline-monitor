import React, { useEffect, useRef } from 'react';

export default function AnimatedCICDLogo({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size first - smaller for header logo
    canvas.width = 120;  
    canvas.height = 120; 
    
    // Animation variables
    let angle = 0;
    
    // Colors as requested
    const skyBlue = '#1E88E5';
    const skyBlueLight = '#64B5F6';
    const orangeColor = '#FF7043';
    
    // Animation frame function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.2;
      
      // Draw infinity symbol (figure 8) with sky blue color
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Left loop (CI)
      ctx.beginPath();
      ctx.strokeStyle = skyBlue;
      ctx.shadowColor = skyBlueLight;
      ctx.shadowBlur = 5;
      
      for (let i = 0; i <= Math.PI * 2; i += 0.1) {
        const x = centerX - radius * 1.1 + Math.cos(i - Math.PI / 2 + angle) * radius;
        const y = centerY + Math.sin(i - Math.PI / 2 + angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Right loop (CD)
      ctx.beginPath();
      ctx.strokeStyle = skyBlueLight;
      ctx.shadowColor = skyBlue;
      ctx.shadowBlur = 5;
      
      for (let i = 0; i <= Math.PI * 2; i += 0.1) {
        const x = centerX + radius * 1.1 + Math.cos(i + Math.PI / 2 + angle) * radius;
        const y = centerY + Math.sin(i + Math.PI / 2 + angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Connection between loops (infinity shape)
      ctx.beginPath();
      ctx.strokeStyle = skyBlue;
      
      // Top connection
      ctx.moveTo(
        centerX - radius * 1.1 + Math.cos(-Math.PI / 2 + angle) * radius, 
        centerY + Math.sin(-Math.PI / 2 + angle) * radius
      );
      ctx.bezierCurveTo(
        centerX - radius * 0.5, centerY - radius * 0.7,
        centerX + radius * 0.5, centerY - radius * 0.7,
        centerX + radius * 1.1 + Math.cos(Math.PI / 2 + angle) * radius,
        centerY + Math.sin(Math.PI / 2 + angle) * radius
      );
      
      // Bottom connection
      ctx.moveTo(
        centerX - radius * 1.1 + Math.cos(Math.PI * 1.5 + angle) * radius, 
        centerY + Math.sin(Math.PI * 1.5 + angle) * radius
      );
      ctx.bezierCurveTo(
        centerX - radius * 0.5, centerY + radius * 0.7,
        centerX + radius * 0.5, centerY + radius * 0.7,
        centerX + radius * 1.1 + Math.cos(Math.PI * 2.5 + angle) * radius,
        centerY + Math.sin(Math.PI * 2.5 + angle) * radius
      );
      
      ctx.stroke();
      
      // Draw atoms (electrons) orbiting in orange
      const atomCount = 6; 
      const atomOffset = Math.PI * 2 / atomCount;
      
      for (let i = 0; i < atomCount; i++) {
        // Calculate position on the infinity path
        const pathPos = i * atomOffset + angle * 3;
        
        let x, y;
        
        // Determine if atom is on left or right loop
        if (pathPos % (Math.PI * 4) < Math.PI * 2) {
          // Left loop (CI)
          const loopAngle = pathPos % (Math.PI * 2) - Math.PI / 2;
          x = centerX - radius * 1.1 + Math.cos(loopAngle + angle) * radius;
          y = centerY + Math.sin(loopAngle + angle) * radius;
        } else {
          // Right loop (CD)
          const loopAngle = (pathPos % (Math.PI * 2)) + Math.PI / 2;
          x = centerX + radius * 1.1 + Math.cos(loopAngle + angle) * radius;
          y = centerY + Math.sin(loopAngle + angle) * radius;
        }
        
        // Draw atom center
        ctx.beginPath();
        ctx.fillStyle = orangeColor;
        ctx.shadowColor = orangeColor;
        ctx.shadowBlur = 8;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw orbiting electrons
        for (let j = 0; j < 2; j++) {
          const electronAngle = angle * 8 + i * Math.PI + j * Math.PI;
          const electronDistance = 6;
          const electronX = x + Math.cos(electronAngle) * electronDistance;
          const electronY = y + Math.sin(electronAngle) * electronDistance;
          
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 112, 67, 0.7)'; // Semi-transparent orange
          ctx.arc(electronX, electronY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw pulsing glow
        const pulseSize = (Math.sin(angle * 5 + i) + 1.5) * 3;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 112, 67, 0.2)'; // Very transparent orange
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update animation variables
      angle += 0.01;
      
      // Continue animation
      requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    // Cleanup on unmount
    return () => {
      // No cleanup needed for canvas
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        display: 'block'
      }}
    />
  );
}