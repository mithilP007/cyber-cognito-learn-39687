import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ThreeScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let rotation = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw rotating rings
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation + i * 0.5);

        ctx.beginPath();
        ctx.arc(0, 0, 50 + i * 30, 0, Math.PI * 2);
        ctx.strokeStyle = i === 0 ? '#00f0ff' : i === 1 ? '#ff00ff' : '#00ff41';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
        ctx.restore();
      }

      // Draw brain waves
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + Math.sin(x * 0.02 + rotation * 2) * 20;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();

      rotation += 0.01;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">AR/VR Preview</CardTitle>
        <CardDescription>Immersive learning environment</CardDescription>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-lg bg-background/50"
        />
      </CardContent>
    </Card>
  );
};
