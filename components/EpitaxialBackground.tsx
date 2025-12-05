import React, { useEffect, useRef } from 'react';

interface Props {
  scrollProgress: number;
}

const EpitaxialBackground: React.FC<Props> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic styles based on scroll
  // Epitaxial growth implies layering. We will rotate and scale layers.
  
  const layer1Scale = 1 + scrollProgress * 2;
  const layer1Rotate = scrollProgress * 90;
  
  const layer2Scale = 0.5 + scrollProgress * 1.5;
  const layer2Rotate = scrollProgress * -180;

  const layer3Opacity = Math.max(0, (scrollProgress - 0.2) * 2);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-40 mix-blend-screen"
    >
       {/* Layer 1: The Base Hexagon */}
       <div 
         className="absolute transition-transform duration-75 ease-linear"
         style={{ 
           transform: `scale(${layer1Scale}) rotate(${layer1Rotate}deg)`,
           width: '600px', height: '600px'
         }}
       >
          <svg viewBox="0 0 100 100" className="w-full h-full text-mystic opacity-30">
             <polygon points="50 0, 93 25, 93 75, 50 100, 7 75, 7 25" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <polygon points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
       </div>

       {/* Layer 2: The Middle Lattice */}
       <div 
         className="absolute transition-transform duration-75 ease-linear"
         style={{ 
            transform: `scale(${layer2Scale}) rotate(${layer2Rotate}deg)`,
            width: '400px', height: '400px'
          }}
       >
          <svg viewBox="0 0 100 100" className="w-full h-full text-crystal opacity-20">
             <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
             <polygon points="50 5, 89 27, 89 72, 50 95, 11 72, 11 27" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
       </div>

       {/* Layer 3: The Outer Field */}
       <div 
         className="absolute transition-all duration-300 ease-out"
         style={{ 
            opacity: layer3Opacity,
            transform: `scale(${1 + scrollProgress})`,
            width: '100vw', height: '100vh'
          }}
       >
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(165, 243, 252, 0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
       </div>
    </div>
  );
};

export default EpitaxialBackground;
