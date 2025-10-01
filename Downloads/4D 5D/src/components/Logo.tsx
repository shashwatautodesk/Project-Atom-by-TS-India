import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const dimensions = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className={`${dimensions[size]} ${className} relative`}>
      {/* Atomic Logo - Modern 3D Molecule Design */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Glow */}
        <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" opacity="0.3" />
        
        {/* Orbital Rings */}
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="15"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          transform="rotate(-30 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="15"
          stroke="#0696D7"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          transform="rotate(30 50 50)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="15"
          stroke="#00C9A7"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          transform="rotate(90 50 50)"
        />

        {/* Electron Particles on Orbits */}
        <circle cx="50" cy="35" r="4" fill="#FFD700">
          <animate
            attributeName="cx"
            values="50;85;50;15;50"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="35;50;65;50;35"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="85" cy="50" r="4" fill="#0696D7">
          <animate
            attributeName="cx"
            values="85;50;15;50;85"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="50;65;50;35;50"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15" cy="50" r="4" fill="#00C9A7">
          <animate
            attributeName="cx"
            values="15;50;85;50;15"
            dur="3.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="50;35;50;65;50"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Central Nucleus - Gradient Sphere */}
        <defs>
          <radialGradient id="nucleusGradient">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#0696D7" />
          </radialGradient>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* 3D Nucleus Effect */}
        <circle cx="50" cy="50" r="12" fill="url(#nucleusGradient)">
          <animate
            attributeName="r"
            values="12;14;12"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="50" cy="50" r="10" fill="#FFD700" opacity="0.4" />
        <circle cx="47" cy="47" r="4" fill="#FFFFFF" opacity="0.6" />

        {/* Autodesk "A" Logo - Prominent */}
        <defs>
          <filter id="textGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle for "A" */}
        <circle cx="50" cy="50" r="14" fill="#0D0D0D" opacity="0.7" />
        
        {/* Autodesk "A" - Bold and Prominent */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          fill="#FFFFFF"
          filter="url(#textGlow)"
        >
          A
        </text>
        
        {/* Yellow highlight on "A" */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="28"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          fill="#FFD700"
          opacity="0.3"
        >
          A
        </text>
      </svg>
    </div>
  );
};

export default Logo;

