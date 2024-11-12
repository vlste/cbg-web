import { type FC, useEffect, useRef } from "react";

export const SparkleCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const particles: Array<{
      x: number;
      y: number;
      angle: number;
      speed: number;
      size: number;
      life: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      // ctx.rotate(rotation);
      ctx.beginPath();

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const longRadius = size;
        const shortRadius = size * 0.15;

        if (i === 0) {
          ctx.moveTo(
            Math.cos(angle) * longRadius,
            Math.sin(angle) * longRadius,
          );
        } else {
          ctx.lineTo(
            Math.cos(angle) * longRadius,
            Math.sin(angle) * longRadius,
          );
        }
        ctx.lineTo(
          Math.cos(angle + Math.PI / 4) * shortRadius,
          Math.sin(angle + Math.PI / 4) * shortRadius,
        );
      }

      ctx.closePath();
      ctx.fillStyle = `rgba(255, 200, 90, ${opacity})`;
      ctx.fill();

      ctx.restore();
    };

    const createParticle = () => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 0.8;

      particles.push({
        x: centerX,
        y: centerY,
        angle,
        speed,
        size: 4 + Math.random() * 5,
        life: 0.5 * Math.random() + 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    };

    let lastTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);

        ctx.clearRect(0, 0, rect.width, rect.height);

        if (Math.random() < 0.4) createParticle();

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          const currentSpeed = p.speed * (0.3 + p.life * 0.7);
          p.x += Math.cos(p.angle) * currentSpeed;
          p.y += Math.sin(p.angle) * currentSpeed;
          p.life -= 0.015; // Slightly faster fade out
          p.rotation += p.rotationSpeed;

          const opacity = Math.min(1, p.life * 1.5);
          drawSparkle(p.x, p.y, p.size, p.rotation, opacity);

          if (p.life <= 0) particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      particles.length = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: 240, height: 240 }}
    />
  );
};
