import React from 'react';
import { Particles } from './Particles';

/**
 * GlobalBackground Component
 * Renders the exact React Bits OGL Particles background across the full viewport,
 * configured with FreelancerFlow's signature lavender/purple palette.
 */
export const GlobalBackground = () => {
  return (
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-0 bg-[#000000]"
      aria-hidden="true"
    >
      {/* Subtle ambient lighting backdrop for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(155,131,189,0.18),rgba(118,91,158,0.06)_50%,transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(185,167,217,0.08),transparent_70%)] pointer-events-none" />

      {/* Exact React Bits Particles Component */}
      <Particles
        particleColors={['#C4A7E7', '#B89AD9', '#E5D9F5']}
        particleCount={350}
        particleSpread={12}
        speed={0.1}
        particleBaseSize={85}
        moveParticlesOnHover={true}
        particleHoverFactor={0.5}
        alphaParticles={true}
        sizeRandomness={0.8}
        cameraDistance={20}
        disableRotation={false}
        pixelRatio={1}
      />
    </div>
  );
};

export default GlobalBackground;
