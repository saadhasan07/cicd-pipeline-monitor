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
    
    // Color definitions - matching the image with sky blue primary color
    const skyBlue = '#1E88E5';
    const ciColors = {
      plan: '#1976D2',     // Blue
      code: '#8BC34A',     // Green
      build: '#7CB342',    // Darker green
      test: '#FFA726'      // Orange
    };
    
    const cdColors = {
      release: '#FFA726',  // Orange
      deploy: '#AB47BC',   // Purple
      operate: '#9C27B0',  // Darker purple
      monitor: '#1E88E5'   // Sky blue
    };
    
    // Animation frame function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      const gapBetweenCircles = radius * 1.2; // Gap between the two circles
      
      // Draw CI circle (left)
      const ciCenterX = centerX - gapBetweenCircles/2;
      const ciCenterY = centerY;
      
      // Draw CD circle (right)
      const cdCenterX = centerX + gapBetweenCircles/2;
      const cdCenterY = centerY;
      
      // Segment angles (in radians)
      const segmentAngle = Math.PI / 2; // 90 degrees per segment
      
      // Draw CI segments (clockwise)
      const ciSegments = [
        { name: 'PLAN', color: ciColors.plan, startAngle: 0, endAngle: segmentAngle },
        { name: 'CODE', color: ciColors.code, startAngle: segmentAngle, endAngle: segmentAngle * 2 },
        { name: 'BUILD', color: ciColors.build, startAngle: segmentAngle * 2, endAngle: segmentAngle * 3 },
        { name: 'TEST', color: ciColors.test, startAngle: segmentAngle * 3, endAngle: segmentAngle * 4 }
      ];

      // Draw CD segments (clockwise)
      const cdSegments = [
        { name: 'RELEASE', color: cdColors.release, startAngle: 0, endAngle: segmentAngle },
        { name: 'DEPLOY', color: cdColors.deploy, startAngle: segmentAngle, endAngle: segmentAngle * 2 },
        { name: 'OPERATE', color: cdColors.operate, startAngle: segmentAngle * 2, endAngle: segmentAngle * 3 },
        { name: 'MONITOR', color: cdColors.monitor, startAngle: segmentAngle * 3, endAngle: segmentAngle * 4 }
      ];
      
      // Offset angle for animation
      const animationOffset = angle;
      
      // Draw CI circle segments
      ciSegments.forEach((segment, index) => {
        ctx.beginPath();
        const startAngle = segment.startAngle + animationOffset;
        const endAngle = segment.endAngle + animationOffset;
        
        // Draw segment
        ctx.arc(ciCenterX, ciCenterY, radius, startAngle, endAngle);
        ctx.arc(ciCenterX, ciCenterY, radius * 0.6, endAngle, startAngle, true);
        ctx.closePath();
        
        // Fill segment
        ctx.fillStyle = segment.color;
        ctx.fill();
        
        // Add white border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add text
        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.8;
        const textX = ciCenterX + Math.cos(textAngle) * textRadius;
        const textY = ciCenterY + Math.sin(textAngle) * textRadius;
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI/2);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(segment.name, 0, 0);
        
        ctx.restore();
      });
      
      // Draw CD circle segments
      cdSegments.forEach((segment, index) => {
        ctx.beginPath();
        const startAngle = segment.startAngle + animationOffset;
        const endAngle = segment.endAngle + animationOffset;
        
        // Draw segment
        ctx.arc(cdCenterX, cdCenterY, radius, startAngle, endAngle);
        ctx.arc(cdCenterX, cdCenterY, radius * 0.6, endAngle, startAngle, true);
        ctx.closePath();
        
        // Fill segment
        ctx.fillStyle = segment.color;
        ctx.fill();
        
        // Add white border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add text
        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.8;
        const textX = cdCenterX + Math.cos(textAngle) * textRadius;
        const textY = cdCenterY + Math.sin(textAngle) * textRadius;
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI/2);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(segment.name, 0, 0);
        
        ctx.restore();
      });
      
      // Draw center circles (white background for CI/CD text)
      ctx.beginPath();
      ctx.arc(ciCenterX, ciCenterY, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(cdCenterX, cdCenterY, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      
      // Draw "CI" and "CD" labels
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // CI label
      ctx.fillStyle = skyBlue;
      ctx.fillText("CI", ciCenterX, ciCenterY);
      
      // CD label
      ctx.fillStyle = skyBlue;
      ctx.fillText("CD", cdCenterX, cdCenterY);
      
      // Draw connecting arrow from CI to CD
      const arrowLength = gapBetweenCircles;
      const arrowWidth = radius * 0.3;
      const arrowY = centerY;
      
      // Draw arrow body
      const gradient = ctx.createLinearGradient(
        ciCenterX + radius * 0.5, arrowY, 
        cdCenterX - radius * 0.5, arrowY
      );
      gradient.addColorStop(0, '#FFA726'); // Orange from test
      gradient.addColorStop(1, '#FFA726'); // Orange from release
      
      ctx.beginPath();
      ctx.moveTo(ciCenterX + radius * 0.5, arrowY - arrowWidth/2);
      ctx.lineTo(cdCenterX - radius * 0.5, arrowY - arrowWidth/2);
      ctx.lineTo(cdCenterX - radius * 0.5, arrowY + arrowWidth/2);
      ctx.lineTo(ciCenterX + radius * 0.5, arrowY + arrowWidth/2);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw animated dots along the pipeline
      const dotCount = 3;
      for (let i = 0; i < dotCount; i++) {
        const offsetX = Math.sin(angle * 3 + i * Math.PI/2) * 5;
        const normalizedPos = ((angle * 0.5 + i * 0.5) % 1);
        const dotX = ciCenterX + radius * 0.5 + normalizedPos * arrowLength;
        
        ctx.beginPath();
        ctx.arc(dotX, arrowY + offsetX/3, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Draw pulsing effect
        const pulseSize = (Math.sin(angle * 3 + i) + 1) * 3 + 2;
        ctx.beginPath();
        ctx.arc(dotX, arrowY + offsetX/3, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
      
      // Update animation variables
      angle += 0.005;
      
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