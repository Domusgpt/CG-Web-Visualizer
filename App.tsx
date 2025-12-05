
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import EpitaxialBackground from './components/EpitaxialBackground';

// Types for GSAP global
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

// Data for Sections
const SECTIONS = {
  ID: {
    id: 'ID',
    title: 'Identify the Unknown',
    shortDesc: 'Geometric crystal recognition neural engine.',
    fullDesc: 'Point your lens at any stone. Our neural engine recognizes the geometric signature of earth\'s treasures instantly. From Labradorite to Quartz, get instant identification, metaphysical properties, and care guides.',
    color: 'text-crystal',
    borderColor: 'border-crystal',
    bgGradient: 'from-crystal/20',
    image: 'https://placehold.co/400x800/0a0a0a/a5f3fc.png?text=Crystal+ID+Scanner',
    details: [
      'https://placehold.co/600x400/111/a5f3fc.png?text=Spectral+Analysis',
      'https://placehold.co/600x400/111/a5f3fc.png?text=Library+Match',
      'https://placehold.co/600x400/111/a5f3fc.png?text=Confidence+99%25'
    ]
  },
  JOURNAL: {
    id: 'JOURNAL',
    title: 'Grimoire Journal',
    shortDesc: 'Catalog your collection and spiritual journey.',
    fullDesc: 'Your personal digital grimoire. Track your crystal collection, log daily intentions, and record the stones that call to you. Filter by chakra, color, or energetic property.',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-400',
    bgGradient: 'from-indigo-500/20',
    image: 'https://placehold.co/400x800/0a0a0a/818cf8.png?text=Journal+Entry',
    details: [
      'https://placehold.co/600x400/111/818cf8.png?text=Collection+Grid',
      'https://placehold.co/600x400/111/818cf8.png?text=Daily+Log',
      'https://placehold.co/600x400/111/818cf8.png?text=Insights'
    ]
  },
  GURU: {
    id: 'GURU',
    title: 'Cosmic Guru',
    shortDesc: 'AI-powered ancient wisdom synthesis.',
    fullDesc: 'Ask the Universe anything. The AI Guru connects ancient wisdom with modern intent, providing guidance on release, growth, and the mystic arts. A companion for your spiritual path.',
    color: 'text-accent',
    borderColor: 'border-accent',
    bgGradient: 'from-accent/20',
    image: 'https://placehold.co/400x800/1a0b2e/d8b4fe.png?text=AI+Guru+Chat',
    details: [
      'https://placehold.co/600x400/111/d8b4fe.png?text=Tarot+Interpretation',
      'https://placehold.co/600x400/111/d8b4fe.png?text=Meditation+Gen',
      'https://placehold.co/600x400/111/d8b4fe.png?text=Chat+History'
    ]
  },
  MOON: {
    id: 'MOON',
    title: 'Moon Rituals',
    shortDesc: 'Align with the lunar cycle.',
    fullDesc: 'Sync your practice with the cosmos. Get notifications for Full Moons, New Moons, and Eclipses. Access curated rituals for releasing, manifesting, and charging your crystals.',
    color: 'text-gray-200',
    borderColor: 'border-gray-200',
    bgGradient: 'from-gray-100/20',
    image: 'https://placehold.co/400x800/000/fff.png?text=Moon+Phase',
    details: [
      'https://placehold.co/600x400/111/fff.png?text=Phase+Calendar',
      'https://placehold.co/600x400/111/fff.png?text=Ritual+Guide',
      'https://placehold.co/600x400/111/fff.png?text=Notifications'
    ]
  },
  HEALING: {
    id: 'HEALING',
    title: 'Vibrational Healing',
    shortDesc: 'Sound baths and chakra alignment.',
    fullDesc: 'Immerse yourself in digital Sound Baths. Select frequencies tailored to specific chakras or emotional states. Let the vibrations restore your energetic balance.',
    color: 'text-gold',
    borderColor: 'border-gold',
    bgGradient: 'from-gold/20',
    image: 'https://placehold.co/400x800/1e1e1e/ffd700.png?text=Sound+Bath',
    details: [
      'https://placehold.co/600x400/111/ffd700.png?text=Frequency+Player',
      'https://placehold.co/600x400/111/ffd700.png?text=Chakra+Chart',
      'https://placehold.co/600x400/111/ffd700.png?text=Timer'
    ]
  },
  MARKET: {
    id: 'MARKET',
    title: 'Ethical Marketplace',
    shortDesc: 'Sourced with intention.',
    fullDesc: 'Browse a curated selection of ethically sourced crystals. Verify the origin and energetic path of every stone before you bring it into your sacred space.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400',
    bgGradient: 'from-emerald-400/20',
    image: 'https://placehold.co/400x800/001/34d399.png?text=Market+Listing',
    details: [
      'https://placehold.co/600x400/111/34d399.png?text=Origin+Map',
      'https://placehold.co/600x400/111/34d399.png?text=Miner+Info',
      'https://placehold.co/600x400/111/34d399.png?text=Certificates'
    ]
  }
};

interface SectionProps {
  data: typeof SECTIONS.ID;
  alignment: 'left' | 'right';
  isVisible: boolean;
  onExpand: (id: string) => void;
}

const ExpandedSection: React.FC<SectionProps> = ({ data, alignment, isVisible, onExpand }) => {
  const alignClass = alignment === 'left' ? 'flex-row' : 'flex-row-reverse';
  const fadeClass = isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-xl';
  
  return (
    <div className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-1000 ease-out ${fadeClass} pointer-events-none`}>
       <div className={`flex ${alignClass} items-center gap-4 md:gap-12 max-w-7xl w-full`}>
          
          {/* Text Content */}
          <div className={`flex-1 ${alignment === 'left' ? 'text-left' : 'text-right'} pointer-events-auto`}>
             <h3 className={`font-serif text-4xl md:text-6xl mb-6 ${data.color} text-glow uppercase tracking-wider`}>{data.title}</h3>
             <div className={`glass-panel p-6 rounded-xl inline-block backdrop-blur-md border-l-4 ${data.borderColor}`}>
                <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                  {data.shortDesc}
                </p>
                <button 
                  onClick={() => onExpand(data.id)}
                  className={`mt-6 px-6 py-2 rounded-full border ${data.borderColor} ${data.color} hover:bg-white/10 transition-colors uppercase text-sm tracking-widest`}
                >
                  Explore System
                </button>
             </div>
          </div>

          {/* Phone Card Visual */}
          <div 
            onClick={() => onExpand(data.id)}
            className="flex-1 flex justify-center perspective-1000 cursor-pointer pointer-events-auto group"
          >
             <div className={`synth-card relative w-[280px] h-[580px] md:w-[320px] md:h-[650px] bg-black rounded-[2.5rem] border-4 border-gray-900 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4 ${alignment === 'left' ? 'rotate-y-12' : '-rotate-y-12'}`}>
                {/* Dynamic notch */}
                <div className="absolute top-0 w-full h-8 z-20 bg-black flex justify-center">
                    <div className="w-32 h-6 bg-gray-900 rounded-b-xl"></div>
                </div>
                
                {/* Screen Image */}
                <img src={data.image} alt={data.title} className="w-full h-full object-cover opacity-90" />
                
                {/* Effects */}
                <div className="absolute inset-0 synth-scanlines pointer-events-none opacity-30"></div>
                <div className={`absolute inset-0 border-[3px] rounded-[2.2rem] opacity-50 ${data.borderColor}`}></div>
                
                {/* Floating Badge */}
                <div className={`absolute -bottom-6 ${alignment === 'left' ? '-right-12' : '-left-12'} glass-panel px-4 py-2 rounded-lg text-xs tracking-widest uppercase ${data.color} animate-bounce`}>
                  Click to Expand
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const ExpandedOverlay: React.FC<{ sectionId: string; onClose: () => void }> = ({ sectionId, onClose }) => {
  // @ts-ignore
  const data = SECTIONS[sectionId];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-void/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fade-in text-white overflow-hidden">
       {/* Background Glow */}
       <div className={`absolute inset-0 bg-gradient-radial ${data.bgGradient} to-transparent opacity-20 pointer-events-none`}></div>

       <button 
         onClick={onClose}
         className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all z-50 group"
       >
         <span className="text-2xl group-hover:rotate-90 transition-transform">✕</span>
       </button>

       <div className="flex flex-col md:flex-row w-full max-w-7xl h-full gap-8">
          {/* Left Column: Main Visual & Title */}
          <div className="flex-1 flex flex-col justify-center relative">
             <h2 className={`font-serif text-5xl md:text-7xl mb-6 ${data.color} text-glow uppercase`}>{data.title}</h2>
             <p className="text-xl text-gray-300 font-light leading-relaxed mb-10 max-w-xl">
               {data.fullDesc}
             </p>
             
             {/* Main Phone Expanded */}
             <div className="relative w-full max-w-md aspect-[9/16] md:aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={data.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div className="font-mono text-xs text-white/50">SYSTEM_STATE: ACTIVE</div>
                </div>
             </div>
          </div>

          {/* Right Column: Grid Details */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min content-center">
             {data.details.map((src: string, i: number) => (
               <div key={i} className={`group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-${data.color.split('-')[1]} transition-all duration-300 hover:scale-[1.02] ${i === 0 ? 'md:col-span-2 md:h-64' : 'h-48'}`}>
                  <img src={src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 synth-scanlines opacity-20"></div>
                  <div className="absolute bottom-4 left-4 font-mono text-xs tracking-widest uppercase bg-black/50 px-2 py-1 rounded">
                    Fig 0.{i+1}
                  </div>
               </div>
             ))}
             
             {/* Interactive Area Placeholder */}
             <div className="md:col-span-2 bg-white/5 rounded-xl p-6 border border-dashed border-white/20 flex items-center justify-center min-h-[100px]">
                <p className="font-mono text-sm text-gray-500 animate-pulse">Waiting for user input...</p>
             </div>
          </div>
       </div>
    </div>
  );
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const trigger = window.ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self: any) => {
        if (!expandedSection) {
          setProgress(self.progress);
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [expandedSection]);

  // Disable body scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expandedSection ? 'hidden' : 'auto';
  }, [expandedSection]);

  // BOMBASTIC TITLE LOGIC
  // progress 0 -> Scale 4, Top 50%, Left 50%
  // progress 0.1 -> Scale 1, Top 32px, Left 32px
  const titleProgress = Math.min(progress * 10, 1); // 0 to 1 over first 10% of scroll
  
  // Interpolation helper
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const p = easeOut(titleProgress);

  // Smooth Calc Transition
  // Start: 50%
  // End: 3rem
  const positionCalc = `calc(50% * ${1 - p} + 3rem * ${p})`;
  const scaleCalc = 4 - (3 * p);
  const translateCalc = `translate(-50%, -50%)`;
  
  // Text Effects based on progress
  const letterSpacing = `${1 - 0.8 * p}em`; // 1em -> 0.2em
  const blurAmount = `${(1 - p) * 8}px`; // 8px -> 0px
  const shadowOpacity = 1 - p;
  
  const headerStyle: React.CSSProperties = {
     position: 'fixed',
     top: positionCalc,
     left: positionCalc,
     transform: `${translateCalc} scale(${scaleCalc})`,
     zIndex: 60,
     width: 'max-content',
     transformOrigin: 'center center',
     willChange: 'top, left, transform'
  };

  return (
    <div className="bg-void font-sans text-white min-h-screen">
      {expandedSection && (
        <ExpandedOverlay 
          sectionId={expandedSection} 
          onClose={() => setExpandedSection(null)} 
        />
      )}

      {/* 1200vh Scroll Container for more content */}
      <div ref={containerRef} className="scroll-container" style={{ height: '1200vh' }}>
        
        {/* Fixed Viewport */}
        <div className="viewport">
          
          {/* Backgrounds */}
          <EpitaxialBackground scrollProgress={progress} />
          
          <div className={`absolute inset-0 z-10 transition-all duration-1000 ${expandedSection ? 'scale-95 opacity-50 blur-sm' : ''}`}>
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
              <Scene scrollProgress={progress} expandedSection={expandedSection} />
            </Canvas>
          </div>

          {/* Foreground: UI Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none">
             
             {/* BOMBASTIC HEADER */}
             <div style={headerStyle} className="flex flex-col items-center">
                <div className="flex items-center gap-4 whitespace-nowrap">
                   <div className="text-4xl animate-spin-slow text-crystal">✨</div>
                   
                   <h1 className="font-serif text-2xl md:text-3xl font-bold flex gap-4 transition-all duration-300" 
                       style={{ letterSpacing }}>
                     
                     {/* Word 1: CRYSTAL (Hollow/Outlined style when big) */}
                     <span 
                       className="text-transparent bg-clip-text bg-gradient-to-r from-crystal to-white filter transition-all duration-300"
                       style={{ 
                         textShadow: `0 0 ${30 * shadowOpacity}px rgba(165,243,252, ${0.5 * shadowOpacity})`,
                         filter: `blur(${blurAmount})`
                       }}
                     >
                       CRYSTAL
                     </span>
                     
                     {/* Word 2: GRIMOIRE (Solid/Filled style) */}
                     <span 
                       className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500 filter transition-all duration-300"
                       style={{ 
                         textShadow: `0 0 ${40 * shadowOpacity}px rgba(216,180,254, ${0.8 * shadowOpacity})`,
                         filter: `blur(${blurAmount})`
                       }}
                     >
                       GRIMOIRE
                     </span>
                   </h1>
                </div>
                
                {/* Intro Subtitle - Fades out */}
                <div 
                  className="mt-4 font-mono text-gold tracking-[0.5em] uppercase text-sm whitespace-nowrap overflow-hidden transition-opacity duration-300"
                  style={{ opacity: 1 - titleProgress * 3 }}
                >
                  Clear Seas Solutions
                </div>
             </div>

             {/* 0.15 - 0.25: CRYSTAL ID */}
             <ExpandedSection 
               data={SECTIONS.ID}
               alignment="left"
               isVisible={progress > 0.12 && progress < 0.23}
               onExpand={setExpandedSection}
             />

             {/* 0.25 - 0.38: JOURNAL */}
             <ExpandedSection 
               data={SECTIONS.JOURNAL}
               alignment="right"
               isVisible={progress > 0.25 && progress < 0.36}
               onExpand={setExpandedSection}
             />

             {/* 0.38 - 0.50: GURU */}
             <ExpandedSection 
               data={SECTIONS.GURU}
               alignment="left"
               isVisible={progress > 0.38 && progress < 0.49}
               onExpand={setExpandedSection}
             />

             {/* 0.50 - 0.62: MOON */}
             <ExpandedSection 
               data={SECTIONS.MOON}
               alignment="right"
               isVisible={progress > 0.51 && progress < 0.62}
               onExpand={setExpandedSection}
             />

             {/* 0.62 - 0.75: HEALING */}
             <ExpandedSection 
               data={SECTIONS.HEALING}
               alignment="left"
               isVisible={progress > 0.64 && progress < 0.75}
               onExpand={setExpandedSection}
             />

             {/* 0.75 - 0.88: MARKET */}
             <ExpandedSection 
               data={SECTIONS.MARKET}
               alignment="right"
               isVisible={progress > 0.77 && progress < 0.88}
               onExpand={setExpandedSection}
             />

             {/* 0.90 - 1.0: CTA */}
             <div 
               className={`text-center transition-all duration-1000 absolute z-40 pointer-events-auto ${progress > 0.90 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
             >
               <h2 className="font-serif text-5xl md:text-7xl mb-8 text-white text-glow">Beta Access Open</h2>
               <a 
                 href="mailto:phillips.paul.email@gmail.com?subject=I seek the Crystal Grimoire Beta"
                 className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-serif font-medium tracking-tighter text-white bg-gray-900 rounded-lg group border border-white/20"
               >
                 <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-gradient-to-r from-accent to-crystal rounded-full group-hover:w-80 group-hover:h-80 opacity-20"></span>
                 <span className="relative flex items-center gap-3 text-xl">
                   ENTER THE VOID 
                   <span className="group-hover:translate-x-1 transition-transform">→</span>
                 </span>
               </a>
               <p className="mt-8 text-gray-400 font-mono text-sm">Paul Phillips // Clear Seas Solutions</p>
             </div>

          </div>

          {/* Right side scroll indicators */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40 pointer-events-auto">
             {Object.keys(SECTIONS).map((key, i) => {
                // Approximate scroll mapping
                const targets = [0.18, 0.30, 0.43, 0.56, 0.69, 0.82];
                const isActive = Math.abs(progress - targets[i]) < 0.06;
                return (
                  <button 
                    key={key} 
                    onClick={() => {
                        // In a real implementation, we'd scrollIntoView or use GSAP scrollInto
                        // For now just visual indicator
                    }}
                    className="group flex items-center gap-3 flex-row-reverse"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-crystal scale-150 shadow-[0_0_8px_#a5f3fc]' : 'bg-white/10'}`} />
                    <span className={`text-[9px] uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100 text-crystal translate-x-0' : 'opacity-0 translate-x-4'}`}>
                      {key}
                    </span>
                  </button>
                )
             })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
