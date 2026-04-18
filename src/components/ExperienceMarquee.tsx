import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ExperienceMarqueeProps {
  isActive?: boolean;
}

export const ExperienceMarquee: React.FC<ExperienceMarqueeProps> = ({ isActive = true }) => {
  const { siteConfig } = useSiteConfig();
  const items = siteConfig.experienceMarquee.filter((item) => item.visible);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !marqueeRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to('.marquee-content', {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, [isActive, items.length]);

  if (items.length === 0) return null;

  // Duplicate items to ensure smooth infinite scrolling
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div ref={marqueeRef} className="fw-reveal w-full mt-16 md:mt-24 py-12 overflow-hidden relative border-y border-[#0a0a0b]/10 opacity-0">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#f4f5f7] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#f4f5f7] to-transparent z-10 pointer-events-none" />
      
      <div className="marquee-content flex items-center whitespace-nowrap" style={{ width: 'fit-content' }}>
        {displayItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center mx-8 md:mx-16">
            {item.type === 'logo' ? (
              <img src={item.value} alt="Experience Logo" className="h-8 md:h-10 object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            ) : (
              <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#0a0a0b]/70">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
