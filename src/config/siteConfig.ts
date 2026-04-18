export type SiteSection = 'home' | 'about' | 'projects' | 'testimonials' | 'articles';

export type SiteButtonVariant = 'button-1' | 'button-2' | 'button-3';
export type SiteCardVariant = 'card-1' | 'card-2' | 'card-3';
export type SiteGlassVariant = 'glass-1' | 'glass-2' | 'glass-3';
export type SiteCursorAnimationMode =
  | 'fluid'
  | 'aura'
  | 'orbit'
  | 'comet'
  | 'ripple'
  | 'spark'
  | 'beam'
  | 'plasma';

export const SITE_SOCIAL_ICON_KEYS = [
  'behance',
  'linkedin',
  'instagram',
  'github',
  'twitter',
  'facebook',
  'youtube',
  'dribbble',
  'figma',
  'globe',
  'mail',
] as const;

export type SiteSocialIconKey = (typeof SITE_SOCIAL_ICON_KEYS)[number];

export const SITE_BUTTON_VARIANTS: SiteButtonVariant[] = ['button-1', 'button-2', 'button-3'];
export const SITE_CARD_VARIANTS: SiteCardVariant[] = ['card-1', 'card-2', 'card-3'];
export const SITE_GLASS_VARIANTS: SiteGlassVariant[] = ['glass-1', 'glass-2', 'glass-3'];

export interface SiteNavItem {
  id: string;
  label: string;
  section: SiteSection;
  visible: boolean;
}

export interface SiteProject {
  id: string;
  title: string;
  tags: string;
  img: string;
  behance: string;
  live: string;
  visible: boolean;
}

export interface SiteTestimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatar: string;
  visible: boolean;
}

export interface SiteFooterLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface SiteSocialLink extends SiteFooterLink {
  icon: SiteSocialIconKey;
}

export type SiteContentStatus = 'draft' | 'published' | 'scheduled';

export interface SiteArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  status: SiteContentStatus;
  readingMinutes: number;
  featured: boolean;
  visible: boolean;
  videoUrl: string;
}

export interface SiteVideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  platform: 'youtube' | 'vimeo' | 'other';
  durationLabel: string;
  publishedAt: string;
  status: SiteContentStatus;
  featured: boolean;
  visible: boolean;
}

export interface SiteCursorConfig {
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  COLOR_UPDATE_SPEED: number;
  SHADING: boolean;
  RAINBOW_MODE: boolean;
  COLOR: string;
  AUTO_CONTRAST: boolean;
}

export interface SiteCursorAuraConfig {
  color: string;
  sizePx: number;
  blurPx: number;
  intensity: number;
  smoothing: number;
}

export interface SiteCursorOrbitConfig {
  color: string;
  orbCount: number;
  orbSizePx: number;
  blurPx: number;
  opacity: number;
  followStrength: number;
  falloff: number;
}

export interface SiteCursorCometConfig {
  color: string;
  headSizePx: number;
  tailLength: number;
  blurPx: number;
  opacity: number;
  followStrength: number;
}

export interface SiteCursorRippleConfig {
  color: string;
  ringSizePx: number;
  ringWidthPx: number;
  lifeMs: number;
  spawnDistancePx: number;
  opacity: number;
}

export interface SiteCursorSparkConfig {
  color: string;
  particleCount: number;
  particleSizePx: number;
  spreadPx: number;
  lifeMs: number;
  emissionRate: number;
}

export interface SiteCursorBeamConfig {
  color: string;
  widthPx: number;
  heightPx: number;
  blurPx: number;
  opacity: number;
  lag: number;
}

export interface SiteCursorPlasmaConfig {
  colorA: string;
  colorB: string;
  sizePx: number;
  blurPx: number;
  opacity: number;
  smoothing: number;
}

export type SiteRhythmSetting = 'tight' | 'balanced' | 'linger';
export type SiteTextSequenceStyle = 'typewriter' | 'beam' | 'slice';
export type SiteAboutCardStyle = 'stack' | 'orbit' | 'slide';
export type SiteProjectCardStyle = 'tilt' | 'drift' | 'rise';
export type SiteTestimonialTransitionStyle = 'fade' | 'slide' | 'flip';
export type SiteSkillDisplayMode = 'rain' | 'tiles';

export interface SiteAboutAnimationSettings {
  enabled: boolean;
  textSequenceStyle: SiteTextSequenceStyle;
  cardEntranceStyle: SiteAboutCardStyle;
  textRhythm: SiteRhythmSetting;
  certificationRhythm: SiteRhythmSetting;
  skillMode: SiteSkillDisplayMode;
}

export interface SiteProjectsAnimationSettings {
  enabled: boolean;
  cardEntranceStyle: SiteProjectCardStyle;
  gridDepth: SiteRhythmSetting;
  hoverParallax: boolean;
}

export interface SiteTestimonialsAnimationSettings {
  enabled: boolean;
  transitionStyle: SiteTestimonialTransitionStyle;
  autoPlayMs: number;
  floatIntensity: number;
}

export interface SiteSectionAnimationConfig {
  about: SiteAboutAnimationSettings;
  projects: SiteProjectsAnimationSettings;
  testimonials: SiteTestimonialsAnimationSettings;
}

export interface SiteVisibilityConfig {
  globalFrameOverlay: boolean;
  cursorAnimation: boolean;
  introOverlay: boolean;
  scene05Overlay: boolean;
  persistentUI: boolean;
  navigationLogo: boolean;
  navigationMenu: boolean;
  musicToggle: boolean;
  letsTalkButton: boolean;
  experienceMarqueeSection: boolean;
  journeyTimelineSection: boolean;
  featuredWork: boolean;
  featuredHeader: boolean;
  featuredProjectsGrid: boolean;
  featuredViewAllButton: boolean;
  testimonialsSection: boolean;
  featuredCtaSection: boolean;
  footer: boolean;
  footerEmail: boolean;
  footerSocialLinks: boolean;
  footerLegalLinks: boolean;
  footerNavLinks: boolean;
  footerOffice: boolean;
}

export interface SiteCinematicScrollConfig {
  wheelIntensity: number;
  maxWheelDelta: number;
  smoothDurationMs: number;
  momentumDamping: number;
  touchMultiplier: number;
  keyboardStep: number;
}

export interface SiteCinematicSequenceConfig {
  skipScene06Exit: boolean;
  scene06PauseMs: number;
  scroll: SiteCinematicScrollConfig;
}

export interface SiteGlobalFrameConfig {
  topOffsetMobilePx: number;
  topOffsetDesktopPx: number;
  bottomOffsetMobilePx: number;
  bottomOffsetDesktopPx: number;
  sideOffsetMobilePx: number;
  sideOffsetDesktopPx: number;
  topRadiusMobilePx: number;
  topRadiusDesktopPx: number;
  bottomRadiusPx: number;
  matteColor: string;
}

export interface SiteButtonStylePreset {
  radiusPx: number;
  borderWidthPx: number;
  darkBackground: string;
  darkBorder: string;
  darkText: string;
  darkHoverBackground: string;
  lightBackground: string;
  lightBorder: string;
  lightText: string;
  lightHoverBackground: string;
}

export interface SiteCardStylePreset {
  radiusPx: number;
  borderWidthPx: number;
  darkBackground: string;
  lightBackground: string;
  darkBorder: string;
  lightBorder: string;
  darkShadowOpacity: number;
  lightShadowOpacity: number;
}

export interface SiteTimelineEvent {
  id: string;
  title: string;
  role: string;
  date: string;
  description: string;
  visible: boolean;
}

export interface SiteExperienceMarqueeItem {
  id: string;
  type: 'text' | 'logo';
  value: string;
  visible: boolean;
}

export interface SiteScene05LogoItem {
  id: string;
  name: string;
  logoSrc: string;
  href: string;
  visible: boolean;
}

export interface SiteScene05Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  logoSrc: string;
  visible: boolean;
}

export interface SiteConfig {
  introText: string;
  featured: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    caseStudyLabel: string;
    liveLabel: string;
    viewAllLabel: string;
    ctaTitleLine1: string;
    ctaTitleLine2: string;
    ctaDescription: string;
    ctaButtonText: string;
    ctaButtonHref: string;
  };
  projects: SiteProject[];
  experienceMarquee: SiteExperienceMarqueeItem[];
  journeyTimeline: SiteTimelineEvent[];
  testimonials: SiteTestimonial[];
  scene05: {
    badge: string;
    name: string;
    role: string;
    portraitImage: string;
    portraitAlt: string;
    portraitCaption: string;
    visionTitle: string;
    visionText: string;
    storyTitle: string;
    storyParagraphs: string[];
    learningLogosTitle: string;
    learningLogos: SiteScene05LogoItem[];
    skillsTitle: string;
    skills: string[];
    certificationsTitle: string;
    certifications: string[];
    credentialButtonLabel: string;
    featuredCertifications: SiteScene05Certification[];
    companyLogosTitle: string;
    companyLogos: SiteScene05LogoItem[];
    aiTitle: string;
    aiText: string;
    aiTags: string[];
    actionLabel: string;
    actionHref: string;
    animations?: {
      enabled: boolean;
      textRevealStyle: 'none' | 'fade-up' | 'cinematic' | 'glitch';
      cardEntranceStyle: 'none' | 'stack' | 'stagger' | 'creative';
    };
  };
  persistentUI: {
    logoAlt: string;
    navItems: SiteNavItem[];
    letsTalkLabel: string;
    letsTalkHref: string;
    musicSrc: string;
    musicVolume: number;
  };
  footer: {
    email: string;
    copyrightText: string;
    officeTitle: string;
    officeAddress: string;
    socialLinks: SiteSocialLink[];
    legalLinks: SiteFooterLink[];
    navLinks: SiteFooterLink[];
  };
  articlesPage: {
    title: string;
    subtitle: string;
    description: string;
    latestArticlesLabel: string;
    allTopicsLabel: string;
    searchPlaceholder: string;
    continueReadingLabel: string;
    minReadLabel: string;
    byAuthorPrefix: string;
    articleNotFoundTitle: string;
    articleNotFoundDescription: string;
    backToArticlesLabel: string;
    featuredArticleLabel: string;
    relatedVideoLabel: string;
    openVideoLabel: string;
    watchVideoLabel: string;
    noThumbnailLabel: string;
    noResultsTitle: string;
    noResultsDescription: string;
    previousPageLabel: string;
    nextPageLabel: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterInputPlaceholder: string;
    newsletterButtonLabel: string;
    videosSectionTitle: string;
    videosSectionDescription: string;
  };
  articles: SiteArticle[];
  videos: SiteVideoItem[];
  designSystem: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      onPrimaryColor: string;
      onSecondaryColor: string;
      headingScale: number;
      displayTitleSizeRem: number;
      sectionTitleSizeRem: number;
      bodyTextSizeRem: number;
      headingWeight: number;
      headingLetterSpacingEm: number;
      bodyLineHeight: number;
      buttonRadius: number;
      buttonBorderWidth: number;
      buttonShadowOpacity: number;
      cardRadius: number;
      cardBorderWidth: number;
      cardBlurPx: number;
      cardShadowOpacity: number;
      glassTintColor: string;
      glassBorderColor: string;
    };
    components: {
      globalGlassVariant: SiteGlassVariant;
      navigationGlassVariant: SiteGlassVariant;
      introCardVariant: SiteCardVariant;
      navigationShellCardVariant: SiteCardVariant;
      featuredProjectCardVariant: SiteCardVariant;
      scene05CardVariant: SiteCardVariant;
      featuredProjectButtonVariant: SiteButtonVariant;
      featuredViewAllButtonVariant: SiteButtonVariant;
      featuredCtaButtonVariant: SiteButtonVariant;
      persistentLetsTalkButtonVariant: SiteButtonVariant;
      musicToggleButtonVariant: SiteButtonVariant;
      scene05ActionButtonVariant: SiteButtonVariant;
      testimonialsPaginationButtonVariant: SiteButtonVariant;
    };
    componentStyles: {
      buttons: Record<SiteButtonVariant, SiteButtonStylePreset>;
      cards: Record<SiteCardVariant, SiteCardStylePreset>;
    };
  };
  animation: {
    activeCursorAnimation: SiteCursorAnimationMode;
    cursor: SiteCursorConfig;
    aura: SiteCursorAuraConfig;
    orbit: SiteCursorOrbitConfig;
    comet: SiteCursorCometConfig;
    ripple: SiteCursorRippleConfig;
    spark: SiteCursorSparkConfig;
    beam: SiteCursorBeamConfig;
    plasma: SiteCursorPlasmaConfig;
    sections: SiteSectionAnimationConfig;
  };
  cinematicSequence: SiteCinematicSequenceConfig;
  globalFrame: SiteGlobalFrameConfig;
  visibility: SiteVisibilityConfig;
}

export const SITE_CONFIG_STORAGE_KEY = 'portfolio.site-config.v1';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  introText:
    'I design thoughtful digital products and cinematic user experiences that connect user needs with business success through AI.',
  featured: {
    titleLine1: 'Featured',
    titleLine2: 'Work',
    description:
      'A selection of immersive digital experiences created for ambitious brands and forward thinking teams.',
    caseStudyLabel: 'Case Study',
    liveLabel: 'Live App',
    viewAllLabel: 'View All Projects',
    ctaTitleLine1: 'Take your product',
    ctaTitleLine2: 'to the next level',
    ctaDescription:
      "Gain complete visibility over your digital experience. Let's design intuitive, engaging, and high-performing interfaces that drive real business outcomes.",
    ctaButtonText: 'Start a project',
    ctaButtonHref: 'mailto:hello@example.com',
  },
  projects: [
    {
      id: 'project-1',
      title: 'Oryzo AI',
      tags: 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
      img: '/frames/scene-02-desk-focus/ezgif-frame-001.jpg',
      behance: '#',
      live: '#',
      visible: true,
    },
    {
      id: 'project-2',
      title: 'Of The Oak',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
      img: '/frames/scene-04/ezgif-frame-001.jpg',
      behance: '#',
      live: '#',
      visible: true,
    },
    {
      id: 'project-3',
      title: 'Devin AI',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      img: '/frames/scene-03-screen-entry/ezgif-frame-001.jpg',
      behance: '#',
      live: '#',
      visible: true,
    },
    {
      id: 'project-4',
      title: 'Porsche: Dream Machine',
      tags: 'CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO',
      img: '/frames/scene- 05/ezgif-frame-001.jpg',
      behance: '#',
      live: '#',
      visible: true,
    },
  ],
  experienceMarquee: [
    { id: 'mq-1', type: 'text', value: 'UX Design - IxDF', visible: true },
    { id: 'mq-2', type: 'text', value: 'Webflow Certified Expert', visible: true },
    { id: 'mq-3', type: 'text', value: '100+ Happy Clients', visible: true },
    { id: 'mq-4', type: 'text', value: 'Digital Marketing - Google', visible: true },
    { id: 'mq-5', type: 'text', value: 'Top Rated Plus - Upwork', visible: true }
  ],
  journeyTimeline: [
    {
      id: 'jt-1',
      title: 'Cinematic Studio',
      role: 'Founder & Lead Dev',
      date: '2023 - Present',
      description: 'Building immersive web experiences bringing cinematic design and WebGL technologies to life for clients.',
      visible: true
    },
    {
      id: 'jt-2',
      title: 'Creative Agency X',
      role: 'Frontend Engineer',
      date: '2021 - 2023',
      description: 'Developed award-winning landing pages and portfolios using React, GSAP, and Three.js.',
      visible: true
    },
    {
      id: 'jt-3',
      title: 'Digital Bootcamp',
      role: 'UI/UX Design Student',
      date: '2020 - 2021',
      description: 'Studied core UX principles and front-end development, culminating in my first creative portfolio.',
      visible: true
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Alice Pang',
      title: 'Principal at Purpose Built Ventures',
      quote:
        'Project-based hiring allows me the flexibility to book great creatives and freelancers quickly for our portfolio companies to deliver on project needs.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      visible: true,
    },
    {
      id: 'testimonial-2',
      name: 'John Doe',
      title: 'Creative Director at Studio X',
      quote:
        'Working with Oussama was an absolute game changer. The level of cinematic detail and performant code delivered was beyond our highest expectations.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      visible: true,
    },
    {
      id: 'testimonial-3',
      name: 'Sarah Jenkins',
      title: 'Founder of TechNova',
      quote:
        'A true visionary. He perfectly blended 3D and web technologies to create a digital experience that our users are still talking about today.',
      avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
      visible: true,
    },
  ],
  scene05: {
    badge: 'ABOUT ME',
    name: 'Oussama Lassoued',
    role: 'UX/UI Designer & AI Product Builder',
    portraitImage: '/frames/scene- 05/ezgif-frame-001.jpg',
    portraitAlt: 'Portrait image',
    portraitCaption: 'Cinematic product designer focused on clarity and measurable outcomes.',
    visionTitle: 'Vision & Value',
    visionText:
      'I design interfaces that are not only visually refined, but also intentionally structured. My goal is to build digital products that feel natural to users and highly profitable for businesses.',
    storyTitle: 'What I Actually Bring',
    storyParagraphs: [
      'I work across the full product arc: research, information architecture, interaction modeling, design systems, and production-quality frontend implementation.',
      'My process starts with business intent and user behavior, then translates both into interfaces that feel clear, measurable, and commercially strong.',
      'I focus on decision clarity: every screen should reduce friction, support conversion, and preserve a strong visual identity at the same time.',
    ],
    learningLogosTitle: 'Certification Partners',
    learningLogos: [
      {
        id: 'learn-1',
        name: 'Google',
        logoSrc: 'https://logo.clearbit.com/google.com',
        href: 'https://grow.google/certificates/',
        visible: true,
      },
      {
        id: 'learn-2',
        name: 'IBM',
        logoSrc: 'https://logo.clearbit.com/ibm.com',
        href: 'https://www.ibm.com/training',
        visible: true,
      },
      {
        id: 'learn-3',
        name: 'HarvardX',
        logoSrc: 'https://logo.clearbit.com/harvard.edu',
        href: 'https://pll.harvard.edu/',
        visible: true,
      },
      {
        id: 'learn-4',
        name: 'Coursera',
        logoSrc: 'https://logo.clearbit.com/coursera.org',
        href: 'https://www.coursera.org/',
        visible: true,
      },
    ],
    skillsTitle: 'Core Skills',
    skills: [
      'UX Research & Strategy',
      'Design Systems & Libs',
      'Interaction & Prototyping',
      'Product Thinking',
    ],
    certificationsTitle: 'Certifications',
    certifications: [
      'Google UX Design Prof.',
      'HarvardX Leadership',
      'Generative AI for Everyone',
    ],
    credentialButtonLabel: 'View Credential',
    featuredCertifications: [
      {
        id: 'cert-1',
        title: 'Google UX Design Professional Certificate',
        issuer: 'Google',
        year: '2024',
        credentialUrl: '#',
        logoSrc: 'https://logo.clearbit.com/google.com',
        visible: true,
      },
      {
        id: 'cert-2',
        title: 'IBM AI Engineering Professional Certificate',
        issuer: 'IBM',
        year: '2024',
        credentialUrl: '#',
        logoSrc: 'https://logo.clearbit.com/ibm.com',
        visible: true,
      },
      {
        id: 'cert-3',
        title: 'HarvardX Leadership and Communication',
        issuer: 'HarvardX',
        year: '2023',
        credentialUrl: '#',
        logoSrc: 'https://logo.clearbit.com/harvard.edu',
        visible: true,
      },
    ],
    companyLogosTitle: 'Companies I Collaborated With',
    companyLogos: [
      {
        id: 'company-1',
        name: 'Upwork',
        logoSrc: 'https://logo.clearbit.com/upwork.com',
        href: 'https://www.upwork.com/',
        visible: true,
      },
      {
        id: 'company-2',
        name: 'Webflow',
        logoSrc: 'https://logo.clearbit.com/webflow.com',
        href: 'https://webflow.com/',
        visible: true,
      },
      {
        id: 'company-3',
        name: 'Framer',
        logoSrc: 'https://logo.clearbit.com/framer.com',
        href: 'https://www.framer.com/',
        visible: true,
      },
      {
        id: 'company-4',
        name: 'Notion',
        logoSrc: 'https://logo.clearbit.com/notion.so',
        href: 'https://www.notion.so/',
        visible: true,
      },
    ],
    aiTitle: 'Designing with AI in Mind',
    aiText:
      'My focus is shifting toward AI-driven products. I believe AI succeeds through well-designed interactions using it as a tool-not a gimmick-to enhance clarity, efficiency, and commercial viability.',
    aiTags: ['AI Workflows', 'Figma', 'Claude Code', 'Systems'],
    actionLabel: 'Connect With Me',
    actionHref: '#',
  },
  persistentUI: {
    logoAlt: 'Oussama Lassoued',
    navItems: [
      { id: 'nav-home', label: 'Home', section: 'home', visible: true },
      { id: 'nav-about', label: 'About Me', section: 'about', visible: true },
      { id: 'nav-projects', label: 'Projects', section: 'projects', visible: true },
      { id: 'nav-testimonials', label: 'Testimonials', section: 'testimonials', visible: true },
      { id: 'nav-articles', label: 'Articles', section: 'articles', visible: true },
    ],
    letsTalkLabel: "Let's Talk",
    letsTalkHref: 'mailto:hello@example.com',
    musicSrc: '/audio/for_website_1.mp3',
    musicVolume: 0.3,
  },
  footer: {
    email: 'hello@example.com',
    copyrightText: 'Oussama Lassoued All rights reserved.',
    officeTitle: 'Oussama Office',
    officeAddress: '123 Cinematic Blvd,\nParis, France',
    socialLinks: [
      { id: 'social-behance', label: 'Behance', href: '#', icon: 'behance', visible: true },
      { id: 'social-linkedin', label: 'LinkedIn', href: '#', icon: 'linkedin', visible: true },
      { id: 'social-instagram', label: 'Instagram', href: '#', icon: 'instagram', visible: true },
    ],
    legalLinks: [
      { id: 'legal-terms', label: 'Terms of Service', href: '#', visible: true },
      { id: 'legal-privacy', label: 'Privacy Policy', href: '#', visible: true },
    ],
    navLinks: [
      { id: 'footer-nav-home', label: 'Home', href: '#home', visible: true },
      { id: 'footer-nav-about', label: 'About Me', href: '#about', visible: true },
      { id: 'footer-nav-projects', label: 'Projects', href: '#projects', visible: true },
      { id: 'footer-nav-testimonials', label: 'Testimonials', href: '#testimonials', visible: true },
      { id: 'footer-nav-articles', label: 'Articles', href: '#/articles', visible: true },
    ],
  },
  articlesPage: {
    title: 'Journal & Articles',
    subtitle: 'Insights on Product, UX, and AI',
    description:
      'A publishing space for case studies, product thinking, interface craft, and practical AI workflows.',
    latestArticlesLabel: 'Latest Articles',
    allTopicsLabel: 'All',
    searchPlaceholder: 'Search articles...',
    continueReadingLabel: 'Continue Reading',
    minReadLabel: 'min read',
    byAuthorPrefix: 'By',
    articleNotFoundTitle: 'Article Not Found',
    articleNotFoundDescription: 'This article was not found or is currently unpublished.',
    backToArticlesLabel: 'Back to all articles',
    featuredArticleLabel: 'Featured Article',
    relatedVideoLabel: 'Related Video',
    openVideoLabel: 'Open Video',
    watchVideoLabel: 'Watch Video',
    noThumbnailLabel: 'No thumbnail',
    noResultsTitle: 'No articles matched your search',
    noResultsDescription: 'Try another keyword or switch to another topic filter.',
    previousPageLabel: 'Previous',
    nextPageLabel: 'Next',
    newsletterTitle: "Don't miss a new article",
    newsletterDescription: 'Subscribe to the newsletter and get new articles as soon as they are published.',
    newsletterInputPlaceholder: 'Your email address',
    newsletterButtonLabel: 'Subscribe',
    videosSectionTitle: 'Video Publications',
    videosSectionDescription:
      'Short visual explainers, walkthroughs, and lessons published alongside written articles.',
  },
  articles: [
    {
      id: 'article-1',
      title: 'How I Structure Cinematic Product Interfaces',
      slug: 'how-i-structure-cinematic-product-interfaces',
      excerpt:
        'A practical framework for combining storytelling, conversion intent, and interaction depth in one coherent product interface.',
      content:
        'Designing cinematic interfaces is not about visual effects only. It starts with narrative hierarchy, then interaction timing, then content clarity.\n\nI design each section as a scene with one clear purpose: orientation, trust, proof, or action. The transition rhythm between scenes matters as much as the scene itself.\n\nWhen this structure is clear, users feel guided instead of overloaded.',
      coverImage: '/frames/scene-03-screen-entry/ezgif-frame-001.jpg',
      author: 'Oussama Lassoued',
      category: 'UX Strategy',
      tags: ['UX', 'Storytelling', 'Product Design'],
      publishedAt: '2026-04-10',
      status: 'published',
      readingMinutes: 6,
      featured: true,
      visible: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 'article-2',
      title: 'AI Workflows That Actually Save Design Time',
      slug: 'ai-workflows-that-actually-save-design-time',
      excerpt:
        'The exact AI workflow stack I use to shorten research, writing, and component ideation without sacrificing quality.',
      content:
        'AI can save hours, but only if the workflow is constrained.\n\nI use AI in three phases: research synthesis, draft generation, and variant exploration. I never use it as final authority. Instead, I keep one human quality pass before publishing anything.\n\nThis keeps speed high and quality stable.',
      coverImage: '/frames/scene-04/ezgif-frame-001.jpg',
      author: 'Oussama Lassoued',
      category: 'AI & Design',
      tags: ['AI', 'Workflow', 'Productivity'],
      publishedAt: '2026-04-06',
      status: 'published',
      readingMinutes: 5,
      featured: false,
      visible: true,
      videoUrl: '',
    },
  ],
  videos: [
    {
      id: 'video-1',
      title: 'Design System Decisions in Real Projects',
      description:
        'A short walkthrough of how token choices impact scale, speed, and consistency across product teams.',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: '/frames/scene-06/ezgif-frame-001.jpg',
      platform: 'youtube',
      durationLabel: '08:21',
      publishedAt: '2026-04-11',
      status: 'published',
      featured: true,
      visible: true,
    },
    {
      id: 'video-2',
      title: 'From Brief to Structured UX Narrative',
      description:
        'A practical method to transform messy stakeholder inputs into a focused user journey and clear scene flow.',
      videoUrl: 'https://vimeo.com/76979871',
      thumbnail: '/frames/scene-07/ezgif-frame-001.jpg',
      platform: 'vimeo',
      durationLabel: '05:47',
      publishedAt: '2026-04-08',
      status: 'published',
      featured: false,
      visible: true,
    },
  ],
  designSystem: {
    theme: {
      primaryColor: '#111217',
      secondaryColor: '#7A8192',
      onPrimaryColor: '#FFFFFF',
      onSecondaryColor: '#FFFFFF',
      headingScale: 1,
      displayTitleSizeRem: 8.4,
      sectionTitleSizeRem: 2.7,
      bodyTextSizeRem: 1.08,
      headingWeight: 610,
      headingLetterSpacingEm: -0.02,
      bodyLineHeight: 1.6,
      buttonRadius: 8,
      buttonBorderWidth: 1,
      buttonShadowOpacity: 0.1,
      cardRadius: 18,
      cardBorderWidth: 1,
      cardBlurPx: 18,
      cardShadowOpacity: 0.1,
      glassTintColor: 'rgba(18,18,20,0.5)',
      glassBorderColor: 'rgba(255,255,255,0.14)',
    },
    components: {
      globalGlassVariant: 'glass-2',
      navigationGlassVariant: 'glass-3',
      introCardVariant: 'card-1',
      navigationShellCardVariant: 'card-2',
      featuredProjectCardVariant: 'card-2',
      scene05CardVariant: 'card-1',
      featuredProjectButtonVariant: 'button-2',
      featuredViewAllButtonVariant: 'button-1',
      featuredCtaButtonVariant: 'button-1',
      persistentLetsTalkButtonVariant: 'button-1',
      musicToggleButtonVariant: 'button-3',
      scene05ActionButtonVariant: 'button-3',
      testimonialsPaginationButtonVariant: 'button-3',
    },
    componentStyles: {
      buttons: {
        'button-1': {
          radiusPx: 10,
          borderWidthPx: 1.2,
          darkBackground: '#111217',
          darkBorder: '#2a2e39',
          darkText: '#ffffff',
          darkHoverBackground: '#1f2431',
          lightBackground: '#111217',
          lightBorder: '#2a2e39',
          lightText: '#ffffff',
          lightHoverBackground: '#262d3d',
        },
        'button-2': {
          radiusPx: 10,
          borderWidthPx: 1,
          darkBackground: 'rgba(255,255,255,0.03)',
          darkBorder: '#7a8192',
          darkText: '#d2d7e2',
          darkHoverBackground: 'rgba(255,255,255,0.12)',
          lightBackground: 'rgba(255,255,255,0.45)',
          lightBorder: 'rgba(17,18,23,0.28)',
          lightText: '#111217',
          lightHoverBackground: 'rgba(17,18,23,0.14)',
        },
        'button-3': {
          radiusPx: 999,
          borderWidthPx: 1,
          darkBackground: 'rgba(255,255,255,0.12)',
          darkBorder: 'rgba(255,255,255,0.22)',
          darkText: '#ffffff',
          darkHoverBackground: 'rgba(255,255,255,0.2)',
          lightBackground: 'rgba(248,250,255,0.8)',
          lightBorder: 'rgba(17,18,23,0.18)',
          lightText: '#111217',
          lightHoverBackground: 'rgba(255,255,255,0.98)',
        },
      },
      cards: {
        'card-1': {
          radiusPx: 18,
          borderWidthPx: 1,
          darkBackground: 'rgba(255,255,255,0.06)',
          lightBackground: 'rgba(255,255,255,0.74)',
          darkBorder: 'rgba(255,255,255,0.12)',
          lightBorder: 'rgba(17,18,23,0.18)',
          darkShadowOpacity: 0.12,
          lightShadowOpacity: 0.08,
        },
        'card-2': {
          radiusPx: 20,
          borderWidthPx: 1,
          darkBackground: 'rgba(8,10,16,0.74)',
          lightBackground: 'rgba(240,245,255,0.68)',
          darkBorder: 'rgba(255,255,255,0.14)',
          lightBorder: 'rgba(17,18,23,0.2)',
          darkShadowOpacity: 0.14,
          lightShadowOpacity: 0.09,
        },
        'card-3': {
          radiusPx: 22,
          borderWidthPx: 1.2,
          darkBackground: 'rgba(5,6,11,0.86)',
          lightBackground: 'rgba(255,255,255,0.82)',
          darkBorder: 'rgba(255,255,255,0.18)',
          lightBorder: 'rgba(17,18,23,0.24)',
          darkShadowOpacity: 0.16,
          lightShadowOpacity: 0.1,
        },
      },
    },
  },
  animation: {
    activeCursorAnimation: 'fluid',
    cursor: {
      DENSITY_DISSIPATION: 2.2,
      VELOCITY_DISSIPATION: 6,
      PRESSURE: 0.18,
      CURL: 3,
      SPLAT_RADIUS: 0.27,
      SPLAT_FORCE: 5500,
      COLOR_UPDATE_SPEED: 2,
      SHADING: false,
      RAINBOW_MODE: false,
      COLOR: '#4F4F4F',
      AUTO_CONTRAST: true,
    },
    aura: {
      color: '#8ec9ff',
      sizePx: 360,
      blurPx: 46,
      intensity: 0.5,
      smoothing: 0.18,
    },
    orbit: {
      color: '#f3f5ff',
      orbCount: 6,
      orbSizePx: 22,
      blurPx: 10,
      opacity: 0.32,
      followStrength: 0.22,
      falloff: 0.84,
    },
    comet: {
      color: '#b5d8ff',
      headSizePx: 28,
      tailLength: 8,
      blurPx: 10,
      opacity: 0.34,
      followStrength: 0.28,
    },
    ripple: {
      color: '#e4ebff',
      ringSizePx: 110,
      ringWidthPx: 2,
      lifeMs: 720,
      spawnDistancePx: 26,
      opacity: 0.45,
    },
    spark: {
      color: '#b6fcff',
      particleCount: 16,
      particleSizePx: 3,
      spreadPx: 34,
      lifeMs: 520,
      emissionRate: 0.45,
    },
    beam: {
      color: '#c8d7ff',
      widthPx: 124,
      heightPx: 28,
      blurPx: 14,
      opacity: 0.3,
      lag: 0.2,
    },
    plasma: {
      colorA: '#8ec9ff',
      colorB: '#c6a8ff',
      sizePx: 240,
      blurPx: 42,
      opacity: 0.3,
      smoothing: 0.16,
    },
    sections: {
      about: {
        enabled: true,
        textSequenceStyle: 'beam',
        cardEntranceStyle: 'orbit',
        textRhythm: 'balanced',
        certificationRhythm: 'balanced',
        skillMode: 'rain',
      },
      projects: {
        enabled: true,
        cardEntranceStyle: 'tilt',
        gridDepth: 'balanced',
        hoverParallax: true,
      },
      testimonials: {
        enabled: true,
        transitionStyle: 'fade',
        autoPlayMs: 5200,
        floatIntensity: 0.6,
      },
    },
  },
  cinematicSequence: {
    skipScene06Exit: false,
    scene06PauseMs: 900,
    scroll: {
      wheelIntensity: 0.00005,
      maxWheelDelta: 48,
      smoothDurationMs: 680,
      momentumDamping: 0.86,
      touchMultiplier: 1.6,
      keyboardStep: 0.07,
    },
  },
  globalFrame: {
    topOffsetMobilePx: 60,
    topOffsetDesktopPx: 120,
    bottomOffsetMobilePx: 40,
    bottomOffsetDesktopPx: 80,
    sideOffsetMobilePx: 12,
    sideOffsetDesktopPx: 60,
    topRadiusMobilePx: 80,
    topRadiusDesktopPx: 160,
    bottomRadiusPx: 16,
    matteColor: '#0c0a08',
  },
  visibility: {
    globalFrameOverlay: true,
    cursorAnimation: true,
    introOverlay: true,
    scene05Overlay: true,
    persistentUI: true,
    navigationLogo: true,
    navigationMenu: true,
    musicToggle: true,
    letsTalkButton: true,
    experienceMarqueeSection: false,
    journeyTimelineSection: false,
    featuredWork: true,
    featuredHeader: true,
    featuredProjectsGrid: true,
    featuredViewAllButton: true,
    testimonialsSection: true,
    featuredCtaSection: true,
    footer: true,
    footerEmail: true,
    footerSocialLinks: true,
    footerLegalLinks: true,
    footerNavLinks: true,
    footerOffice: true,
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const asString = (value: unknown, fallback: string) => {
  return typeof value === 'string' ? value : fallback;
};

const asNumber = (value: unknown, fallback: number) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const asBoolean = (value: unknown, fallback: boolean) => {
  return typeof value === 'boolean' ? value : fallback;
};

const asButtonVariant = (value: unknown, fallback: SiteButtonVariant): SiteButtonVariant => {
  return typeof value === 'string' && SITE_BUTTON_VARIANTS.includes(value as SiteButtonVariant)
    ? (value as SiteButtonVariant)
    : fallback;
};

const asCardVariant = (value: unknown, fallback: SiteCardVariant): SiteCardVariant => {
  return typeof value === 'string' && SITE_CARD_VARIANTS.includes(value as SiteCardVariant)
    ? (value as SiteCardVariant)
    : fallback;
};

const asGlassVariant = (value: unknown, fallback: SiteGlassVariant): SiteGlassVariant => {
  return typeof value === 'string' && SITE_GLASS_VARIANTS.includes(value as SiteGlassVariant)
    ? (value as SiteGlassVariant)
    : fallback;
};

const asCursorAnimationMode = (
  value: unknown,
  fallback: SiteCursorAnimationMode,
): SiteCursorAnimationMode => {
  return typeof value === 'string' && ['fluid', 'aura', 'orbit', 'comet', 'ripple', 'spark', 'beam', 'plasma'].includes(value)
    ? (value as SiteCursorAnimationMode)
    : fallback;
};

const asRhythmSetting = (value: unknown, fallback: SiteRhythmSetting): SiteRhythmSetting => {
  return typeof value === 'string' && ['tight', 'balanced', 'linger'].includes(value)
    ? (value as SiteRhythmSetting)
    : fallback;
};

const asTextSequenceStyle = (value: unknown, fallback: SiteTextSequenceStyle): SiteTextSequenceStyle => {
  return typeof value === 'string' && ['typewriter', 'beam', 'slice'].includes(value)
    ? (value as SiteTextSequenceStyle)
    : fallback;
};

const asAboutCardStyle = (value: unknown, fallback: SiteAboutCardStyle): SiteAboutCardStyle => {
  return typeof value === 'string' && ['stack', 'orbit', 'slide'].includes(value)
    ? (value as SiteAboutCardStyle)
    : fallback;
};

const asProjectCardStyle = (value: unknown, fallback: SiteProjectCardStyle): SiteProjectCardStyle => {
  return typeof value === 'string' && ['tilt', 'drift', 'rise'].includes(value)
    ? (value as SiteProjectCardStyle)
    : fallback;
};

const asTestimonialTransitionStyle = (
  value: unknown,
  fallback: SiteTestimonialTransitionStyle,
): SiteTestimonialTransitionStyle => {
  return typeof value === 'string' && ['fade', 'slide', 'flip'].includes(value)
    ? (value as SiteTestimonialTransitionStyle)
    : fallback;
};

const asSkillDisplayMode = (value: unknown, fallback: SiteSkillDisplayMode): SiteSkillDisplayMode => {
  return typeof value === 'string' && ['rain', 'tiles'].includes(value)
    ? (value as SiteSkillDisplayMode)
    : fallback;
};

const asSocialIconKey = (value: unknown, fallback: SiteSocialIconKey): SiteSocialIconKey => {
  return typeof value === 'string' && SITE_SOCIAL_ICON_KEYS.includes(value as SiteSocialIconKey)
    ? (value as SiteSocialIconKey)
    : fallback;
};

const asContentStatus = (value: unknown, fallback: SiteContentStatus): SiteContentStatus => {
  return typeof value === 'string' && ['draft', 'published', 'scheduled'].includes(value)
    ? (value as SiteContentStatus)
    : fallback;
};

const asVideoPlatform = (value: unknown, fallback: SiteVideoItem['platform']): SiteVideoItem['platform'] => {
  return typeof value === 'string' && ['youtube', 'vimeo', 'other'].includes(value)
    ? (value as SiteVideoItem['platform'])
    : fallback;
};

const asBoundedNumber = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = asNumber(value, fallback);
  return Math.min(max, Math.max(min, parsed));
};

export const hydrateSiteConfig = (value: unknown): SiteConfig => {
  if (!isRecord(value)) return DEFAULT_SITE_CONFIG;

  const featured = isRecord(value.featured) ? value.featured : {};
  const scene05 = isRecord(value.scene05) ? value.scene05 : {};
  const persistentUI = isRecord(value.persistentUI) ? value.persistentUI : {};
  const footer = isRecord(value.footer) ? value.footer : {};
  const articlesPage = isRecord(value.articlesPage) ? value.articlesPage : {};
  const footerSocialRecord = isRecord(footer.socialLinks) ? footer.socialLinks : {};
  const footerSocialArray = Array.isArray(footer.socialLinks) ? footer.socialLinks : [];
  const designSystem = isRecord(value.designSystem) ? value.designSystem : {};
  const designTheme = isRecord(designSystem.theme) ? designSystem.theme : {};
  const designComponents = isRecord(designSystem.components) ? designSystem.components : {};
  const designComponentStyles = isRecord(designSystem.componentStyles)
    ? designSystem.componentStyles
    : {};
  const buttonStyles = isRecord(designComponentStyles.buttons) ? designComponentStyles.buttons : {};
  const cardStyles = isRecord(designComponentStyles.cards) ? designComponentStyles.cards : {};
  const animation = isRecord(value.animation) ? value.animation : {};
  const cursor = isRecord(animation.cursor) ? animation.cursor : {};
  const aura = isRecord(animation.aura) ? animation.aura : {};
  const orbit = isRecord(animation.orbit) ? animation.orbit : {};
  const comet = isRecord(animation.comet) ? animation.comet : {};
  const ripple = isRecord(animation.ripple) ? animation.ripple : {};
  const spark = isRecord(animation.spark) ? animation.spark : {};
  const beam = isRecord(animation.beam) ? animation.beam : {};
  const plasma = isRecord(animation.plasma) ? animation.plasma : {};
  const sections = isRecord(animation.sections) ? animation.sections : {};
  const aboutSection = isRecord(sections.about) ? sections.about : {};
  const projectsSection = isRecord(sections.projects) ? sections.projects : {};
  const testimonialsSection = isRecord(sections.testimonials) ? sections.testimonials : {};
  const cinematicSequence = isRecord(value.cinematicSequence) ? value.cinematicSequence : {};
  const cinematicScroll = isRecord(cinematicSequence.scroll) ? cinematicSequence.scroll : {};
  const globalFrame = isRecord(value.globalFrame) ? value.globalFrame : {};
  const visibility = isRecord(value.visibility) ? value.visibility : {};

  const projects = Array.isArray(value.projects)
    ? value.projects
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `project-${index + 1}`),
            title: asString(item.title, ''),
            tags: asString(item.tags, ''),
            img: asString(item.img, ''),
            behance: asString(item.behance, '#'),
            live: asString(item.live, '#'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteProject => !!item)
    : DEFAULT_SITE_CONFIG.projects;

  const testimonials = Array.isArray(value.testimonials)
    ? value.testimonials
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `testimonial-${index + 1}`),
            name: asString(item.name, ''),
            title: asString(item.title, ''),
            quote: asString(item.quote, ''),
            avatar: asString(item.avatar, ''),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteTestimonial => !!item)
    : DEFAULT_SITE_CONFIG.testimonials;

  const experienceMarquee = Array.isArray(value.experienceMarquee)
    ? value.experienceMarquee
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `marquee-${index + 1}`),
            type: asString(item.type, 'text') as 'logo' | 'text',
            value: asString(item.value, ''),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteExperienceMarqueeItem => !!item)
    : DEFAULT_SITE_CONFIG.experienceMarquee;

  const journeyTimeline = Array.isArray(value.journeyTimeline)
    ? value.journeyTimeline
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `timeline-${index + 1}`),
            title: asString(item.title, ''),
            role: asString(item.role, ''),
            date: asString(item.date, ''),
            description: asString(item.description, ''),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteTimelineEvent => !!item)
    : DEFAULT_SITE_CONFIG.journeyTimeline;

  const navItems = Array.isArray(persistentUI.navItems)
    ? persistentUI.navItems
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const section = asString(item.section, 'home') as SiteSection;
          if (!['home', 'about', 'projects', 'testimonials', 'articles'].includes(section)) return null;
          return {
            id: asString(item.id, `nav-${index + 1}`),
            label: asString(item.label, ''),
            section,
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteNavItem => !!item)
    : DEFAULT_SITE_CONFIG.persistentUI.navItems;

  const legalLinks = Array.isArray(footer.legalLinks)
    ? footer.legalLinks
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `legal-${index + 1}`),
            label: asString(item.label, ''),
            href: asString(item.href, '#'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteFooterLink => !!item)
    : DEFAULT_SITE_CONFIG.footer.legalLinks;

  const navLinks = Array.isArray(footer.navLinks)
    ? footer.navLinks
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `footer-nav-${index + 1}`),
            label: asString(item.label, ''),
            href: asString(item.href, '#'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteFooterLink => !!item)
    : DEFAULT_SITE_CONFIG.footer.navLinks;

  const defaultArticlesNavItem =
    DEFAULT_SITE_CONFIG.persistentUI.navItems.find((item) => item.section === 'articles') ?? {
      id: 'nav-articles',
      label: 'Articles',
      section: 'articles' as const,
      visible: true,
    };

  const navItemsWithArticles = (navItems.length > 0 ? navItems : DEFAULT_SITE_CONFIG.persistentUI.navItems).some(
    (item) => item.section === 'articles',
  )
    ? navItems.length > 0
      ? navItems
      : DEFAULT_SITE_CONFIG.persistentUI.navItems
    : [...(navItems.length > 0 ? navItems : DEFAULT_SITE_CONFIG.persistentUI.navItems), defaultArticlesNavItem];

  const defaultFooterArticlesLink =
    DEFAULT_SITE_CONFIG.footer.navLinks.find((link) => link.href.toLowerCase() === '#/articles') ?? {
      id: 'footer-nav-articles',
      label: 'Articles',
      href: '#/articles',
      visible: true,
    };

  const navLinksWithArticles = (navLinks.length > 0 ? navLinks : DEFAULT_SITE_CONFIG.footer.navLinks).some(
    (link) => link.href.toLowerCase() === '#/articles',
  )
    ? navLinks.length > 0
      ? navLinks
      : DEFAULT_SITE_CONFIG.footer.navLinks
    : [...(navLinks.length > 0 ? navLinks : DEFAULT_SITE_CONFIG.footer.navLinks), defaultFooterArticlesLink];

  const socialLinks = footerSocialArray.length > 0
    ? footerSocialArray
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `social-${index + 1}`),
            label: asString(item.label, `Social ${index + 1}`),
            href: asString(item.href, '#'),
            icon: asSocialIconKey(item.icon, 'globe'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter((item): item is SiteSocialLink => !!item)
    : [
        {
          id: 'social-behance',
          label: 'Behance',
          href: asString(footerSocialRecord.behance, '#'),
          icon: 'behance' as const,
          visible: true,
        },
        {
          id: 'social-linkedin',
          label: 'LinkedIn',
          href: asString(footerSocialRecord.linkedin, '#'),
          icon: 'linkedin' as const,
          visible: true,
        },
        {
          id: 'social-instagram',
          label: 'Instagram',
          href: asString(footerSocialRecord.instagram, '#'),
          icon: 'instagram' as const,
          visible: true,
        },
      ];

  const articles = Array.isArray(value.articles)
    ? value.articles
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const fallback = DEFAULT_SITE_CONFIG.articles[Math.min(index, DEFAULT_SITE_CONFIG.articles.length - 1)];
          return {
            id: asString(item.id, `article-${index + 1}`),
            title: asString(item.title, fallback?.title ?? ''),
            slug: asString(item.slug, `article-${index + 1}`),
            excerpt: asString(item.excerpt, fallback?.excerpt ?? ''),
            content: asString(item.content, fallback?.content ?? ''),
            coverImage: asString(item.coverImage, fallback?.coverImage ?? ''),
            author: asString(item.author, fallback?.author ?? ''),
            category: asString(item.category, fallback?.category ?? ''),
            tags: Array.isArray(item.tags)
              ? item.tags.map((tag) => asString(tag, '')).filter(Boolean)
              : (fallback?.tags ?? []),
            publishedAt: asString(item.publishedAt, fallback?.publishedAt ?? ''),
            status: asContentStatus(item.status, fallback?.status ?? 'draft'),
            readingMinutes: asBoundedNumber(item.readingMinutes, fallback?.readingMinutes ?? 5, 1, 120),
            featured: asBoolean(item.featured, fallback?.featured ?? false),
            visible: asBoolean(item.visible, fallback?.visible ?? true),
            videoUrl: asString(item.videoUrl, fallback?.videoUrl ?? ''),
          };
        })
        .filter((item): item is SiteArticle => !!item)
    : DEFAULT_SITE_CONFIG.articles;

  const videos = Array.isArray(value.videos)
    ? value.videos
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const fallback = DEFAULT_SITE_CONFIG.videos[Math.min(index, DEFAULT_SITE_CONFIG.videos.length - 1)];
          return {
            id: asString(item.id, `video-${index + 1}`),
            title: asString(item.title, fallback?.title ?? ''),
            description: asString(item.description, fallback?.description ?? ''),
            videoUrl: asString(item.videoUrl, fallback?.videoUrl ?? ''),
            thumbnail: asString(item.thumbnail, fallback?.thumbnail ?? ''),
            platform: asVideoPlatform(item.platform, fallback?.platform ?? 'other'),
            durationLabel: asString(item.durationLabel, fallback?.durationLabel ?? ''),
            publishedAt: asString(item.publishedAt, fallback?.publishedAt ?? ''),
            status: asContentStatus(item.status, fallback?.status ?? 'draft'),
            featured: asBoolean(item.featured, fallback?.featured ?? false),
            visible: asBoolean(item.visible, fallback?.visible ?? true),
          };
        })
        .filter((item): item is SiteVideoItem => !!item)
    : DEFAULT_SITE_CONFIG.videos;

  const skills = Array.isArray(scene05.skills)
    ? scene05.skills.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.skills;

  const certifications = Array.isArray(scene05.certifications)
    ? scene05.certifications.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.certifications;

  const storyParagraphs = Array.isArray(scene05.storyParagraphs)
    ? scene05.storyParagraphs.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.storyParagraphs;

  const learningLogos = Array.isArray(scene05.learningLogos)
    ? scene05.learningLogos
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `learn-${index + 1}`),
            name: asString(item.name, ''),
            logoSrc: asString(item.logoSrc, ''),
            href: asString(item.href, '#'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter(
          (item): item is SiteScene05LogoItem =>
            !!item && (item.name.length > 0 || item.logoSrc.length > 0),
        )
    : DEFAULT_SITE_CONFIG.scene05.learningLogos;

  const companyLogos = Array.isArray(scene05.companyLogos)
    ? scene05.companyLogos
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `company-${index + 1}`),
            name: asString(item.name, ''),
            logoSrc: asString(item.logoSrc, ''),
            href: asString(item.href, '#'),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter(
          (item): item is SiteScene05LogoItem =>
            !!item && (item.name.length > 0 || item.logoSrc.length > 0),
        )
    : DEFAULT_SITE_CONFIG.scene05.companyLogos;

  const featuredCertifications = Array.isArray(scene05.featuredCertifications)
    ? scene05.featuredCertifications
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `cert-${index + 1}`),
            title: asString(item.title, ''),
            issuer: asString(item.issuer, ''),
            year: asString(item.year, ''),
            credentialUrl: asString(item.credentialUrl, '#'),
            logoSrc: asString(item.logoSrc, ''),
            visible: asBoolean(item.visible, true),
          };
        })
        .filter(
          (item): item is SiteScene05Certification =>
            !!item && (item.title.length > 0 || item.issuer.length > 0),
        )
    : DEFAULT_SITE_CONFIG.scene05.featuredCertifications;

  const aiTags = Array.isArray(scene05.aiTags)
    ? scene05.aiTags.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.aiTags;

  return {
    introText: asString(value.introText, DEFAULT_SITE_CONFIG.introText),
    featured: {
      titleLine1: asString(featured.titleLine1, DEFAULT_SITE_CONFIG.featured.titleLine1),
      titleLine2: asString(featured.titleLine2, DEFAULT_SITE_CONFIG.featured.titleLine2),
      description: asString(featured.description, DEFAULT_SITE_CONFIG.featured.description),
      caseStudyLabel: asString(featured.caseStudyLabel, DEFAULT_SITE_CONFIG.featured.caseStudyLabel),
      liveLabel: asString(featured.liveLabel, DEFAULT_SITE_CONFIG.featured.liveLabel),
      viewAllLabel: asString(featured.viewAllLabel, DEFAULT_SITE_CONFIG.featured.viewAllLabel),
      ctaTitleLine1: asString(featured.ctaTitleLine1, DEFAULT_SITE_CONFIG.featured.ctaTitleLine1),
      ctaTitleLine2: asString(featured.ctaTitleLine2, DEFAULT_SITE_CONFIG.featured.ctaTitleLine2),
      ctaDescription: asString(featured.ctaDescription, DEFAULT_SITE_CONFIG.featured.ctaDescription),
      ctaButtonText: asString(featured.ctaButtonText, DEFAULT_SITE_CONFIG.featured.ctaButtonText),
      ctaButtonHref: asString(featured.ctaButtonHref, DEFAULT_SITE_CONFIG.featured.ctaButtonHref),
    },
    projects: projects.length > 0 ? projects : DEFAULT_SITE_CONFIG.projects,
    experienceMarquee: experienceMarquee.length > 0 ? experienceMarquee : DEFAULT_SITE_CONFIG.experienceMarquee,
    journeyTimeline: journeyTimeline.length > 0 ? journeyTimeline : DEFAULT_SITE_CONFIG.journeyTimeline,
    testimonials: testimonials.length > 0 ? testimonials : DEFAULT_SITE_CONFIG.testimonials,
    scene05: {
      badge: asString(scene05.badge, DEFAULT_SITE_CONFIG.scene05.badge),
      name: asString(scene05.name, DEFAULT_SITE_CONFIG.scene05.name),
      role: asString(scene05.role, DEFAULT_SITE_CONFIG.scene05.role),
      portraitImage: asString(scene05.portraitImage, DEFAULT_SITE_CONFIG.scene05.portraitImage),
      portraitAlt: asString(scene05.portraitAlt, DEFAULT_SITE_CONFIG.scene05.portraitAlt),
      portraitCaption: asString(scene05.portraitCaption, DEFAULT_SITE_CONFIG.scene05.portraitCaption),
      visionTitle: asString(scene05.visionTitle, DEFAULT_SITE_CONFIG.scene05.visionTitle),
      visionText: asString(scene05.visionText, DEFAULT_SITE_CONFIG.scene05.visionText),
      storyTitle: asString(scene05.storyTitle, DEFAULT_SITE_CONFIG.scene05.storyTitle),
      storyParagraphs:
        storyParagraphs.length > 0 ? storyParagraphs : DEFAULT_SITE_CONFIG.scene05.storyParagraphs,
      learningLogosTitle: asString(
        scene05.learningLogosTitle,
        DEFAULT_SITE_CONFIG.scene05.learningLogosTitle,
      ),
      learningLogos:
        learningLogos.length > 0 ? learningLogos : DEFAULT_SITE_CONFIG.scene05.learningLogos,
      skillsTitle: asString(scene05.skillsTitle, DEFAULT_SITE_CONFIG.scene05.skillsTitle),
      skills: skills.length > 0 ? skills : DEFAULT_SITE_CONFIG.scene05.skills,
      certificationsTitle: asString(
        scene05.certificationsTitle,
        DEFAULT_SITE_CONFIG.scene05.certificationsTitle,
      ),
      certifications: certifications.length > 0 ? certifications : DEFAULT_SITE_CONFIG.scene05.certifications,
      credentialButtonLabel: asString(
        scene05.credentialButtonLabel,
        DEFAULT_SITE_CONFIG.scene05.credentialButtonLabel,
      ),
      featuredCertifications:
        featuredCertifications.length > 0
          ? featuredCertifications
          : DEFAULT_SITE_CONFIG.scene05.featuredCertifications,
      companyLogosTitle: asString(
        scene05.companyLogosTitle,
        DEFAULT_SITE_CONFIG.scene05.companyLogosTitle,
      ),
      companyLogos:
        companyLogos.length > 0 ? companyLogos : DEFAULT_SITE_CONFIG.scene05.companyLogos,
      aiTitle: asString(scene05.aiTitle, DEFAULT_SITE_CONFIG.scene05.aiTitle),
      aiText: asString(scene05.aiText, DEFAULT_SITE_CONFIG.scene05.aiText),
      aiTags: aiTags.length > 0 ? aiTags : DEFAULT_SITE_CONFIG.scene05.aiTags,
      actionLabel: asString(scene05.actionLabel, DEFAULT_SITE_CONFIG.scene05.actionLabel),
      actionHref: asString(scene05.actionHref, DEFAULT_SITE_CONFIG.scene05.actionHref),
    },
    persistentUI: {
      logoAlt: asString(persistentUI.logoAlt, DEFAULT_SITE_CONFIG.persistentUI.logoAlt),
      navItems: navItemsWithArticles,
      letsTalkLabel: asString(persistentUI.letsTalkLabel, DEFAULT_SITE_CONFIG.persistentUI.letsTalkLabel),
      letsTalkHref: asString(persistentUI.letsTalkHref, DEFAULT_SITE_CONFIG.persistentUI.letsTalkHref),
      musicSrc: asString(persistentUI.musicSrc, DEFAULT_SITE_CONFIG.persistentUI.musicSrc),
      musicVolume: asNumber(persistentUI.musicVolume, DEFAULT_SITE_CONFIG.persistentUI.musicVolume),
    },
    footer: {
      email: asString(footer.email, DEFAULT_SITE_CONFIG.footer.email),
      copyrightText: asString(footer.copyrightText, DEFAULT_SITE_CONFIG.footer.copyrightText),
      officeTitle: asString(footer.officeTitle, DEFAULT_SITE_CONFIG.footer.officeTitle),
      officeAddress: asString(footer.officeAddress, DEFAULT_SITE_CONFIG.footer.officeAddress),
      socialLinks: socialLinks.length > 0 ? socialLinks : DEFAULT_SITE_CONFIG.footer.socialLinks,
      legalLinks: legalLinks.length > 0 ? legalLinks : DEFAULT_SITE_CONFIG.footer.legalLinks,
      navLinks: navLinksWithArticles,
    },
    articlesPage: {
      title: asString(articlesPage.title, DEFAULT_SITE_CONFIG.articlesPage.title),
      subtitle: asString(articlesPage.subtitle, DEFAULT_SITE_CONFIG.articlesPage.subtitle),
      description: asString(articlesPage.description, DEFAULT_SITE_CONFIG.articlesPage.description),
      latestArticlesLabel: asString(
        articlesPage.latestArticlesLabel,
        DEFAULT_SITE_CONFIG.articlesPage.latestArticlesLabel,
      ),
      allTopicsLabel: asString(
        articlesPage.allTopicsLabel,
        DEFAULT_SITE_CONFIG.articlesPage.allTopicsLabel,
      ),
      searchPlaceholder: asString(
        articlesPage.searchPlaceholder,
        DEFAULT_SITE_CONFIG.articlesPage.searchPlaceholder,
      ),
      continueReadingLabel: asString(
        articlesPage.continueReadingLabel,
        DEFAULT_SITE_CONFIG.articlesPage.continueReadingLabel,
      ),
      minReadLabel: asString(articlesPage.minReadLabel, DEFAULT_SITE_CONFIG.articlesPage.minReadLabel),
      byAuthorPrefix: asString(
        articlesPage.byAuthorPrefix,
        DEFAULT_SITE_CONFIG.articlesPage.byAuthorPrefix,
      ),
      articleNotFoundTitle: asString(
        articlesPage.articleNotFoundTitle,
        DEFAULT_SITE_CONFIG.articlesPage.articleNotFoundTitle,
      ),
      articleNotFoundDescription: asString(
        articlesPage.articleNotFoundDescription,
        DEFAULT_SITE_CONFIG.articlesPage.articleNotFoundDescription,
      ),
      backToArticlesLabel: asString(
        articlesPage.backToArticlesLabel,
        DEFAULT_SITE_CONFIG.articlesPage.backToArticlesLabel,
      ),
      featuredArticleLabel: asString(
        articlesPage.featuredArticleLabel,
        DEFAULT_SITE_CONFIG.articlesPage.featuredArticleLabel,
      ),
      relatedVideoLabel: asString(
        articlesPage.relatedVideoLabel,
        DEFAULT_SITE_CONFIG.articlesPage.relatedVideoLabel,
      ),
      openVideoLabel: asString(articlesPage.openVideoLabel, DEFAULT_SITE_CONFIG.articlesPage.openVideoLabel),
      watchVideoLabel: asString(
        articlesPage.watchVideoLabel,
        DEFAULT_SITE_CONFIG.articlesPage.watchVideoLabel,
      ),
      noThumbnailLabel: asString(
        articlesPage.noThumbnailLabel,
        DEFAULT_SITE_CONFIG.articlesPage.noThumbnailLabel,
      ),
      noResultsTitle: asString(articlesPage.noResultsTitle, DEFAULT_SITE_CONFIG.articlesPage.noResultsTitle),
      noResultsDescription: asString(
        articlesPage.noResultsDescription,
        DEFAULT_SITE_CONFIG.articlesPage.noResultsDescription,
      ),
      previousPageLabel: asString(
        articlesPage.previousPageLabel,
        DEFAULT_SITE_CONFIG.articlesPage.previousPageLabel,
      ),
      nextPageLabel: asString(articlesPage.nextPageLabel, DEFAULT_SITE_CONFIG.articlesPage.nextPageLabel),
      newsletterTitle: asString(
        articlesPage.newsletterTitle,
        DEFAULT_SITE_CONFIG.articlesPage.newsletterTitle,
      ),
      newsletterDescription: asString(
        articlesPage.newsletterDescription,
        DEFAULT_SITE_CONFIG.articlesPage.newsletterDescription,
      ),
      newsletterInputPlaceholder: asString(
        articlesPage.newsletterInputPlaceholder,
        DEFAULT_SITE_CONFIG.articlesPage.newsletterInputPlaceholder,
      ),
      newsletterButtonLabel: asString(
        articlesPage.newsletterButtonLabel,
        DEFAULT_SITE_CONFIG.articlesPage.newsletterButtonLabel,
      ),
      videosSectionTitle: asString(
        articlesPage.videosSectionTitle,
        DEFAULT_SITE_CONFIG.articlesPage.videosSectionTitle,
      ),
      videosSectionDescription: asString(
        articlesPage.videosSectionDescription,
        DEFAULT_SITE_CONFIG.articlesPage.videosSectionDescription,
      ),
    },
    articles: articles.length > 0 ? articles : DEFAULT_SITE_CONFIG.articles,
    videos: videos.length > 0 ? videos : DEFAULT_SITE_CONFIG.videos,
    designSystem: {
      theme: {
        primaryColor: asString(designTheme.primaryColor, DEFAULT_SITE_CONFIG.designSystem.theme.primaryColor),
        secondaryColor: asString(
          designTheme.secondaryColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.secondaryColor,
        ),
        onPrimaryColor: asString(
          designTheme.onPrimaryColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.onPrimaryColor,
        ),
        onSecondaryColor: asString(
          designTheme.onSecondaryColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.onSecondaryColor,
        ),
        headingScale: asBoundedNumber(
          designTheme.headingScale,
          DEFAULT_SITE_CONFIG.designSystem.theme.headingScale,
          0.7,
          1.8,
        ),
        displayTitleSizeRem: asBoundedNumber(
          designTheme.displayTitleSizeRem,
          DEFAULT_SITE_CONFIG.designSystem.theme.displayTitleSizeRem,
          2.6,
          12,
        ),
        sectionTitleSizeRem: asBoundedNumber(
          designTheme.sectionTitleSizeRem,
          DEFAULT_SITE_CONFIG.designSystem.theme.sectionTitleSizeRem,
          1,
          4,
        ),
        bodyTextSizeRem: asBoundedNumber(
          designTheme.bodyTextSizeRem,
          DEFAULT_SITE_CONFIG.designSystem.theme.bodyTextSizeRem,
          0.75,
          1.6,
        ),
        headingWeight: asBoundedNumber(
          designTheme.headingWeight,
          DEFAULT_SITE_CONFIG.designSystem.theme.headingWeight,
          300,
          800,
        ),
        headingLetterSpacingEm: asBoundedNumber(
          designTheme.headingLetterSpacingEm,
          DEFAULT_SITE_CONFIG.designSystem.theme.headingLetterSpacingEm,
          -0.12,
          0.2,
        ),
        bodyLineHeight: asBoundedNumber(
          designTheme.bodyLineHeight,
          DEFAULT_SITE_CONFIG.designSystem.theme.bodyLineHeight,
          1.1,
          2.2,
        ),
        buttonRadius: asBoundedNumber(
          designTheme.buttonRadius,
          DEFAULT_SITE_CONFIG.designSystem.theme.buttonRadius,
          2,
          48,
        ),
        buttonBorderWidth: asBoundedNumber(
          designTheme.buttonBorderWidth,
          DEFAULT_SITE_CONFIG.designSystem.theme.buttonBorderWidth,
          0.5,
          5,
        ),
        buttonShadowOpacity: asBoundedNumber(
          designTheme.buttonShadowOpacity,
          DEFAULT_SITE_CONFIG.designSystem.theme.buttonShadowOpacity,
          0,
          0.65,
        ),
        cardRadius: asBoundedNumber(
          designTheme.cardRadius,
          DEFAULT_SITE_CONFIG.designSystem.theme.cardRadius,
          4,
          64,
        ),
        cardBorderWidth: asBoundedNumber(
          designTheme.cardBorderWidth,
          DEFAULT_SITE_CONFIG.designSystem.theme.cardBorderWidth,
          0.5,
          5,
        ),
        cardBlurPx: asBoundedNumber(
          designTheme.cardBlurPx,
          DEFAULT_SITE_CONFIG.designSystem.theme.cardBlurPx,
          0,
          40,
        ),
        cardShadowOpacity: asBoundedNumber(
          designTheme.cardShadowOpacity,
          DEFAULT_SITE_CONFIG.designSystem.theme.cardShadowOpacity,
          0,
          0.8,
        ),
        glassTintColor: asString(
          designTheme.glassTintColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.glassTintColor,
        ),
        glassBorderColor: asString(
          designTheme.glassBorderColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.glassBorderColor,
        ),
      },
      components: {
        globalGlassVariant: asGlassVariant(
          designComponents.globalGlassVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.globalGlassVariant,
        ),
        navigationGlassVariant: asGlassVariant(
          designComponents.navigationGlassVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.navigationGlassVariant,
        ),
        introCardVariant: asCardVariant(
          designComponents.introCardVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.introCardVariant,
        ),
        navigationShellCardVariant: asCardVariant(
          designComponents.navigationShellCardVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.navigationShellCardVariant,
        ),
        featuredProjectCardVariant: asCardVariant(
          designComponents.featuredProjectCardVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.featuredProjectCardVariant,
        ),
        scene05CardVariant: asCardVariant(
          designComponents.scene05CardVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.scene05CardVariant,
        ),
        featuredProjectButtonVariant: asButtonVariant(
          designComponents.featuredProjectButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.featuredProjectButtonVariant,
        ),
        featuredViewAllButtonVariant: asButtonVariant(
          designComponents.featuredViewAllButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.featuredViewAllButtonVariant,
        ),
        featuredCtaButtonVariant: asButtonVariant(
          designComponents.featuredCtaButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.featuredCtaButtonVariant,
        ),
        persistentLetsTalkButtonVariant: asButtonVariant(
          designComponents.persistentLetsTalkButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.persistentLetsTalkButtonVariant,
        ),
        musicToggleButtonVariant: asButtonVariant(
          designComponents.musicToggleButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.musicToggleButtonVariant,
        ),
        scene05ActionButtonVariant: asButtonVariant(
          designComponents.scene05ActionButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.scene05ActionButtonVariant,
        ),
        testimonialsPaginationButtonVariant: asButtonVariant(
          designComponents.testimonialsPaginationButtonVariant,
          DEFAULT_SITE_CONFIG.designSystem.components.testimonialsPaginationButtonVariant,
        ),
      },
      componentStyles: {
        buttons: {
          'button-1': {
            radiusPx: asBoundedNumber(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].radiusPx,
              2,
              999,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].darkBackground,
            ),
            darkBorder: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].darkBorder,
            ),
            darkText: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].darkText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].darkText,
            ),
            darkHoverBackground: asString(
              isRecord(buttonStyles['button-1'])
                ? buttonStyles['button-1'].darkHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].darkHoverBackground,
            ),
            lightBackground: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].lightBackground,
            ),
            lightBorder: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].lightBorder,
            ),
            lightText: asString(
              isRecord(buttonStyles['button-1']) ? buttonStyles['button-1'].lightText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].lightText,
            ),
            lightHoverBackground: asString(
              isRecord(buttonStyles['button-1'])
                ? buttonStyles['button-1'].lightHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-1'].lightHoverBackground,
            ),
          },
          'button-2': {
            radiusPx: asBoundedNumber(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].radiusPx,
              2,
              999,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].darkBackground,
            ),
            darkBorder: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].darkBorder,
            ),
            darkText: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].darkText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].darkText,
            ),
            darkHoverBackground: asString(
              isRecord(buttonStyles['button-2'])
                ? buttonStyles['button-2'].darkHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].darkHoverBackground,
            ),
            lightBackground: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].lightBackground,
            ),
            lightBorder: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].lightBorder,
            ),
            lightText: asString(
              isRecord(buttonStyles['button-2']) ? buttonStyles['button-2'].lightText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].lightText,
            ),
            lightHoverBackground: asString(
              isRecord(buttonStyles['button-2'])
                ? buttonStyles['button-2'].lightHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-2'].lightHoverBackground,
            ),
          },
          'button-3': {
            radiusPx: asBoundedNumber(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].radiusPx,
              2,
              999,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].darkBackground,
            ),
            darkBorder: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].darkBorder,
            ),
            darkText: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].darkText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].darkText,
            ),
            darkHoverBackground: asString(
              isRecord(buttonStyles['button-3'])
                ? buttonStyles['button-3'].darkHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].darkHoverBackground,
            ),
            lightBackground: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].lightBackground,
            ),
            lightBorder: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].lightBorder,
            ),
            lightText: asString(
              isRecord(buttonStyles['button-3']) ? buttonStyles['button-3'].lightText : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].lightText,
            ),
            lightHoverBackground: asString(
              isRecord(buttonStyles['button-3'])
                ? buttonStyles['button-3'].lightHoverBackground
                : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.buttons['button-3'].lightHoverBackground,
            ),
          },
        },
        cards: {
          'card-1': {
            radiusPx: asBoundedNumber(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].radiusPx,
              4,
              80,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].darkBackground,
            ),
            lightBackground: asString(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].lightBackground,
            ),
            darkBorder: asString(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].darkBorder,
            ),
            lightBorder: asString(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].lightBorder,
            ),
            darkShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].darkShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].darkShadowOpacity,
              0,
              0.9,
            ),
            lightShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-1']) ? cardStyles['card-1'].lightShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-1'].lightShadowOpacity,
              0,
              0.9,
            ),
          },
          'card-2': {
            radiusPx: asBoundedNumber(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].radiusPx,
              4,
              80,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].darkBackground,
            ),
            lightBackground: asString(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].lightBackground,
            ),
            darkBorder: asString(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].darkBorder,
            ),
            lightBorder: asString(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].lightBorder,
            ),
            darkShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].darkShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].darkShadowOpacity,
              0,
              0.9,
            ),
            lightShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-2']) ? cardStyles['card-2'].lightShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-2'].lightShadowOpacity,
              0,
              0.9,
            ),
          },
          'card-3': {
            radiusPx: asBoundedNumber(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].radiusPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].radiusPx,
              4,
              80,
            ),
            borderWidthPx: asBoundedNumber(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].borderWidthPx : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].borderWidthPx,
              0.5,
              6,
            ),
            darkBackground: asString(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].darkBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].darkBackground,
            ),
            lightBackground: asString(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].lightBackground : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].lightBackground,
            ),
            darkBorder: asString(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].darkBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].darkBorder,
            ),
            lightBorder: asString(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].lightBorder : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].lightBorder,
            ),
            darkShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].darkShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].darkShadowOpacity,
              0,
              0.9,
            ),
            lightShadowOpacity: asBoundedNumber(
              isRecord(cardStyles['card-3']) ? cardStyles['card-3'].lightShadowOpacity : undefined,
              DEFAULT_SITE_CONFIG.designSystem.componentStyles.cards['card-3'].lightShadowOpacity,
              0,
              0.9,
            ),
          },
        },
      },
    },
    animation: {
      activeCursorAnimation: asCursorAnimationMode(
        animation.activeCursorAnimation,
        DEFAULT_SITE_CONFIG.animation.activeCursorAnimation,
      ),
      cursor: {
        DENSITY_DISSIPATION: asNumber(
          cursor.DENSITY_DISSIPATION,
          DEFAULT_SITE_CONFIG.animation.cursor.DENSITY_DISSIPATION,
        ),
        VELOCITY_DISSIPATION: asNumber(
          cursor.VELOCITY_DISSIPATION,
          DEFAULT_SITE_CONFIG.animation.cursor.VELOCITY_DISSIPATION,
        ),
        PRESSURE: asNumber(cursor.PRESSURE, DEFAULT_SITE_CONFIG.animation.cursor.PRESSURE),
        CURL: asNumber(cursor.CURL, DEFAULT_SITE_CONFIG.animation.cursor.CURL),
        SPLAT_RADIUS: asNumber(cursor.SPLAT_RADIUS, DEFAULT_SITE_CONFIG.animation.cursor.SPLAT_RADIUS),
        SPLAT_FORCE: asNumber(cursor.SPLAT_FORCE, DEFAULT_SITE_CONFIG.animation.cursor.SPLAT_FORCE),
        COLOR_UPDATE_SPEED: asNumber(
          cursor.COLOR_UPDATE_SPEED,
          DEFAULT_SITE_CONFIG.animation.cursor.COLOR_UPDATE_SPEED,
        ),
        SHADING: asBoolean(cursor.SHADING, DEFAULT_SITE_CONFIG.animation.cursor.SHADING),
        RAINBOW_MODE: asBoolean(cursor.RAINBOW_MODE, DEFAULT_SITE_CONFIG.animation.cursor.RAINBOW_MODE),
        COLOR: asString(cursor.COLOR, DEFAULT_SITE_CONFIG.animation.cursor.COLOR),
        AUTO_CONTRAST: asBoolean(
          cursor.AUTO_CONTRAST,
          DEFAULT_SITE_CONFIG.animation.cursor.AUTO_CONTRAST,
        ),
      },
      aura: {
        color: asString(aura.color, DEFAULT_SITE_CONFIG.animation.aura.color),
        sizePx: asBoundedNumber(aura.sizePx, DEFAULT_SITE_CONFIG.animation.aura.sizePx, 120, 820),
        blurPx: asBoundedNumber(aura.blurPx, DEFAULT_SITE_CONFIG.animation.aura.blurPx, 0, 220),
        intensity: asBoundedNumber(
          aura.intensity,
          DEFAULT_SITE_CONFIG.animation.aura.intensity,
          0.05,
          1,
        ),
        smoothing: asBoundedNumber(
          aura.smoothing,
          DEFAULT_SITE_CONFIG.animation.aura.smoothing,
          0.02,
          0.45,
        ),
      },
      orbit: {
        color: asString(orbit.color, DEFAULT_SITE_CONFIG.animation.orbit.color),
        orbCount: asBoundedNumber(orbit.orbCount, DEFAULT_SITE_CONFIG.animation.orbit.orbCount, 2, 14),
        orbSizePx: asBoundedNumber(
          orbit.orbSizePx,
          DEFAULT_SITE_CONFIG.animation.orbit.orbSizePx,
          6,
          72,
        ),
        blurPx: asBoundedNumber(orbit.blurPx, DEFAULT_SITE_CONFIG.animation.orbit.blurPx, 0, 60),
        opacity: asBoundedNumber(orbit.opacity, DEFAULT_SITE_CONFIG.animation.orbit.opacity, 0.05, 1),
        followStrength: asBoundedNumber(
          orbit.followStrength,
          DEFAULT_SITE_CONFIG.animation.orbit.followStrength,
          0.02,
          1,
        ),
        falloff: asBoundedNumber(orbit.falloff, DEFAULT_SITE_CONFIG.animation.orbit.falloff, 0.3, 0.99),
      },
      comet: {
        color: asString(comet.color, DEFAULT_SITE_CONFIG.animation.comet.color),
        headSizePx: asBoundedNumber(
          comet.headSizePx,
          DEFAULT_SITE_CONFIG.animation.comet.headSizePx,
          8,
          90,
        ),
        tailLength: asBoundedNumber(comet.tailLength, DEFAULT_SITE_CONFIG.animation.comet.tailLength, 3, 20),
        blurPx: asBoundedNumber(comet.blurPx, DEFAULT_SITE_CONFIG.animation.comet.blurPx, 0, 60),
        opacity: asBoundedNumber(comet.opacity, DEFAULT_SITE_CONFIG.animation.comet.opacity, 0.05, 1),
        followStrength: asBoundedNumber(
          comet.followStrength,
          DEFAULT_SITE_CONFIG.animation.comet.followStrength,
          0.05,
          1,
        ),
      },
      ripple: {
        color: asString(ripple.color, DEFAULT_SITE_CONFIG.animation.ripple.color),
        ringSizePx: asBoundedNumber(
          ripple.ringSizePx,
          DEFAULT_SITE_CONFIG.animation.ripple.ringSizePx,
          20,
          260,
        ),
        ringWidthPx: asBoundedNumber(
          ripple.ringWidthPx,
          DEFAULT_SITE_CONFIG.animation.ripple.ringWidthPx,
          1,
          12,
        ),
        lifeMs: asBoundedNumber(ripple.lifeMs, DEFAULT_SITE_CONFIG.animation.ripple.lifeMs, 120, 2600),
        spawnDistancePx: asBoundedNumber(
          ripple.spawnDistancePx,
          DEFAULT_SITE_CONFIG.animation.ripple.spawnDistancePx,
          2,
          120,
        ),
        opacity: asBoundedNumber(ripple.opacity, DEFAULT_SITE_CONFIG.animation.ripple.opacity, 0.05, 1),
      },
      spark: {
        color: asString(spark.color, DEFAULT_SITE_CONFIG.animation.spark.color),
        particleCount: asBoundedNumber(
          spark.particleCount,
          DEFAULT_SITE_CONFIG.animation.spark.particleCount,
          4,
          48,
        ),
        particleSizePx: asBoundedNumber(
          spark.particleSizePx,
          DEFAULT_SITE_CONFIG.animation.spark.particleSizePx,
          1,
          12,
        ),
        spreadPx: asBoundedNumber(spark.spreadPx, DEFAULT_SITE_CONFIG.animation.spark.spreadPx, 6, 140),
        lifeMs: asBoundedNumber(spark.lifeMs, DEFAULT_SITE_CONFIG.animation.spark.lifeMs, 120, 2200),
        emissionRate: asBoundedNumber(
          spark.emissionRate,
          DEFAULT_SITE_CONFIG.animation.spark.emissionRate,
          0.05,
          1,
        ),
      },
      beam: {
        color: asString(beam.color, DEFAULT_SITE_CONFIG.animation.beam.color),
        widthPx: asBoundedNumber(beam.widthPx, DEFAULT_SITE_CONFIG.animation.beam.widthPx, 20, 420),
        heightPx: asBoundedNumber(beam.heightPx, DEFAULT_SITE_CONFIG.animation.beam.heightPx, 6, 120),
        blurPx: asBoundedNumber(beam.blurPx, DEFAULT_SITE_CONFIG.animation.beam.blurPx, 0, 80),
        opacity: asBoundedNumber(beam.opacity, DEFAULT_SITE_CONFIG.animation.beam.opacity, 0.05, 1),
        lag: asBoundedNumber(beam.lag, DEFAULT_SITE_CONFIG.animation.beam.lag, 0.02, 0.6),
      },
      plasma: {
        colorA: asString(plasma.colorA, DEFAULT_SITE_CONFIG.animation.plasma.colorA),
        colorB: asString(plasma.colorB, DEFAULT_SITE_CONFIG.animation.plasma.colorB),
        sizePx: asBoundedNumber(plasma.sizePx, DEFAULT_SITE_CONFIG.animation.plasma.sizePx, 40, 620),
        blurPx: asBoundedNumber(plasma.blurPx, DEFAULT_SITE_CONFIG.animation.plasma.blurPx, 0, 120),
        opacity: asBoundedNumber(plasma.opacity, DEFAULT_SITE_CONFIG.animation.plasma.opacity, 0.05, 1),
        smoothing: asBoundedNumber(
          plasma.smoothing,
          DEFAULT_SITE_CONFIG.animation.plasma.smoothing,
          0.02,
          0.5,
        ),
      },
      sections: {
        about: {
          enabled: asBoolean(
            aboutSection.enabled,
            DEFAULT_SITE_CONFIG.animation.sections.about.enabled,
          ),
          textSequenceStyle: asTextSequenceStyle(
            aboutSection.textSequenceStyle,
            DEFAULT_SITE_CONFIG.animation.sections.about.textSequenceStyle,
          ),
          cardEntranceStyle: asAboutCardStyle(
            aboutSection.cardEntranceStyle,
            DEFAULT_SITE_CONFIG.animation.sections.about.cardEntranceStyle,
          ),
          textRhythm: asRhythmSetting(
            aboutSection.textRhythm,
            DEFAULT_SITE_CONFIG.animation.sections.about.textRhythm,
          ),
          certificationRhythm: asRhythmSetting(
            aboutSection.certificationRhythm,
            DEFAULT_SITE_CONFIG.animation.sections.about.certificationRhythm,
          ),
          skillMode: asSkillDisplayMode(
            aboutSection.skillMode,
            DEFAULT_SITE_CONFIG.animation.sections.about.skillMode,
          ),
        },
        projects: {
          enabled: asBoolean(
            projectsSection.enabled,
            DEFAULT_SITE_CONFIG.animation.sections.projects.enabled,
          ),
          cardEntranceStyle: asProjectCardStyle(
            projectsSection.cardEntranceStyle,
            DEFAULT_SITE_CONFIG.animation.sections.projects.cardEntranceStyle,
          ),
          gridDepth: asRhythmSetting(
            projectsSection.gridDepth,
            DEFAULT_SITE_CONFIG.animation.sections.projects.gridDepth,
          ),
          hoverParallax: asBoolean(
            projectsSection.hoverParallax,
            DEFAULT_SITE_CONFIG.animation.sections.projects.hoverParallax,
          ),
        },
        testimonials: {
          enabled: asBoolean(
            testimonialsSection.enabled,
            DEFAULT_SITE_CONFIG.animation.sections.testimonials.enabled,
          ),
          transitionStyle: asTestimonialTransitionStyle(
            testimonialsSection.transitionStyle,
            DEFAULT_SITE_CONFIG.animation.sections.testimonials.transitionStyle,
          ),
          autoPlayMs: asBoundedNumber(
            testimonialsSection.autoPlayMs,
            DEFAULT_SITE_CONFIG.animation.sections.testimonials.autoPlayMs,
            1500,
            15000,
          ),
          floatIntensity: asBoundedNumber(
            testimonialsSection.floatIntensity,
            DEFAULT_SITE_CONFIG.animation.sections.testimonials.floatIntensity,
            0,
            1.2,
          ),
        },
      },
    },
    cinematicSequence: {
      skipScene06Exit: asBoolean(
        cinematicSequence.skipScene06Exit,
        DEFAULT_SITE_CONFIG.cinematicSequence.skipScene06Exit,
      ),
      scene06PauseMs: asBoundedNumber(
        cinematicSequence.scene06PauseMs,
        DEFAULT_SITE_CONFIG.cinematicSequence.scene06PauseMs,
        0,
        6000,
      ),
      scroll: {
        wheelIntensity: asBoundedNumber(
          cinematicScroll.wheelIntensity,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.wheelIntensity,
          0.00002,
          0.0003,
        ),
        maxWheelDelta: asBoundedNumber(
          cinematicScroll.maxWheelDelta,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.maxWheelDelta,
          10,
          200,
        ),
        smoothDurationMs: asBoundedNumber(
          cinematicScroll.smoothDurationMs,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.smoothDurationMs,
          120,
          2400,
        ),
        momentumDamping: asBoundedNumber(
          cinematicScroll.momentumDamping,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.momentumDamping,
          0.6,
          0.98,
        ),
        touchMultiplier: asBoundedNumber(
          cinematicScroll.touchMultiplier,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.touchMultiplier,
          0.5,
          6,
        ),
        keyboardStep: asBoundedNumber(
          cinematicScroll.keyboardStep,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.keyboardStep,
          0.02,
          0.2,
        ),
      },
    },
    globalFrame: {
      topOffsetMobilePx: asBoundedNumber(
        globalFrame.topOffsetMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.topOffsetMobilePx,
        0,
        360,
      ),
      topOffsetDesktopPx: asBoundedNumber(
        globalFrame.topOffsetDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.topOffsetDesktopPx,
        0,
        500,
      ),
      bottomOffsetMobilePx: asBoundedNumber(
        globalFrame.bottomOffsetMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.bottomOffsetMobilePx,
        0,
        300,
      ),
      bottomOffsetDesktopPx: asBoundedNumber(
        globalFrame.bottomOffsetDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.bottomOffsetDesktopPx,
        0,
        360,
      ),
      sideOffsetMobilePx: asBoundedNumber(
        globalFrame.sideOffsetMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.sideOffsetMobilePx,
        0,
        220,
      ),
      sideOffsetDesktopPx: asBoundedNumber(
        globalFrame.sideOffsetDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.sideOffsetDesktopPx,
        0,
        300,
      ),
      topRadiusMobilePx: asBoundedNumber(
        globalFrame.topRadiusMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.topRadiusMobilePx,
        8,
        240,
      ),
      topRadiusDesktopPx: asBoundedNumber(
        globalFrame.topRadiusDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.topRadiusDesktopPx,
        8,
        320,
      ),
      bottomRadiusPx: asBoundedNumber(
        globalFrame.bottomRadiusPx,
        DEFAULT_SITE_CONFIG.globalFrame.bottomRadiusPx,
        0,
        120,
      ),
      matteColor: asString(globalFrame.matteColor, DEFAULT_SITE_CONFIG.globalFrame.matteColor),
    },
    visibility: {
      globalFrameOverlay: asBoolean(
        visibility.globalFrameOverlay,
        DEFAULT_SITE_CONFIG.visibility.globalFrameOverlay,
      ),
      cursorAnimation: asBoolean(visibility.cursorAnimation, DEFAULT_SITE_CONFIG.visibility.cursorAnimation),
      introOverlay: asBoolean(visibility.introOverlay, DEFAULT_SITE_CONFIG.visibility.introOverlay),
      scene05Overlay: asBoolean(visibility.scene05Overlay, DEFAULT_SITE_CONFIG.visibility.scene05Overlay),
      persistentUI: asBoolean(visibility.persistentUI, DEFAULT_SITE_CONFIG.visibility.persistentUI),
      navigationLogo: asBoolean(visibility.navigationLogo, DEFAULT_SITE_CONFIG.visibility.navigationLogo),
      navigationMenu: asBoolean(visibility.navigationMenu, DEFAULT_SITE_CONFIG.visibility.navigationMenu),
      musicToggle: asBoolean(visibility.musicToggle, DEFAULT_SITE_CONFIG.visibility.musicToggle),
      letsTalkButton: asBoolean(visibility.letsTalkButton, DEFAULT_SITE_CONFIG.visibility.letsTalkButton),
      experienceMarqueeSection: asBoolean(
        visibility.experienceMarqueeSection,
        DEFAULT_SITE_CONFIG.visibility.experienceMarqueeSection,
      ),
      journeyTimelineSection: asBoolean(
        visibility.journeyTimelineSection,
        DEFAULT_SITE_CONFIG.visibility.journeyTimelineSection,
      ),
      featuredWork: asBoolean(visibility.featuredWork, DEFAULT_SITE_CONFIG.visibility.featuredWork),
      featuredHeader: asBoolean(visibility.featuredHeader, DEFAULT_SITE_CONFIG.visibility.featuredHeader),
      featuredProjectsGrid: asBoolean(
        visibility.featuredProjectsGrid,
        DEFAULT_SITE_CONFIG.visibility.featuredProjectsGrid,
      ),
      featuredViewAllButton: asBoolean(
        visibility.featuredViewAllButton,
        DEFAULT_SITE_CONFIG.visibility.featuredViewAllButton,
      ),
      testimonialsSection: asBoolean(
        visibility.testimonialsSection,
        DEFAULT_SITE_CONFIG.visibility.testimonialsSection,
      ),
      featuredCtaSection: asBoolean(
        visibility.featuredCtaSection,
        DEFAULT_SITE_CONFIG.visibility.featuredCtaSection,
      ),
      footer: asBoolean(visibility.footer, DEFAULT_SITE_CONFIG.visibility.footer),
      footerEmail: asBoolean(visibility.footerEmail, DEFAULT_SITE_CONFIG.visibility.footerEmail),
      footerSocialLinks: asBoolean(
        visibility.footerSocialLinks,
        DEFAULT_SITE_CONFIG.visibility.footerSocialLinks,
      ),
      footerLegalLinks: asBoolean(visibility.footerLegalLinks, DEFAULT_SITE_CONFIG.visibility.footerLegalLinks),
      footerNavLinks: asBoolean(visibility.footerNavLinks, DEFAULT_SITE_CONFIG.visibility.footerNavLinks),
      footerOffice: asBoolean(visibility.footerOffice, DEFAULT_SITE_CONFIG.visibility.footerOffice),
    },
  };
};
