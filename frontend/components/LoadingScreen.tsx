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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800"
    >
      {/* Background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-emerald-400/10 rounded-full floating-bubble"
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
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="text-emerald-300"
          >
            {/* Yacht silhouette */}
            <path
              d="M20 80 L100 80 L95 70 L90 60 L85 50 L75 45 L65 42 L55 45 L45 50 L35 60 L30 70 Z"
              fill="currentColor"
              className="opacity-80"
            />
            <path
              d="M60 45 L60 20 L62 20 L62 45"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-60"
            />
            <path
              d="M62 25 L85 30 L85 32 L62 27"
              fill="currentColor"
              className="opacity-40"
            />
            {/* EFR Style waves */}
            <path
              d="M10 85 Q30 82 50 85 T90 85 Q100 82 110 85"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="opacity-60"
            />
          </svg>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl scale-150" />
        </div>
      </div>

      {/* Brand text */}
      <h1 className="text-4xl font-light text-emerald-100 mb-2 tracking-wide">
        EFR Marine CRM
      </h1>
      <p className="text-emerald-300/70 mb-16 tracking-wider text-sm">
        Excellence in Marine Tourism
      </p>

      {/* Progress bar */}
      <div 
        ref={progressBarRef}
        className="relative w-80 h-2 bg-emerald-950/50 rounded-full overflow-hidden backdrop-blur-sm border border-emerald-500/20"
      >
        <div
          ref={progressFillRef}
          className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full"
        />
        
        {/* Wave overlay */}
        <div
          ref={waveRef}
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
        />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-emerald-300/50 text-sm tracking-widest">
        INITIALIZING MARINE OPERATIONS...
      </div>
    </div>
  );
}
