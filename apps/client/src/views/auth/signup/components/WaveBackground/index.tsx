import { FC, useEffect, useRef } from 'react';
import './index.scss';

const WaveBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 使用更鲜艳的颜色
      drawWave(ctx, time, canvas.height * 0.7, 'rgba(22, 119, 255, 0.1)');
      drawWave(ctx, time + 1, canvas.height * 0.75, 'rgba(22, 119, 255, 0.05)');
      drawWave(ctx, time + 2, canvas.height * 0.8, 'rgba(22, 119, 255, 0.03)');

      animationFrameId = requestAnimationFrame(animate);
    };

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      time: number,
      baseHeight: number,
      color: string
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x++) {
        const y =
          Math.sin(x * 0.003 + time) * 30 + // 增大波浪振幅
          Math.sin(x * 0.006 + time * 1.5) * 15 + // 添加第二层波浪
          baseHeight;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.fill();
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="wave-background" />;
};

export { WaveBackground };
