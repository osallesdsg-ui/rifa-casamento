import { useEffect, useRef } from 'react';

function DynamicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Partículas de luz dourada
    const particles = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Gradientes de ambiente
    const ambientLights = [
      { x: 0.2, y: 0.3, radius: 300, color: '201, 168, 76', speed: 0.0003 },
      { x: 0.8, y: 0.7, radius: 250, color: '100, 80, 200', speed: 0.0004 },
      { x: 0.5, y: 0.5, radius: 350, color: '201, 168, 76', speed: 0.0002 },
    ];

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fundo base escuro
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradientes de ambiente animados
      ambientLights.forEach((light) => {
        const x = canvas.width * (light.x + Math.sin(time * light.speed) * 0.1);
        const y = canvas.height * (light.y + Math.cos(time * light.speed * 0.8) * 0.1);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, light.radius);
        gradient.addColorStop(0, `rgba(${light.color}, 0.04)`);
        gradient.addColorStop(0.5, `rgba(${light.color}, 0.01)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Partículas
      particles.forEach((p) => {
        // Movimento suave
        p.x += p.speedX + Math.sin(time * 0.01 + p.pulse) * 0.1;
        p.y += p.speedY + Math.cos(time * 0.008 + p.pulse) * 0.1;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulsar opacidade
        const currentOpacity = p.opacity * (0.5 + Math.sin(time * 0.02 + p.pulse) * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${currentOpacity})`;
        ctx.fill();

        // Glow sutil ao redor
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${currentOpacity * 0.1})`;
        ctx.fill();
      });

      // Vignette sutil
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#0a0a0f' }}
    />
  );
}

export default DynamicBackground;