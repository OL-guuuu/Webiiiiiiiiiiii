import React from 'react';

interface ScrollPromptOverlayProps {
  progress: number;
}

export const ScrollPromptOverlay: React.FC<ScrollPromptOverlayProps> = ({ progress }) => {
  // If progress is 0, unmount immediately to avoid invisible overlay blocking things
  if (progress === 0) return null;

  // Simplified mathematical fade strategy to override any React/GSAP lifecycle quirks
  let opacity = 0;
  if (progress > 0 && progress <= 0.1) opacity = progress / 0.1;
  else if (progress > 0.1 && progress <= 0.9) opacity = 1;
  else if (progress > 0.9 && progress <= 1) opacity = 1 - ((progress - 0.9) / 0.1);

  // Derive elegant entrance scaling and blur
  const scale = 0.98 + (0.02 * opacity);
  const translateY = 10 * (1 - opacity);
  const blur = 8 * (1 - opacity);

  return (
    <div className={`fixed inset-0 z-[150] pointer-events-none flex flex-col items-center justify-end pb-[10vh] md:pb-[12vh]`}>
      
      {/* Ultra-minimal floating scroll indicator without any bulky boxes */}
      <div 
        className="flex flex-col items-center gap-4 md:gap-6"
        style={{
          opacity: opacity,
          transform: `translateY(${translateY}px)`,
          willChange: 'opacity, transform'
        }}
      >
        <style>
          {`
            @keyframes line-drop {
              0% { transform: translateY(-100%); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { transform: translateY(250%); opacity: 0; }
            }
          `}
        </style>

        <div className="flex flex-col items-center text-center gap-1.5 opacity-90">
          <h2 
            className="font-sans text-xs md:text-[13px] font-semibold text-white tracking-[0.4em] uppercase"
            style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}
          >
            Curious?
          </h2>
          <p 
            className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] text-white/50 uppercase"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            Scroll or Swipe to Reveal
          </p>
        </div>

        {/* Minimalist animated vertical line */}
        <div className="w-[1px] h-[50px] md:h-[60px] bg-white/10 relative overflow-hidden rounded-full mt-2">
          <div className="absolute top-0 left-0 w-full h-[25px] bg-white rounded-full animate-[line-drop_2.2s_cubic-bezier(0.77,0,0.175,1)_infinite]" />
        </div>

      </div>
    </div>
  );
};
