import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Dissolution animation
        gsap.to(containerRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: onComplete,
        });
      }
    });

    // Logo animation
    tl.fromTo(logoRef.current, 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );

    // Wave animation
    tl.to(waveRef.current, {
      x: "100%",
      duration: 2,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    }, "-=0.5");

    // Progress bar animation
    tl.to(progressFillRef.current, {
      width: "100%",
      duration: 2.5,
      ease: "power2.out",
    }, "-=1");

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black"
    >
      {/* Background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-400/10 rounded-full floating-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div ref={logoRef} className="mb-16">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-black border-4 border-amber-400 flex items-center justify-center">
            <span className="text-4xl font-bold text-amber-400">EFR</span>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl scale-150" />
        </div>
      </div>

      {/* Brand text */}
      <h1 className="text-4xl font-light text-amber-100 mb-2 tracking-wide">
        EFR Marine CRM
      </h1>
      <p className="text-amber-300/70 mb-16 tracking-wider text-sm">
        Excellence in Marine Tourism
      </p>

      {/* Progress bar */}
      <div 
        ref={progressBarRef}
        className="relative w-80 h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-amber-500/20"
      >
        <div
          ref={progressFillRef}
          className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
        />
        
        {/* Wave overlay */}
        <div
          ref={waveRef}
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
        />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-amber-300/50 text-sm tracking-widest">
        INITIALIZING MARINE OPERATIONS...
      </div>
    </div>
  );
}
