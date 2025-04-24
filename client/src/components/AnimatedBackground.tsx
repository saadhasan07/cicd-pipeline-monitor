import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Node class to represent deployment/code points
    class Node {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1;
        this.color = Math.random() > 0.5 
          ? 'hsla(25, 95%, 53%, 0.2)' // Orange (Primary)
          : 'hsla(199, 84%, 60%, 0.2)'; // Sky blue (Secondary)
        this.speed = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
      }
      
      update() {
        // Drift in random directions
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Slightly change angle for organic movement
        this.angle += (Math.random() - 0.5) * 0.1;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Connection class to draw lines between nodes when close
    class Connection {
      from: Node;
      to: Node;
      distance: number;
      
      constructor(from: Node, to: Node) {
        this.from = from;
        this.to = to;
        this.distance = 0;
      }
      
      update() {
        // Calculate distance between nodes
        const dx = this.from.x - this.to.x;
        const dy = this.from.y - this.to.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }
      
      draw() {
        // Only draw connections when nodes are close enough
        const maxDistance = 150;
        if (this.distance < maxDistance) {
          // Calculate opacity based on distance
          const opacity = 1 - (this.distance / maxDistance);
          
          // Draw line with gradient
          ctx.beginPath();
          ctx.moveTo(this.from.x, this.from.y);
          ctx.lineTo(this.to.x, this.to.y);
          
          // Create a gradient for the line
          if (this.from.color.includes('25') && this.to.color.includes('199')) {
            // Primary to Secondary
            const gradient = ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
            gradient.addColorStop(0, `hsla(25, 95%, 53%, ${opacity * 0.3})`);
            gradient.addColorStop(1, `hsla(199, 84%, 60%, ${opacity * 0.3})`);
            ctx.strokeStyle = gradient;
          } else {
            // Same color, just use opacity
            ctx.strokeStyle = `rgba(180, 180, 220, ${opacity * 0.15})`;
          }
          
          ctx.lineWidth = opacity * 1.5;
          ctx.stroke();
        }
      }
    }
    
    // Create nodes based on screen size (fewer nodes on smaller screens)
    const nodeCount = Math.min(Math.floor(canvas.width * canvas.height / 15000), 50);
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
    
    // Animate the canvas
    const animate = () => {
      // Clear canvas with semi-transparent bg for trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      // Draw connections between close nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const connection = new Connection(nodes[i], nodes[j]);
          connection.update();
          connection.draw();
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-50"
    />
  );
}