import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const context: CanvasRenderingContext2D = ctx;
    let animationFrameId = 0;

    const setCanvasSize = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

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
          ? 'hsla(25, 95%, 53%, 0.2)'
          : 'hsla(199, 84%, 60%, 0.2)';
        this.speed = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += (Math.random() - 0.5) * 0.1;

        if (this.x < 0) this.x = canvasEl.width;
        if (this.x > canvasEl.width) this.x = 0;
        if (this.y < 0) this.y = canvasEl.height;
        if (this.y > canvasEl.height) this.y = 0;
      }

      draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

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
        const dx = this.from.x - this.to.x;
        const dy = this.from.y - this.to.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        const maxDistance = 150;
        if (this.distance < maxDistance) {
          const opacity = 1 - this.distance / maxDistance;

          context.beginPath();
          context.moveTo(this.from.x, this.from.y);
          context.lineTo(this.to.x, this.to.y);

          if (this.from.color.includes('25') && this.to.color.includes('199')) {
            const gradient = context.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
            gradient.addColorStop(0, `hsla(25, 95%, 53%, ${opacity * 0.3})`);
            gradient.addColorStop(1, `hsla(199, 84%, 60%, ${opacity * 0.3})`);
            context.strokeStyle = gradient;
          } else {
            context.strokeStyle = `rgba(180, 180, 220, ${opacity * 0.15})`;
          }

          context.lineWidth = opacity * 1.5;
          context.stroke();
        }
      }
    }

    const nodeCount = Math.min(Math.floor((canvasEl.width * canvasEl.height) / 15000), 50);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(
        Math.random() * canvasEl.width,
        Math.random() * canvasEl.height,
      ));
    }

    const animate = () => {
      context.fillStyle = 'rgba(255, 255, 255, 0.05)';
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const connection = new Connection(nodes[i], nodes[j]);
          connection.update();
          connection.draw();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-50"
    />
  );
}
