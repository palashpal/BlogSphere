import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export default function Logo({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
}: LogoProps) {
  // Dimensions based on size prop
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic SVG Logo Icon inspired by the uploaded image */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transform hover:scale-105 transition-transform duration-300`}
      >
        <defs>
          {/* Main Dark Navy/Blue Gradient */}
          <linearGradient id="mainNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1E43" />
            <stop offset="50%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Teal Gradient */}
          <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="60%" stopColor="#0891B2" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Orange/Amber Gradient */}
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Glow / Shadow Filters */}
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Globe Framework (Grid Lines) */}
        {/* Outer Circle */}
        <circle
          cx="60"
          cy="60"
          r="48"
          stroke="url(#mainNavyGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Latitude Horizontal Lines */}
        <path
          d="M17 40 C 35 45, 85 45, 103 40"
          stroke="url(#mainNavyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M17 80 C 35 75, 85 75, 103 80"
          stroke="url(#mainNavyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Longitude Vertical Arcs */}
        <path
          d="M40 17 C 45 35, 45 85, 40 103"
          stroke="url(#mainNavyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M80 17 C 75 35, 75 85, 80 103"
          stroke="url(#mainNavyGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Diagonal Cross Swirl ( Saturn / Orbit Ring ) */}
        <path
          d="M15 80 C 20 40, 100 20, 105 50 C 108 65, 80 95, 30 102"
          stroke="url(#tealGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#subtleGlow)"
        />
        
        {/* Secondary Warm Orbit Ring Accent */}
        <path
          d="M25 22 C 55 15, 95 35, 100 65"
          stroke="url(#orangeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 2. Overlapping Speech Bubbles in Center */}
        {/* Left Speech Bubble (Orange Accent) */}
        <g transform="translate(30, 42)">
          {/* Bubble Background Fill to prevent grid lines showing through */}
          <path
            d="M 5 0 H 30 A 12 12 0 0 1 42 12 V 22 A 12 12 0 0 1 30 34 H 14 L 4 41 V 34 A 12 12 0 0 1 0 22 V 12 A 12 12 0 0 1 5 0 Z"
            fill="#FFFFFF"
          />
          {/* Bubble Border */}
          <path
            d="M 5 0 H 30 A 12 12 0 0 1 42 12 V 22 A 12 12 0 0 1 30 34 H 14 L 4 41 V 34 A 12 12 0 0 1 0 22 V 12 A 12 12 0 0 1 5 0 Z"
            stroke="url(#orangeGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Three Conversation Dots */}
          <circle cx="12" cy="18" r="2.5" fill="#F97316" />
          <circle cx="21" cy="18" r="2.5" fill="#F97316" />
          <circle cx="30" cy="18" r="2.5" fill="#F97316" />
        </g>

        {/* Right Speech Bubble (Teal Accent, Offset) */}
        <g transform="translate(52, 49)">
          {/* Bubble Background Fill */}
          <path
            d="M 12 0 H 28 A 10 10 0 0 1 38 10 V 18 A 10 10 0 0 1 28 28 H 25 L 18 34 V 28 A 10 10 0 0 1 8 18 V 10 A 10 10 0 0 1 12 0 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Bubble Border */}
          <path
            d="M 12 0 H 28 A 10 10 0 0 1 38 10 V 18 A 10 10 0 0 1 28 28 H 25 L 18 34 V 28 A 10 10 0 0 1 8 18 V 10 A 10 10 0 0 1 12 0 Z"
            stroke="url(#tealGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Dots inside Teal Bubble */}
          <circle cx="18" cy="14" r="1.8" fill="#0D9488" />
          <circle cx="28" cy="14" r="1.8" fill="#0D9488" />
        </g>
      </svg>

      {/* Brand Text */}
      {variant === 'full' && (
        <div className="flex flex-col text-left leading-none">
          <span className={`font-sans font-extrabold tracking-tight ${textSizes[size]} text-[#0B2545]`}>
            Blog<span className="text-[#008392]">Sphere</span>
          </span>
          {showTagline && (
            <span className={`font-sans font-normal text-zinc-500 mt-1 tracking-wider lowercase ${taglineSizes[size]}`}>
              connecting ideas, inspiring voices
            </span>
          )}
        </div>
      )}
    </div>
  );
}
