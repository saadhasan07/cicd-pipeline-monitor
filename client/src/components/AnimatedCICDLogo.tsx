import React, { useEffect, useRef } from 'react';

export default function AnimatedCICDLogo({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match displayed size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Animation variables
    let angle = 0;
    let circleProgress = 0;
    
    // Colors - using only sky blue theme as requested
    const skyBlueColor = 'hsl(199, 84%, 60%)'; // Sky blue
    const skyBlueColorLight = 'hsl(199, 84%, 75%)'; // Lighter sky blue for accents
    
    // Animation frame function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      
      // Draw infinity symbol (figure 8)
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      
      // Left loop - continuous cycle (Development)
      ctx.beginPath();
      ctx.strokeStyle = skyBlueColor;
      ctx.shadowColor = skyBlueColor;
      ctx.shadowBlur = 8;
      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        const progress = (i / (Math.PI * 2));
        if (progress <= circleProgress) {
          const x = centerX - radius * 0.8 + Math.cos(i - Math.PI / 2) * radius * 0.5;
          const y = centerY + Math.sin(i - Math.PI / 2) * radius * 0.5;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      
      // Right loop - continuous cycle (Deployment)
      ctx.beginPath();
      ctx.strokeStyle = skyBlueColorLight;
      ctx.shadowColor = skyBlueColorLight;
      ctx.shadowBlur = 8;
      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        const progress = (i / (Math.PI * 2));
        if (progress <= circleProgress) {
          const x = centerX + radius * 0.8 + Math.cos(i + Math.PI / 2) * radius * 0.5;
          const y = centerY + Math.sin(i + Math.PI / 2) * radius * 0.5;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      
      // Center connecting lines for infinity
      ctx.beginPath();
      ctx.lineWidth = 5;
      
      // Calculate connecting points
      const leftPoint = {
        x: centerX - radius * 0.8 + Math.cos(Math.PI * 1.5) * radius * 0.5,
        y: centerY + Math.sin(Math.PI * 1.5) * radius * 0.5
      };
      
      const rightPoint = {
        x: centerX + radius * 0.8 + Math.cos(Math.PI * 0.5) * radius * 0.5,
        y: centerY + Math.sin(Math.PI * 0.5) * radius * 0.5
      };
      
      // Draw the crossing lines with gradient
      const gradient = ctx.createLinearGradient(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y);
      gradient.addColorStop(0, skyBlueColor);
      gradient.addColorStop(1, skyBlueColorLight);
      
      // Top connecting line
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.moveTo(leftPoint.x, leftPoint.y);
      ctx.bezierCurveTo(
        centerX - radius * 0.3, centerY - radius * 0.5,
        centerX + radius * 0.3, centerY - radius * 0.5,
        rightPoint.x, rightPoint.y
      );
      ctx.stroke();
      
      // Bottom connecting line
      ctx.beginPath();
      ctx.moveTo(leftPoint.x, leftPoint.y);
      ctx.bezierCurveTo(
        centerX - radius * 0.3, centerY + radius * 0.5,
        centerX + radius * 0.3, centerY + radius * 0.5,
        rightPoint.x, rightPoint.y
      );
      ctx.stroke();
      
      // Draw moving dots to represent CI/CD flow
      const dotPositions = [
        angle * 0.7,        // First dot speed
        angle * 0.5 + 2,    // Second dot speed and offset
        angle * 0.3 + 4     // Third dot speed and offset
      ];
      
      // Draw dots along the infinity path
      dotPositions.forEach((pos, index) => {
        const modPos = pos % (Math.PI * 4); // Complete infinity path length
        
        let x, y;
        if (modPos < Math.PI * 2) {
          // Left loop path
          const loopAngle = modPos - Math.PI / 2;
          x = centerX - radius * 0.8 + Math.cos(loopAngle) * radius * 0.5;
          y = centerY + Math.sin(loopAngle) * radius * 0.5;
        } else {
          // Right loop path
          const loopAngle = (modPos - Math.PI * 2) + Math.PI / 2;
          x = centerX + radius * 0.8 + Math.cos(loopAngle) * radius * 0.5;
          y = centerY + Math.sin(loopAngle) * radius * 0.5;
        }
        
        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = index % 2 === 0 ? skyBlueColorLight : skyBlueColor;
        ctx.shadowColor = index % 2 === 0 ? skyBlueColorLight : skyBlueColor;
        ctx.shadowBlur = 15;
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pulse effect
        const pulseSize = (Math.sin(angle * 3 + index) + 1) * 5 + 3;
        ctx.beginPath();
        ctx.fillStyle = index % 2 === 0 ? `${skyBlueColorLight}30` : `${skyBlueColor}30`;
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw "CI" and "CD" labels
      ctx.shadowBlur = 0;
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      
      // CI on left loop
      ctx.fillStyle = skyBlueColor;
      ctx.fillText("CI", centerX - radius * 0.8, centerY);
      
      // CD on right loop
      ctx.fillStyle = skyBlueColorLight;
      ctx.fillText("CD", centerX + radius * 0.8, centerY);
      
      // Update animation variables
      angle += 0.03;
      circleProgress = Math.min(1, circleProgress + 0.01);
      
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
      style={{ maxHeight: '300px' }}
    />
  );
}