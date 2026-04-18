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
  const testimonialAnimation = siteConfig.animation.sectionAnimations.testimonials;
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
    if (!isActive || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        const nextIndex = (activeIndex + 1) % testimonials.length;
        changeTestimonial(nextIndex);
      }
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [isActive, isAnimating, activeIndex, testimonials.length]);

  // Entrance
  useEffect(() => {
    if (!isActive) return;

    // Delay scroll trigger initialization to ensure parent container completely finishes its entry transition
    let ctx: gsap.Context;
    const initTimer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Subtle floating animation for the subtle quote icon
        gsap.to('.quote-mark', {
          y: -5,
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
  }, [isActive]);

  const changeTestimonial = (index: number) => {
    if (testimonials.length === 0) return;
    if (isAnimating || index === activeIndex) return;

     // When disabled from dashboard, switch testimonial content instantly with no transition.
     if (!testimonialAnimation.enabled || testimonialAnimation.style === 'none') {
      setActiveIndex(index);
      return;
    }

    setIsAnimating(true);

    if (!contentRef.current) {
      setActiveIndex(index);
      setIsAnimating(false);
      return;
    }

    gsap.killTweensOf(contentRef.current);

    const getEnterVars = () => {
      if (testimonialAnimation.style === 'fade') {
        return { y: 0, opacity: 1, filter: 'blur(0px)', rotationX: 0, scale: 1, duration: 0.8, ease: 'power2.out' };
      }
      if (testimonialAnimation.style === 'slide-up' || testimonialAnimation.style === 'fade-up') {
        return { y: 0, opacity: 1, filter: 'blur(0px)', rotationX: 0, scale: 1, duration: 1, ease: 'power3.out' };
      }
      if (testimonialAnimation.style === 'zoom') {
        return { y: 0, opacity: 1, filter: 'blur(0px)', rotationX: 0, scale: 1, duration: 1.05, ease: 'expo.out' };
      }
      if (testimonialAnimation.style === 'stagger' || testimonialAnimation.style === 'creative') {
        return { y: 0, opacity: 1, filter: 'blur(0px)', rotationX: 0, scale: 1, duration: 1.2, ease: 'expo.out' };
      }
      return { y: 0, opacity: 1, filter: 'blur(0px)', rotationX: 0, scale: 1, duration: 1.4, ease: 'power4.out' };
    };

    const getExitVars = () => {
      if (testimonialAnimation.style === 'fade') {
        return { y: 0, opacity: 0, filter: 'blur(4px)', rotationX: 0, scale: 1, duration: 0.42, ease: 'power2.in' };
      }
      if (testimonialAnimation.style === 'slide-up' || testimonialAnimation.style === 'fade-up') {
        return { y: -36, opacity: 0, filter: 'blur(6px)', rotationX: 0, scale: 1, duration: 0.5, ease: 'power3.in' };
      }
      if (testimonialAnimation.style === 'zoom') {
        return { y: -20, opacity: 0, filter: 'blur(8px)', rotationX: 0, scale: 0.92, duration: 0.55, ease: 'power3.in' };
      }
      if (testimonialAnimation.style === 'stagger' || testimonialAnimation.style === 'creative') {
        return { y: -18, opacity: 0, filter: 'blur(8px)', rotationX: 10, scale: 0.96, duration: 0.6, ease: 'power3.in' };
      }
      return { y: -20, opacity: 0, filter: 'blur(8px)', rotationX: 10, scale: 1, duration: 0.7, ease: 'power3.in' };
    };

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index);

        const enterVars = getEnterVars();

        gsap.fromTo(
          contentRef.current,
          {
            y: testimonialAnimation.style === 'slide-up' || testimonialAnimation.style === 'fade-up' ? 44 : 20,
            opacity: 0,
            filter: 'blur(8px)',
            rotationX: -10,
            scale: testimonialAnimation.style === 'zoom' ? 0.9 : 1,
            transformOrigin: 'center center',
          },
          { ...enterVars, onComplete: () => setIsAnimating(false) }
        );
      }
    });

    tl.to(contentRef.current, {
      ...getExitVars(),
      transformOrigin: 'center center',
    });
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
