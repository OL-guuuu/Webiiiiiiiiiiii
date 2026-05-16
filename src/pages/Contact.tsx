import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getButtonClass, getCardClass, getScaledRem } from '../components/designSystem';
import { AdvancedNavbar } from '../components/AdvancedNavbar';
import { sendMessage, type MessageData } from '../utils/apiClient';
import { validateMessage, sanitizeMessageData } from '../utils/messageValidator';

interface ContactCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  action: string;
  color: string;
  hoverColor: string;
}

const iconSize = 24;

// Icon mapping for contact cards
const iconMap: Record<string, React.ReactNode> = {
  linkedin: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  behance: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11C9.43 11 11 9.43 11 7.5S9.43 4 7.5 4H2v8h5.5zM2 20h6c2.21 0 4-1.79 4-4s-1.79-4-4-4H2v8zm16.5-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c1.53 0 2.84-.97 3.34-2.34l-1.73-1.01c-.32.55-.93.85-1.61.85-.99 0-1.79-.78-1.79-1.75s.8-1.75 1.79-1.75c.57 0 1.08.26 1.41.67l1.71-1.05C20.06 9.7 18.5 8.5 16.5 8.5c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.35 0 2.54-.67 3.26-1.68l-1.71-1.01c-.35.33-.84.52-1.35.52-1.02 0-1.85-.83-1.85-1.85s.83-1.85 1.85-1.85c.66 0 1.24.35 1.57.87l1.71-1.05C20.06 9.7 18.5 8.5 16.5 8.5zM22 20h-5v-1.5h5V20z" />
    </svg>
  ),
  facebook: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  dribbble: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
  ),
  youtube: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  email: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  phone: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.0 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  location: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  globe: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  github: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  figma: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-3 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
  ),
  mail: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  cv: (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
};

const Contact: React.FC = () => {
  const { siteConfig } = useSiteConfig();
  const { persistentUI, contactPage } = siteConfig;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Build contact cards from siteConfig.contactPage
  const contactCards: ContactCard[] = useMemo(() => {
    return contactPage.contactCards
      .filter(card => card.visible)
      .map(card => ({
        id: card.id,
        title: card.title,
        subtitle: card.subtitle,
        icon: iconMap[card.icon] || iconMap.mail,
        href: card.href,
        action: card.action,
        color: card.color,
        hoverColor: card.hoverColor,
      }));
  }, [contactPage.contactCards]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );
    }

    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
      );
    }

    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
    }

    const sidebar = containerRef.current.querySelector('.contact-sidebar');
    if (sidebar) {
      gsap.fromTo(
        sidebar,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.social-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 1,
        }
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardHover = (card: HTMLElement, isEntering: boolean, color: string, hoverColor: string) => {
    if (isEntering) {
      gsap.to(card, {
        scale: 1.05,
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
        backgroundColor: color,
        borderColor: color,
      });
      
      const iconContainer = card.querySelector('.card-icon');
      if (iconContainer) {
        gsap.to(iconContainer, {
          backgroundColor: 'rgba(255,255,255,0.2)',
          duration: 0.3,
        });
        const svg = iconContainer.querySelector('svg');
        if (svg) {
          gsap.to(svg, {
            color: '#ffffff',
            duration: 0.3,
          });
        }
      }
      
      const content = card.querySelector('.card-content');
      if (content) {
        const title = content.querySelector('h3');
        const subtitle = content.querySelector('p');
        if (title) gsap.to(title, { color: '#ffffff', duration: 0.3 });
        if (subtitle) gsap.to(subtitle, { color: 'rgba(255,255,255,0.8)', duration: 0.3 });
      }

      const header = card.querySelector('.card-header');
      if (header) {
        const action = header.querySelector('span');
        const arrow = header.querySelector('svg');
        if (action) gsap.to(action, { color: 'rgba(255,255,255,0.9)', duration: 0.3 });
        if (arrow) gsap.to(arrow, { color: '#ffffff', stroke: '#ffffff', duration: 0.3 });
      }
      
      gsap.to(card, {
        boxShadow: `0 16px 32px -8px ${color}40, 0 4px 12px -2px ${color}20`,
        duration: 0.4,
      });
    } else {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        backgroundColor: 'transparent',
        borderColor: 'rgba(0,0,0,0.08)',
      });
      
      const iconContainer = card.querySelector('.card-icon');
      if (iconContainer) {
        gsap.to(iconContainer, {
          backgroundColor: '#F3F4F6',
          duration: 0.3,
        });
        const svg = iconContainer.querySelector('svg');
        if (svg) {
          gsap.to(svg, {
            color: color,
            duration: 0.3,
          });
        }
      }
      
      const content = card.querySelector('.card-content');
      if (content) {
        const title = content.querySelector('h3');
        const subtitle = content.querySelector('p');
        if (title) gsap.to(title, { color: '#000000', duration: 0.3 });
        if (subtitle) gsap.to(subtitle, { color: '#6B7280', duration: 0.3 });
      }

      const header = card.querySelector('.card-header');
      if (header) {
        const action = header.querySelector('span');
        const arrow = header.querySelector('svg');
        if (action) gsap.to(action, { color: '#6B7280', duration: 0.3 });
        if (arrow) gsap.to(arrow, { color: '#9CA3AF', stroke: '#9CA3AF', duration: 0.3 });
      }
      
      gsap.to(card, {
        boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        duration: 0.4,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateMessage(formData);
    if (!validation.isValid) {
      setSubmitStatus('error');
      setSubmitMessage(Object.values(validation.errors).join('\n'));
      return;
    }

    // Sanitize data
    const sanitizedData = sanitizeMessageData(formData);

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await sendMessage(sanitizedData);
      
      if (response.success) {
        setSubmitStatus('success');
        setSubmitMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.error || 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!persistentUI) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white"
      data-surface="base"
    >
      {/* Navigation */}
      <AdvancedNavbar isLightMode={true} />

      {/* Main Content */}
      <main className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1152px] mx-auto">
          {/* Hero Section */}
          <div className="mb-8 md:mb-12 lg:mb-16">
            <h1
              ref={titleRef}
              className="fw-header-text opacity-0 mb-4 md:mb-6"
              style={{
                color: '#000000',
                fontSize: `clamp(${getScaledRem(siteConfig.designSystem.theme.displayTitleSizeRem * 1.05, siteConfig.designSystem.theme.headingScale)}, 15vw, ${getScaledRem(siteConfig.designSystem.theme.displayTitleSizeRem * 1.9, siteConfig.designSystem.theme.headingScale)})`,
                lineHeight: 0.9,
                letterSpacing: `${siteConfig.designSystem.theme.headingLetterSpacingEm - 0.01}em`,
                fontWeight: Math.min(400, Math.max(300, siteConfig.designSystem.theme.headingWeight - 40)),
              }}
            >
              {contactPage.heroTitleLine1}
              <br />
              {contactPage.heroTitleLine2}
            </h1>
            <p
              ref={subtitleRef}
              className="text-sm md:text-base lg:text-lg text-gray-600 max-w-[576px] leading-relaxed"
            >
              {contactPage.heroSubtitle}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8 md:mb-12 lg:mb-16" />

          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-16">
            {/* Sidebar */}
            <div className="contact-sidebar lg:col-span-4 space-y-4 md:space-y-6">
              {/* Direct Contact Card */}
              <div className={`p-4 md:p-6 rounded-2xl ${getCardClass('card-2', 'light')}`} style={{ borderColor: 'rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-black flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">{contactPage.directContactTitle}</span>
                </div>

                <div className="space-y-4 md:space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1 flex-shrink-0 text-gray-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.0 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1 text-gray-500">{contactPage.phoneLabel}</p>
                      <p className="text-sm font-medium text-gray-900">{contactPage.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1 flex-shrink-0 text-gray-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider mb-1 text-gray-500">{contactPage.emailLabel}</p>
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${contactPage.emailAddress}`} className="text-sm font-medium hover:underline text-gray-900">{contactPage.emailAddress}</a>
                        <button onClick={() => navigator.clipboard.writeText(contactPage.emailAddress)} className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-colors bg-gray-100 hover:bg-gray-200">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-1 flex-shrink-0 text-gray-500">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider mb-1 text-gray-500">{contactPage.officeLabel}</p>
                      <p className="text-sm font-medium leading-relaxed text-gray-900">
                        {contactPage.officeAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm text-gray-600">{contactPage.availabilityText}</p>
                  </div>
                </div>
              </div>

              {/* Response Time Card - Hidden on mobile */}
              <div className={`hidden lg:block p-6 rounded-2xl border ${getCardClass('card-2', 'light')}`} style={{ borderColor: 'rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-2 text-gray-500">{contactPage.responseTimeLabel}</p>
                <p className="text-lg font-semibold mb-2 text-gray-900">{contactPage.responseTimeValue}</p>
                <p className="text-sm leading-relaxed text-gray-600">{contactPage.responseTimeDescription}</p>
              </div>
            </div>

            {/* Form Section */}
            <div ref={formRef} className="lg:col-span-8">
              <div className={`p-4 md:p-6 lg:p-8 rounded-2xl ${getCardClass('card-2', 'light')}`} style={{ borderColor: 'rgba(0,0,0,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 md:mb-8 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: '#000000' }}>{contactPage.formTitle}</h2>
                    <p className="text-sm text-gray-500">{contactPage.formSubtitle}</p>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">01 / Form</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">{contactPage.formNameLabel}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={contactPage.formNamePlaceholder} className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">{contactPage.formEmailLabel}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={contactPage.formEmailPlaceholder} className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">{contactPage.formSubjectLabel}</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder={contactPage.formSubjectPlaceholder} className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">{contactPage.formMessageLabel}</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder={contactPage.formMessagePlaceholder} rows={5} className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors resize-none bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900" required />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <p className="text-xs text-gray-500">By sending, you agree to our <a href={contactPage.formPrivacyLink} className="underline text-gray-700">{contactPage.formPrivacyText}</a>.</p>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 md:px-8 py-3 md:py-3.5 rounded-xl bg-black text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
                          </svg>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          {contactPage.formSubmitButton}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Status Message */}
                  {submitStatus !== 'idle' && (
                    <div className={`mt-4 p-4 rounded-xl text-sm ${
                      submitStatus === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Social Channels Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider mb-2 block text-gray-400">{contactPage.socialSectionLabel}</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold" style={{ color: '#000000' }}>{contactPage.socialSectionTitle}</h2>
              </div>
              <p className="text-sm max-w-[384px] text-gray-500">{contactPage.socialSectionDescription}</p>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {contactCards.map((card) => (
                <a
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-card group relative p-4 md:p-6 rounded-2xl border transition-all duration-400 ${getCardClass('card-2', 'light')}`}
                  onMouseEnter={(e) => handleCardHover(e.currentTarget, true, card.color, card.hoverColor)}
                  onMouseLeave={(e) => handleCardHover(e.currentTarget, false, card.color, card.hoverColor)}
                  style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <div className="card-header flex items-center justify-between mb-4 md:mb-6">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 group-hover:text-white/90 transition-colors duration-300">{card.action}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-gray-100 group-hover:bg-white/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors duration-300">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="card-content flex items-center gap-3">
                    <div className="card-icon w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: '#F3F4F6' }}>
                      <div style={{ color: card.color }}>{card.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold mb-0.5 transition-colors duration-300" style={{ color: '#000000' }}>{card.title}</h3>
                      <p className="text-xs text-gray-500 transition-colors duration-300">{card.subtitle}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;