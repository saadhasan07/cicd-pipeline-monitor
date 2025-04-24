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
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      
      // Draw infinity symbol (figure 8) with sky blue color
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Left loop (CI)
      ctx.beginPath();
      ctx.strokeStyle = skyBlue;
      ctx.shadowColor = skyBlueLight;
      ctx.shadowBlur = 10;
      
      for (let i = 0; i <= Math.PI * 2; i += 0.1) {
        const x = centerX - radius * 1.2 + Math.cos(i - Math.PI / 2 + angle) * radius;
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
      ctx.shadowBlur = 10;
      
      for (let i = 0; i <= Math.PI * 2; i += 0.1) {
        const x = centerX + radius * 1.2 + Math.cos(i + Math.PI / 2 + angle) * radius;
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
        centerX - radius * 1.2 + Math.cos(-Math.PI / 2 + angle) * radius, 
        centerY + Math.sin(-Math.PI / 2 + angle) * radius
      );
      ctx.bezierCurveTo(
        centerX - radius * 0.6, centerY - radius * 0.8,
        centerX + radius * 0.6, centerY - radius * 0.8,
        centerX + radius * 1.2 + Math.cos(Math.PI / 2 + angle) * radius,
        centerY + Math.sin(Math.PI / 2 + angle) * radius
      );
      
      // Bottom connection
      ctx.moveTo(
        centerX - radius * 1.2 + Math.cos(Math.PI * 1.5 + angle) * radius, 
        centerY + Math.sin(Math.PI * 1.5 + angle) * radius
      );
      ctx.bezierCurveTo(
        centerX - radius * 0.6, centerY + radius * 0.8,
        centerX + radius * 0.6, centerY + radius * 0.8,
        centerX + radius * 1.2 + Math.cos(Math.PI * 2.5 + angle) * radius,
        centerY + Math.sin(Math.PI * 2.5 + angle) * radius
      );
      
      ctx.stroke();
      
      // Draw atoms (electrons) orbiting in orange
      const atomCount = 8; 
      const atomOffset = Math.PI * 2 / atomCount;
      
      for (let i = 0; i < atomCount; i++) {
        // Calculate position on the infinity path
        const pathPos = i * atomOffset + angle * 3;
        
        let x, y;
        
        // Determine if atom is on left or right loop
        if (pathPos % (Math.PI * 4) < Math.PI * 2) {
          // Left loop (CI)
          const loopAngle = pathPos % (Math.PI * 2) - Math.PI / 2;
          x = centerX - radius * 1.2 + Math.cos(loopAngle + angle) * radius;
          y = centerY + Math.sin(loopAngle + angle) * radius;
        } else {
          // Right loop (CD)
          const loopAngle = (pathPos % (Math.PI * 2)) + Math.PI / 2;
          x = centerX + radius * 1.2 + Math.cos(loopAngle + angle) * radius;
          y = centerY + Math.sin(loopAngle + angle) * radius;
        }
        
        // Draw atom center
        ctx.beginPath();
        ctx.fillStyle = orangeColor;
        ctx.shadowColor = orangeColor;
        ctx.shadowBlur = 15;
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw orbiting electrons
        for (let j = 0; j < 2; j++) {
          const electronAngle = angle * 8 + i * Math.PI + j * Math.PI;
          const electronDistance = 12;
          const electronX = x + Math.cos(electronAngle) * electronDistance;
          const electronY = y + Math.sin(electronAngle) * electronDistance;
          
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 112, 67, 0.7)'; // Semi-transparent orange
          ctx.arc(electronX, electronY, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw electron orbit
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 112, 67, 0.3)'; // Very transparent orange
          ctx.lineWidth = 1;
          ctx.arc(x, y, electronDistance, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Draw pulsing glow
        const pulseSize = (Math.sin(angle * 5 + i) + 1.5) * 5;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 112, 67, 0.2)'; // Very transparent orange
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw "CI" and "CD" labels in floating boxes
      const labelPadding = 10;
      const labelWidth = 40;
      const labelHeight = 28;
      
      // CI Label (left)
      const ciX = centerX - radius * 1.2;
      const ciY = centerY;
      
      // Label background
      ctx.fillStyle = 'white';
      ctx.strokeStyle = skyBlue;
      ctx.lineWidth = 2;
      
      // Draw rounded rectangle manually for browser compatibility
      ctx.beginPath();
      const ciRectX = ciX - labelWidth/2;
      const ciRectY = ciY - labelHeight/2;
      const cornerRadius = 5;
      
      // Top left corner
      ctx.moveTo(ciRectX + cornerRadius, ciRectY);
      // Top right corner
      ctx.lineTo(ciRectX + labelWidth - cornerRadius, ciRectY);
      ctx.arcTo(ciRectX + labelWidth, ciRectY, ciRectX + labelWidth, ciRectY + cornerRadius, cornerRadius);
      // Bottom right corner
      ctx.lineTo(ciRectX + labelWidth, ciRectY + labelHeight - cornerRadius);
      ctx.arcTo(ciRectX + labelWidth, ciRectY + labelHeight, ciRectX + labelWidth - cornerRadius, ciRectY + labelHeight, cornerRadius);
      // Bottom left corner
      ctx.lineTo(ciRectX + cornerRadius, ciRectY + labelHeight);
      ctx.arcTo(ciRectX, ciRectY + labelHeight, ciRectX, ciRectY + labelHeight - cornerRadius, cornerRadius);
      // Top left corner again
      ctx.lineTo(ciRectX, ciRectY + cornerRadius);
      ctx.arcTo(ciRectX, ciRectY, ciRectX + cornerRadius, ciRectY, cornerRadius);
      
      ctx.fill();
      ctx.stroke();
      
      // Label text
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = skyBlue;
      ctx.fillText("CI", ciX, ciY);
      
      // CD Label (right)
      const cdX = centerX + (centerY * 0.25) * 1.2;  // Using the same radius calculation as before
      const cdY = centerY;
      
      // Label background
      ctx.fillStyle = 'white';
      ctx.strokeStyle = skyBlueLight;
      ctx.lineWidth = 2;
      
      // Draw rounded rectangle manually for browser compatibility
      ctx.beginPath();
      const cdRectX = cdX - labelWidth/2;
      const cdRectY = cdY - labelHeight/2;
      const cdRectRadius = 5;
      
      // Top left corner
      ctx.moveTo(cdRectX + cdRectRadius, cdRectY);
      // Top right corner
      ctx.lineTo(cdRectX + labelWidth - cdRectRadius, cdRectY);
      ctx.arcTo(cdRectX + labelWidth, cdRectY, cdRectX + labelWidth, cdRectY + cdRectRadius, cdRectRadius);
      // Bottom right corner
      ctx.lineTo(cdRectX + labelWidth, cdRectY + labelHeight - cdRectRadius);
      ctx.arcTo(cdRectX + labelWidth, cdRectY + labelHeight, cdRectX + labelWidth - cdRectRadius, cdRectY + labelHeight, cdRectRadius);
      // Bottom left corner
      ctx.lineTo(cdRectX + cdRectRadius, cdRectY + labelHeight);
      ctx.arcTo(cdRectX, cdRectY + labelHeight, cdRectX, cdRectY + labelHeight - cdRectRadius, cdRectRadius);
      // Top left corner again
      ctx.lineTo(cdRectX, cdRectY + cdRectRadius);
      ctx.arcTo(cdRectX, cdRectY, cdRectX + cdRectRadius, cdRectY, cdRectRadius);
      
      ctx.fill();
      ctx.stroke();
      
      // Label text
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = skyBlueLight;
      ctx.fillText("CD", cdX, cdY);
      
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
      style={{ maxHeight: '300px' }}
    />
  );
}