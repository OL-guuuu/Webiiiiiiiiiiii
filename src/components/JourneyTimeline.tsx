import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/SiteConfigContext';

gsap.registerPlugin(ScrollTrigger);

interface JourneyTimelineProps {
  isActive?: boolean;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ isActive = true }) => {
  const { siteConfig } = useSiteConfig();
  const events = siteConfig.journeyTimeline.filter((item) => item.visible);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.timeline-event');
      elements.forEach((el: any, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isActive, events.length]);

  if (events.length === 0) return null;

  return (
    <div ref={containerRef} className="fw-reveal w-full max-w-4xl mx-auto mt-24 md:mt-32 px-6">
      <div className="text-center mb-16">
        <h3 className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-[#0a0a0b]/60 mb-2">
          Experience
        </h3>
        <h2 className="font-sans text-3xl md:text-4xl font-medium tracking-tight text-[#0a0a0b]">
          Journey & Timeline
        </h2>
      </div>

      <div className="relative border-l border-[#0a0a0b]/10 ml-4 md:ml-8 space-y-12 pb-8">
        {events.map((event, index) => (
          <div key={event.id} className="timeline-event relative pl-8 md:pl-12">
            <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#0a0a0b] ring-4 ring-[#f4f5f7]" />
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
              <h4 className="font-sans text-xl md:text-2xl font-medium tracking-tight text-[#0a0a0b]">
                {event.role}
              </h4>
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#0a0a0b]/50 mt-1 md:mt-0 mt-1 md:ml-4">
                {event.date}
              </span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0a0a0b]/70 mb-3">
              {event.title}
            </div>
            <p className="font-sans text-[#0a0a0b]/60 text-sm md:text-base max-w-2xl leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
