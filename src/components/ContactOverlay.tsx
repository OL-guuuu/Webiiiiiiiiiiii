import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ContactOverlayProps {
  progress: number;
}

export const ContactOverlay: React.FC<ContactOverlayProps> = ({ progress }) => {
  const { siteConfig } = useSiteConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const socialCardsRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2,
        }
      );

      // Animate paragraph with stagger
      gsap.fromTo(
        paragraphRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.4,
        }
      );

      // Animate form
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      // Animate social cards with stagger
      gsap.fromTo(
        '.social-card',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.1,
          delay: 0.8,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSocialCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      scale: 1.05,
      y: -8,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleSocialCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('hello@studio.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0A0A0A] px-4 md:px-8"
      style={{ opacity: progress }}
    >
      <div className="w-full max-w-[1200px]">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <h1
            ref={headingRef}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6"
            style={{ letterSpacing: '-2.5%' }}
          >
            Got plans? Let's turn them
            <br />
            into something real.
          </h1>
          <p
            ref={paragraphRef}
            className="text-base md:text-lg text-gray-400 max-w-2xl"
          >
            Tell us what's on your mind — a product, a brand, an idea half-sketched on a napkin. We read every message.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Info */}
          <div ref={formRef} className="space-y-6">
            {/* Direct Contact */}
            <div className="bg-[#ECEEF2] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Direct
                </span>
                <div className="w-9 h-9 bg-[#030213] rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>

              <div className="space-y-5">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.5 8.5c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z" />
                      <path d="M8.5 5.5v5M6 8h5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[5%] text-gray-600 mb-1">
                      Phone
                    </p>
                    <p className="text-base font-medium text-gray-900">+49 211 84 73 00</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2.67 4l5.33 3.33L13.33 4" />
                      <rect x="1" y="3" width="14" height="10" rx="1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-[5%] text-gray-600 mb-1">
                      Email
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href="mailto:hello@studio.com"
                        className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors"
                      >
                        hello@studio.com
                      </a>
                      <button
                        onClick={copyEmail}
                        className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors group"
                        title="Copy email"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-gray-600 group-hover:text-gray-900"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 flex-shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 2v12M2 8h12" />
                      <circle cx="8" cy="8" r="6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[5%] text-gray-600 mb-1">
                      Office
                    </p>
                    <p className="text-base font-medium text-gray-900 leading-tight">
                      Königsallee 27
                      <br />
                      40212 Düsseldorf, Germany
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mt-6 pt-6 border-t border-black/7">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00BC7D] rounded-full" />
                  <p className="text-sm text-gray-600">
                    Available for new projects · Mon–Fri
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white border border-black/10 rounded-2xl p-6">
              <p className="text-xs font-medium uppercase tracking-[14%] text-gray-600 mb-2">
                Response time
              </p>
              <p className="text-lg font-medium text-gray-900 mb-3">Within 24 hours</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every inquiry is read by a partner — no auto-replies, no funnels.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white border border-black/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1" style={{ letterSpacing: '-2.5%' }}>
                  Send us a message
                </h2>
                <p className="text-sm text-gray-600">
                  Fill in a few details — we'll get back to you shortly.
                </p>
              </div>
              <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                01 / Form
              </span>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-3.5 py-2.5 bg-[#F3F3F5] border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    placeholder="jane@framer.com"
                    className="w-full px-3.5 py-2.5 bg-[#F3F3F5] border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Subject</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 bg-[#F3F3F5] border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your new idea…"
                  className="w-full px-3.5 py-3 bg-[#F3F3F5] border border-transparent rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-300 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-600">
                  By sending, you agree to our{' '}
                  <a href="#" className="underline hover:text-gray-900">
                    privacy policy
                  </a>
                  .
                </p>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#030213] text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  Submit
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Media Section */}
        <div ref={socialCardsRef} className="mt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600 block mb-2">
                02 / Channels
              </span>
              <h2 className="text-3xl font-semibold text-white" style={{ letterSpacing: '-2.5%' }}>
                Find us elsewhere
              </h2>
            </div>
            <p className="text-sm text-gray-600 max-w-md hidden md:block">
              Pick the channel that suits you. Hover a card to see it come alive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Instagram */}
            <div
              className="social-card bg-white border border-black/10 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Follow
                </span>
                <div className="w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECEEF2] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Instagram</p>
                  <p className="text-xs text-gray-600">@studio.work</p>
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div
              className="social-card bg-white border border-black/10 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Connect
                </span>
                <div className="w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECEEF2] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">LinkedIn</p>
                  <p className="text-xs text-gray-600">/in/studio</p>
                </div>
              </div>
            </div>

            {/* X */}
            <div
              className="social-card bg-black border border-white/20 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-white/70">
                  Follow
                </span>
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">X</p>
                  <p className="text-xs text-white/70">@studio</p>
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div
              className="social-card bg-white border border-black/10 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Code
                </span>
                <div className="w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECEEF2] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">GitHub</p>
                  <p className="text-xs text-gray-600">/studio</p>
                </div>
              </div>
            </div>

            {/* Dribbble */}
            <div
              className="social-card bg-white border border-black/10 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Shots
                </span>
                <div className="w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECEEF2] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-5.38c-3.72-.38-6.44-1.57-8.79-3.42m-2.3 5.84c2.3-1.1 4.1-2.9 5.3-5.4m-7.3 1.3c1.5-2.3 2.5-5.1 2.5-8.1" stroke="white" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Dribbble</p>
                  <p className="text-xs text-gray-600">/studio</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div
              className="social-card bg-white border border-black/10 rounded-2xl p-6 cursor-pointer"
              onMouseEnter={handleSocialCardHover}
              onMouseLeave={handleSocialCardLeave}
              onClick={copyEmail}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-[14%] text-gray-600">
                  Say Hi
                </span>
                <div className="w-8 h-8 bg-white border border-black/10 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECEEF2] rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">hello@studio.com</p>
                  <p className="text-xs text-gray-600">{copiedEmail ? 'Copied!' : 'Tap to copy'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};