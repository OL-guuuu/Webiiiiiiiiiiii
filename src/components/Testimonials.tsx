import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getButtonClass } from './designSystem';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsProps {
  isActive?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ isActive = true }) => {
  const { siteConfig } = useSiteConfig();
  const testimonials = siteConfig.testimonials.filter((item) => item.visible);
  const dsComponents = siteConfig.designSystem.components;
  const testimonialMotion = siteConfig.animation.sections.testimonials;
  const motionSystem = siteConfig.animation.system;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (activeIndex < testimonials.length) return;
    setActiveIndex(0);
  }, [activeIndex, testimonials.length]);

  // Added Autoplay functionality
  useEffect(() => {
    if (!isActive || testimonials.length <= 1 || !testimonialMotion.enabled) return;

    const presetScale = motionSystem.preset === 'snappy' ? 0.85 : motionSystem.preset === 'cinematic' ? 1.15 : 1;
    const intervalMs = Math.max(1500, testimonialMotion.autoPlayMs * presetScale);
    const interval = setInterval(() => {
      if (!isAnimating) {
        const nextIndex = (activeIndex + 1) % testimonials.length;
        changeTestimonial(nextIndex);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeIndex, isActive, isAnimating, motionSystem.preset, testimonialMotion.autoPlayMs, testimonialMotion.enabled, testimonials.length]);

  // Entrance
  useEffect(() => {
    if (!isActive) return;

    // Delay scroll trigger initialization to ensure parent container completely finishes its entry transition
    let ctx: gsap.Context;
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Subtle floating animation for the subtle quote icon
        const floatStrength = 4 + testimonialMotion.floatIntensity * 10;
        gsap.to('.quote-mark', {
          y: -floatStrength,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }, containerRef);
    }, 1200);

    return () => {
      clearTimeout(initTimer);
      if (ctx) ctx.revert();
    };
  }, [isActive, testimonialMotion.floatIntensity]);

  const changeTestimonial = (index: number) => {
    if (testimonials.length === 0) return;
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);

    if (!contentRef.current) {
      setActiveIndex(index);
      setIsAnimating(false);
      return;
    }

    gsap.killTweensOf(contentRef.current);

    const transition = testimonialMotion.transitionStyle;
    const durationScale =
      Math.max(0.6, Math.min(1.7, motionSystem.intensity)) *
      (motionSystem.preset === 'snappy' ? 0.8 : motionSystem.preset === 'cinematic' ? 1.2 : 1);
    const resolvedEase = motionSystem.easing;
    const exitConfig =
      transition === 'slide'
        ? {
            x: -40,
            opacity: 0,
            filter: 'blur(6px)',
            duration: Math.max(0.2, 0.55 * durationScale),
            ease: resolvedEase,
          }
        : transition === 'flip'
          ? {
              rotationY: 30,
              opacity: 0,
              duration: Math.max(0.2, 0.55 * durationScale),
              ease: resolvedEase,
              transformOrigin: 'center center',
            }
          : {
              y: -20,
              opacity: 0,
              filter: 'blur(8px)',
              rotationX: 10,
              transformOrigin: 'center center',
              duration: Math.max(0.2, 0.7 * durationScale),
              ease: resolvedEase,
            };

    const enterFrom =
      transition === 'slide'
        ? { x: 40, opacity: 0, filter: 'blur(8px)' }
        : transition === 'flip'
          ? { rotationY: -26, opacity: 0, scale: 0.96, transformOrigin: 'center center' }
          : { y: 24, opacity: 0, filter: 'blur(10px)', rotationX: -10, transformOrigin: 'center center' };

    const enterTo =
      transition === 'flip'
        ? { rotationY: 0, opacity: 1, scale: 1, duration: Math.max(0.3, 1.1 * durationScale), ease: resolvedEase }
        : {
            ...(transition === 'slide' ? { x: 0 } : { y: 0, rotationX: 0 }),
            opacity: 1,
            filter: 'blur(0px)',
            duration: Math.max(0.3, 1.05 * durationScale),
            ease: resolvedEase,
          };

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    tl.to(contentRef.current, exitConfig);
    tl.add(() => setActiveIndex(index));
    tl.fromTo(contentRef.current, enterFrom, enterTo, '<');
  };

  const activeT = testimonials[activeIndex] ?? testimonials[0];

  if (!activeT) {
    return null;
  }

  return (
    <div ref={containerRef} className="fw-reveal w-full mt-24 md:mt-32 pt-8 pb-16 relative flex flex-col items-center justify-center">
      
      {/* Avatars Carousel - Top */}
      <div className="flex items-center justify-center gap-5 md:gap-8 mb-6 z-10 h-24">
        {testimonials.map((t, i) => {
          const isActive = i === activeIndex;
          return (
            <div 
              key={t.id} 
              onClick={() => changeTestimonial(i)}
              className={`relative cursor-pointer transition-all duration-[1s] ease-[cubic-bezier(0.19,1,0.22,1)] rounded-[8px] flex-shrink-0 ${
                isActive 
                  ? 'w-16 h-16 md:w-20 md:h-20 z-20 scale-100 shadow-sys-soft-light ring-[1px] ring-black/5' 
                  : 'w-12 h-12 md:w-14 md:h-14 z-0 scale-90 opacity-50 hover:opacity-90 hover:scale-95'
              }`}
            >
              {/* Sleek outer gradient ring for active state */}
              <div className={`absolute inset-0 rounded-[8px] transition-all duration-[1s] ease-out ${
                isActive 
                  ? 'p-[3px] bg-gradient-to-tr from-[#0a0a0b]/80 via-gray-300 to-[#0a0a0b]/90' 
                  : 'p-0 bg-transparent'
              }`}>
                <div className={`w-full h-full rounded-[8px] overflow-hidden bg-[#f4f5f7] ${isActive ? 'border-[3px] border-[#f4f5f7]' : ''}`}>
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-full h-full object-cover transition-all duration-700" 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area (Fades & Slides) */}
      <div ref={contentRef} className="flex flex-col items-center z-10 w-full max-w-3xl md:max-w-4xl lg:max-w-5xl px-8 text-center relative">
        
        {/* Title & Name */}
        <div className="text-center flex flex-col items-center mb-8 md:mb-12 mt-6">
          <h4 className="font-sans text-xl md:text-2xl font-medium tracking-tight text-[#0a0a0b]">
            {activeT.name}
          </h4>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-[#0a0a0b]/60 uppercase mt-3">
            {activeT.title}
          </p>
        </div>

        {/* Quote text with graphical quotes */}
        <div className="relative w-full px-4 sm:px-12">
          {/* Left Quote Graphic */}
          <div 
            className="absolute -top-12 md:-top-16 -left-2 md:-left-8 text-[5rem] md:text-[10rem] font-serif leading-none text-[#0a0a0b]/5 select-none pointer-events-none quote-mark"
            style={{ transformOrigin: 'top left' }}
          >
            &ldquo;
          </div>
          
          <h2 className="relative z-10 font-sans text-[1.4rem] leading-snug md:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-[#0a0a0b] md:leading-[1.25] text-balance py-2">
            {activeT.quote}
          </h2>

          {/* Right Quote Graphic */}
          <div 
            className="absolute -bottom-16 md:-bottom-24 -right-2 md:-right-8 text-[5rem] md:text-[10rem] font-serif leading-none text-[#0a0a0b]/5 select-none pointer-events-none quote-mark"
            style={{ transformOrigin: 'bottom right' }}
          >
            &rdquo;
          </div>
        </div>
      </div>

      {/* Pagination dots below quote */}
      <div className="flex items-center gap-4 mt-16 md:mt-24 z-10">
        {testimonials.map((_, i) => (
          <button 
            key={i}
            onClick={() => changeTestimonial(i)}
            className={getButtonClass(
              dsComponents.testimonialsPaginationButtonVariant,
              'light',
              'icon',
              'group h-8 w-8 md:h-9 md:w-9 p-0 focus:outline-none',
            )}
            aria-label={`Go to testimonial ${i + 1}`}
          >
            <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-700 ease-out border ${
              i === activeIndex 
                ? 'bg-current border-transparent opacity-90 scale-[1.08]' 
                : 'bg-transparent border-current/35 group-hover:border-current/60 opacity-80'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};
