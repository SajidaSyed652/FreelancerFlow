import React, { useMemo } from 'react';

/**
 * GlobalParticleBackground Component
 * Renders a pure black (#000000) global background with small, elegant
 * white floating particles continuously rising from BOTTOM → TOP.
 */
export const GlobalParticleBackground = () => {
  // Generate a deterministic set of floating particles
  const particles = useMemo(() => {
    const list = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random values
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rnd3 = ((seed * 49297 + 9301) % 233280) / 233280;
      const rnd4 = ((seed * 12345 + 6789) % 233280) / 233280;

      const left = ((i * 1.33 + rnd1 * 2.8) % 99.4).toFixed(2);
      const size = i % 3 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1.5px';
      const duration = (7 + rnd3 * 11).toFixed(1); // 7s to 18s
      const delay = -(rnd4 * 18).toFixed(1); // Staggered start across full height
      const hasGlow = i % 5 === 0;

      list.push({
        id: i,
        left: `${left}%`,
        size,
        duration: `${duration}s`,
        delay: `${delay}s`,
        hasGlow,
      });
    }
    return list;
  }, []);

  return (
    <div className="global-particle-container global-particle-background" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`particle ${p.hasGlow ? 'particle-glow' : ''}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export const GlobalBackground = GlobalParticleBackground;
export default GlobalParticleBackground;
