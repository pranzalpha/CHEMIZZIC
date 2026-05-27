import React from 'react';

interface ChemizicLogoProps {
  showText?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function ChemizicLogo({ showText = true, className = "h-10", iconOnly = false }: ChemizicLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon portion - custom SVG mirroring the C-flask container and vertical bubbles */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto overflow-visible shrink-0"
        aria-hidden="true"
      >
        <defs>
          {/* Rich deep blue gradient for the main "C" contour matching the logo scheme */}
          <linearGradient id="c-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2A4A" />
            <stop offset="100%" stopColor="#021226" />
          </linearGradient>
          
          {/* Glowing fluid gradient for the beaker's contents */}
          <linearGradient id="fluid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1ad1f5" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Neon glow filter for the vertical rising bubbles */}
          <filter id="neon-bubble-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer brand "C" block - precisely configured paths forming the circular ring with right-side mouth */}
        <path
          d="M 76,31 A 33,33 0 1,0 76,71 L 67,61 A 19,19 0 1,1 67,41 Z"
          fill="url(#c-brand-gradient)"
          stroke="#103c66"
          strokeWidth="1.5"
        />

        {/* Curved liquid portion inside the flask */}
        <path
          d="M 40.5,50 C 44.5,52 52.5,47.5 59.5,50 L 63.5,61.5 C 64.3,63.2 63.1,65 61,65 L 39,65 C 36.9,65 35.7,63.2 36.5,61.5 Z"
          fill="url(#fluid-gradient)"
        />

        {/* Lab liquid bubbles inside fluid */}
        <circle cx="48" cy="58" r="1.8" fill="#ffffff" opacity="0.8" />
        <circle cx="53" cy="54" r="1.2" fill="#ffffff" opacity="0.6" />

        {/* Beaker borders and neck lines */}
        <path
          d="M 43.5,27 L 56.5,27"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 45.5,27 L 45.5,38 L 35.5,61.5 C 34.5,64 36.5,66.5 39,66.5 Q 50,67.5 61,66.5 C 63.5,66.5 65.5,64 64.5,61.5 L 54.5,38 L 54.5,27"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Brand floating bubbles - matching the vertical layout coordinates precisely */}
        <circle cx="49.5" cy="22" r="1.5" fill="#38bdf8" filter="url(#neon-bubble-glow)" />
        <circle cx="53.5" cy="14" r="2.8" fill="#1ad1f5" filter="url(#neon-bubble-glow)" />
        <circle cx="49" cy="8.2" r="1.3" fill="#38bdf8" filter="url(#neon-bubble-glow)" />
      </svg>

      {/* Brand textual identifier with custom dotless-i neon bubble dots */}
      {showText && !iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline font-sans text-xl leading-none">
            {/* "chemi" in clean high-contrast off-white/slate */}
            <span className="font-extrabold text-slate-100 tracking-tight flex items-baseline">
              chem
              <span className="relative inline-block leading-none">
                ı
                <span className="absolute -top-1.5 left-1/2 -translate-x-[40%] w-[5px] h-[5px] rounded-full bg-[#1ad1f5] shadow-[0_0_8px_#1ad1f5]" />
              </span>
            </span>
            {/* "zic" in electric cyan */}
            <span className="font-black text-cyan-400 tracking-tight flex items-baseline ml-0.5">
              z
              <span className="relative inline-block leading-none">
                ı
                <span className="absolute -top-1.5 left-1/2 -translate-x-[40%] w-[5px] h-[5px] rounded-full bg-[#1ad1f5] shadow-[0_0_8px_#1ad1f5]" />
              </span>
              c
            </span>
          </div>
          <span className="text-[7.5px] font-mono tracking-[0.3em] text-slate-500 uppercase mt-1">
            LABORATORY GATEWAY
          </span>
        </div>
      )}
    </div>
  );
}
