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
    <div ref={marqueeRef} className="fw-reveal w-full mt-16 md:mt-24 py-16 overflow-hidden relative border-y border-[#0a0a0b]/12 bg-gradient-to-r from-[#f8f9fa] to-[#f4f5f7] opacity-0">
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />

      <div className="marquee-content flex items-center whitespace-nowrap" style={{ width: 'fit-content' }}>
        {displayItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center mx-10 md:mx-20">
            {item.type === 'logo' ? (
              <img src={item.value} alt="Experience Logo" className="h-10 md:h-12 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            ) : (
              <span className="font-mono text-[12px] md:text-sm uppercase tracking-[0.18em] text-[#0a0a0b]/80 font-medium">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
