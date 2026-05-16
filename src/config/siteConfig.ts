export type SiteSection = 'home' | 'about' | 'projects' | 'testimonials' | 'articles' | 'contact';

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
  'telegram',
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
  buttonType: 'live' | 'caseStudy';
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

export type SiteMessageStatus = 'new' | 'read' | 'archived';

// Contact Page Types
export type ContactCardIconType = 'linkedin' | 'twitter' | 'instagram' | 'behance' | 'facebook' | 'dribbble' | 'youtube' | 'email' | 'phone' | 'location' | 'globe' | 'github' | 'figma' | 'mail' | 'cv';

export interface SiteContactCard {
  id: string;
  title: string;
  subtitle: string;
  icon: ContactCardIconType;
  href: string;
  action: string;
  color: string;
  hoverColor: string;
  visible: boolean;
}

export interface SiteContactPageConfig {
  // Hero Section
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  
  // Direct Contact Card
  directContactTitle: string;
  phoneLabel: string;
  phoneNumber: string;
  emailLabel: string;
  emailAddress: string;
  officeLabel: string;
  officeAddress: string;
  availabilityText: string;
  
  // Response Time Card
  responseTimeLabel: string;
  responseTimeValue: string;
  responseTimeDescription: string;
  
  // Form Section
  formTitle: string;
  formSubtitle: string;
  formNameLabel: string;
  formNamePlaceholder: string;
  formEmailLabel: string;
  formEmailPlaceholder: string;
  formSubjectLabel: string;
  formSubjectPlaceholder: string;
  formMessageLabel: string;
  formMessagePlaceholder: string;
  formPrivacyText: string;
  formPrivacyLink: string;
  formSubmitButton: string;
  
  // Social Channels Section
  socialSectionLabel: string;
  socialSectionTitle: string;
  socialSectionDescription: string;
  
  // Contact Cards
  contactCards: SiteContactCard[];
  
  // Success Messages
  formSuccessTitle: string;
  formSuccessMessage: string;
  
  // Validation Messages
  validationRequired: string;
  validationInvalidEmail: string;
  validationMinLength: string;
  
  // Security
  honeypotFieldName: string;
  maxMessageLength: number;
  minMessageLength: number;
  rateLimitMinutes: number;
}

export interface SiteInboxMessage {
  id: string;
  senderName: string;
  companyName: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: SiteMessageStatus;
  source: string;
}

export interface SiteDashboardTopChannel {
  id: string;
  label: string;
  sessions: number;
  conversionRate: number;
  trendPct: number;
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
  inputCooldownMs: number;
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
  watermarkMaskEnabled: boolean;
  watermarkMaskMobilePx: number;
  watermarkMaskDesktopPx: number;
  watermarkMaskWidthMobilePx: number;
  watermarkMaskWidthDesktopPx: number;
  watermarkMaskRightMobilePx: number;
  watermarkMaskRightDesktopPx: number;
  watermarkMaskBottomMobilePx: number;
  watermarkMaskBottomDesktopPx: number;
  sideOffsetMobilePx: number;
  sideOffsetDesktopPx: number;
  topRadiusMobilePx: number;
  topRadiusDesktopPx: number;
  bottomRadiusPx: number;
  matteColor: string;
}

export interface SiteCRTConfig {
  enabled: boolean;
  intensity: 'low' | 'medium' | 'high';
  screenGeometry: {
    enabled: boolean;
    curvature: number;
  };
  barrelCurvature: {
    enabled: boolean;
    intensity: number;
  };
  vignette: {
    enabled: boolean;
    opacity: number;
    size: number;
  };
  analogSignal: {
    enabled: boolean;
    interference: number;
    sync: number;
  };
  colorBleed: {
    enabled: boolean;
    intensity: number;
    chromaticAberration: number;
  };
  staticNoise: {
    enabled: boolean;
    intensity: number;
    speed: number;
  };
  phosphorDisplay: {
    enabled: boolean;
    persistence: number;
    decay: number;
  };
  scanlines: {
    enabled: boolean;
    intensity: number;
    thickness: number;
    gap: number;
  };
  phosphorMask: {
    enabled: boolean;
    pattern: 'none' | 'rgb' | 'aperture' | 'slot';
    intensity: number;
  };
  phosphorGlow: {
    enabled: boolean;
    intensity: number;
    spread: number;
    color: string;
  };
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
  darkText: string;
  lightText: string;
  darkShadowOpacity: number;
  lightShadowOpacity: number;
}

export interface SiteDesignFoundation {
  typography: {
    eyebrowSizeRem: number;
    eyebrowWeight: number;
    eyebrowLetterSpacingEm: number;
  };
  spacing: {
    sectionPaddingRem: number;
    stackGapRem: number;
    gridGapRem: number;
    cardPaddingRem: number;
  };
  layout: {
    contentMaxWidthPx: number;
    columnGapRem: number;
    maxGridColumns: number;
  };
}

export interface SiteDesignTokens {
  brand: {
    primary: Record<string, string>;
    neutral: Record<string, string>;
    error: Record<string, string>;
    warning: Record<string, string>;
    success: Record<string, string>;
  };
  semantic: {
    background: Record<string, Record<string, string>>;
    border: Record<string, Record<string, string>>;
    text: Record<string, Record<string, string>>;
    icons: Record<string, Record<string, string>>;
  };
  spacing: {
    gap: Record<string, number>;
    padding: Record<string, number>;
    input: Record<string, number>;
    components: Record<string, number>;
  };
  radius: Record<string, number>;
  typography: {
    display: {
      family: string;
      weights: {
        regular: number;
        medium: number;
        semiBold: number;
        bold: number;
      };
      sizes: {
        webXXL: number;
        webXL: number;
        webL: number;
        webM: number;
        webS: number;
        webXS: number;
        headlineXXL: number;
      };
      lineHeight: number;
      letterSpacing: number;
    };
    body: {
      family: string;
      weights: {
        regular: number;
        medium: number;
      };
      sizes: {
        textM: number;
        textS: number;
        textXS: number;
      };
      lineHeight: number;
      letterSpacing: number;
    };
    labels: {
      sizeXL: number;
      weightMedium: number;
    };
    subtitles: {
      sizeXXL: number;
      weightSemiBold: number;
    };
  };
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

export interface SiteMotionSystem {
  durationFastMs: number;
  durationBaseMs: number;
  durationSlowMs: number;
  ease: string;
  staggerMs: number;
  hoverScale: number;
  hoverLiftPx: number;
}


// New types for Personal Hub
export type PartnerStatus = 'prospect' | 'contacted' | 'negotiating' | 'active' | 'completed' | 'lost';
export type PartnerType = 'freelance' | 'agency' | 'startup' | 'enterprise' | 'individual';

export interface SitePartner {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  website: string;
  email: string;
  phone: string;
  logo: string;
  description: string;
  notes: string;
  createdAt: string;
  lastContacted: string;
  nextFollowUp: string;
  tags: string[];
  visible: boolean;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SitePersonalProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  actualBudget: number;
  client: string;
  category: string;
  tags: string[];
  progress: number;
  notes: string;
  visible: boolean;
}

export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'tiktok' | 'github' | 'behance' | 'dribbble';

export interface SiteSocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  profileUrl: string;
  followerCount: number;
  connected: boolean;
  lastSynced: string;
  visible: boolean;
}

export interface SiteSocialPost {
  id: string;
  content: string;
  platforms: SocialPlatform[];
  mediaUrls: string[];
  scheduledFor: string;
  publishedAt: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  visible: boolean;
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'salary' | 'freelance' | 'investment' | 'software' | 'hardware' | 'marketing' | 'office' | 'travel' | 'other';

export interface SiteFinancialTransaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  projectId?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  tags: string[];
  visible: boolean;
}

export interface SiteInvestment {
  id: string;
  name: string;
  type: 'stocks' | 'crypto' | 'real_estate' | 'business' | 'other';
  amount: number;
  currentValue: number;
  purchaseDate: string;
  notes: string;
  visible: boolean;
}

export interface SiteInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  paidDate: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
  }>;
  notes: string;
  visible: boolean;
}

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'archive' | 'spam';
export type EmailStatus = 'unread' | 'read' | 'replied' | 'forwarded';

export interface SiteEmail {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
  }>;
  folder: EmailFolder;
  status: EmailStatus;
  receivedAt: string;
  sentAt: string;
  threadId?: string;
  labels: string[];
  visible: boolean;
}

export type NoteCategory = 'work' | 'personal' | 'ideas' | 'meeting' | 'reference' | 'other';

export interface SiteNote {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  color: string;
  visible: boolean;
}

export type AITrackingType = 'news' | 'market' | 'influencer' | 'competitor' | 'trend';
export type AIFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface SiteAITracking {
  id: string;
  name: string;
  type: AITrackingType;
  keywords: string[];
  sources: string[];
  frequency: AIFrequency;
  enabled: boolean;
  lastReport: string;
  nextReport: string;
  notes: string;
  visible: boolean;
}

export interface SiteAIReport {
  id: string;
  trackingId: string;
  title: string;
  summary: string;
  content: string;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
  read: boolean;
  visible: boolean;
}

export interface SiteConfig {
  introText: string;
  introScrollPrompt: string;
  introOverlayBackdropColor: string;
  introOverlayBackdropOpacity: number;
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
    logoLightSrc: string;
    logoDarkSrc: string;
    musicToggleAriaLabel: string;
    navItems: SiteNavItem[];
    letsTalkLabel: string;
    letsTalkHref: string;
    musicSrc: string;
    musicVolume: number;
  };
  footer: {
    brandTitle: string;
    brandDescription: string;
    quickLinksTitle: string;
    followTitle: string;
    socialIconBackgroundColor: string;
    socialIconBorderColor: string;
    socialIconColor: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonLabel: string;
    ctaButtonHref: string;
    bottomNote: string;
    email: string;
    copyrightText: string;
    officeTitle: string;
    officeAddress: string;
    socialLinks: SiteSocialLink[];
    legalLinks: SiteFooterLink[];
    navLinks: SiteFooterLink[];
  };
  legalPages: {
    termsTitle: string;
    termsLastUpdated: string;
    termsContent: string;
    privacyTitle: string;
    privacyLastUpdated: string;
    privacyContent: string;
    lastUpdatedLabel: string;
    backToHomeLabel: string;
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
    undatedLabel: string;
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
  contactPage: SiteContactPageConfig;
  articles: SiteArticle[];
  videos: SiteVideoItem[];
  dashboard: {
    browser: {
      browserTabTitle: string;
      faviconUrl: string;
    };
    integrations: {
      apiBaseUrl: string;
      customDomain: string;
      googleAnalyticsMeasurementId: string;
      googleAnalyticsEnabled: boolean;
    };
    analytics: {
      monthlyVisitors: number;
      conversionRate: number;
      avgSessionDurationSec: number;
      topChannels: SiteDashboardTopChannel[];
    };
    inbox: {
      forwardToEmail: string;
      autoReplyEnabled: boolean;
      items: SiteInboxMessage[];
    };
  };
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
      glowEnabled: boolean;
      glowColor: string;
      glowIntensity: number;
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
    foundation: SiteDesignFoundation;
    tokens: SiteDesignTokens;
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
    motion: SiteMotionSystem;
  };
  cinematicSequence: SiteCinematicSequenceConfig;
  globalFrame: SiteGlobalFrameConfig;
  crt: SiteCRTConfig;
  visibility: SiteVisibilityConfig;
  // Personal Hub sections
  partners: SitePartner[];
  personalProjects: SitePersonalProject[];
  socialAccounts: SiteSocialAccount[];
  socialPosts: SiteSocialPost[];
  financialTransactions: SiteFinancialTransaction[];
  investments: SiteInvestment[];
  invoices: SiteInvoice[];
  // Communication
  emails: SiteEmail[];
  // Notes
  notes: SiteNote[];
  // AI Intelligence
  aiTracking: SiteAITracking[];
  aiReports: SiteAIReport[];
}

export const SITE_CONFIG_STORAGE_KEY = 'portfolio.site-config.v1';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  introText:
    'I design thoughtful digital products and cinematic user experiences that connect user needs with business success through AI.',
  introScrollPrompt: 'Scroll to explore the work',
  introOverlayBackdropColor: 'rgba(0, 0, 0, 0.6)',
  introOverlayBackdropOpacity: 0.35,
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
      img: '/frames/scene-02-desk-focus/ezgif-frame-001.avif',
      behance: '#',
      live: '#',
      buttonType: 'live',
      visible: true,
    },
    {
      id: 'project-2',
      title: 'Of The Oak',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
      img: '/frames/scene-03-screen-entry/ezgif-frame-001.avif',
      behance: '#',
      live: '#',
      buttonType: 'live',
      visible: true,
    },
    {
      id: 'project-3',
      title: 'Devin AI',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      img: '/frames/scene-03-screen-entry/ezgif-frame-001.avif',
      behance: '#',
      live: '#',
      buttonType: 'caseStudy',
      visible: true,
    },
    {
      id: 'project-4',
      title: 'Porsche: Dream Machine',
      tags: 'CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO',
      img: '/frames/scene-07/ezgif-frame-001.avif',
      behance: '#',
      live: '#',
      buttonType: 'live',
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
    role: 'UX Designer and AI Product Builder',
    portraitImage: '/frames/scene-02-desk-focus/ezgif-frame-001.avif',
    portraitAlt: 'Portrait image',
    portraitCaption: '',
    visionTitle: 'Vision & Value',
    visionText:
      'I design interfaces that are not only visually refined, but also intentionally structured. My goal is to build digital products that feel natural to users and highly profitable for businesses.',
    storyTitle: 'What I Actually Bring',
    storyParagraphs: [
      'I work across the full product arc: research, information architecture, interaction modeling, design systems, and production-quality frontend implementation.',
      'My process starts with business intent and user behavior, then translates both into interfaces that feel clear, measurable, and commercially strong.',
      'I focus on decision clarity: every screen should reduce friction, support conversion, and preserve a strong visual identity at the same time.',
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
        visible: false,
      },
      {
        id: 'cert-2',
        title: 'IBM AI Engineering Professional Certificate',
        issuer: 'IBM',
        year: '2024',
        credentialUrl: '#',
        logoSrc: 'https://logo.clearbit.com/ibm.com',
        visible: false,
      },
      {
        id: 'cert-3',
        title: 'HarvardX Leadership and Communication',
        issuer: 'HarvardX',
        year: '2023',
        credentialUrl: '#',
        logoSrc: 'https://logo.clearbit.com/harvard.edu',
        visible: false,
      },
    ],
    companyLogosTitle: 'Companies I Collaborated With',
    companyLogos: [
      {
        id: 'company-1',
        name: 'Upwork',
        logoSrc: 'https://logo.clearbit.com/upwork.com',
        href: 'https://www.upwork.com/',
        visible: false,
      },
      {
        id: 'company-2',
        name: 'Webflow',
        logoSrc: 'https://logo.clearbit.com/webflow.com',
        href: 'https://webflow.com/',
        visible: false,
      },
      {
        id: 'company-3',
        name: 'Framer',
        logoSrc: 'https://logo.clearbit.com/framer.com',
        href: 'https://www.framer.com/',
        visible: false,
      },
      {
        id: 'company-4',
        name: 'Notion',
        logoSrc: 'https://logo.clearbit.com/notion.so',
        href: 'https://www.notion.so/',
        visible: false,
      },
    ],
    aiTitle: 'Designing with AI in Mind',
    aiText:
      'My focus is shifting toward AI-driven products. I believe AI succeeds through well-designed interactions using it as a tool-not a gimmick-to enhance clarity, efficiency, and commercial viability.',
    aiTags: ['AI Workflows', 'Figma', 'Claude Code', 'Systems'],
    actionLabel: 'Connect With Me',
    actionHref: '#',
    animations: {
      enabled: true,
      textRevealStyle: 'cinematic',
      cardEntranceStyle: 'stagger',
    },
  },
  persistentUI: {
    logoAlt: 'Oussama Lassoued',
    logoLightSrc: '/logo-black.png',
    logoDarkSrc: '/logo-white.png',
    musicToggleAriaLabel: 'Toggle Music',
    navItems: [
      { id: 'nav-home', label: 'Home', section: 'home', visible: true },
      { id: 'nav-about', label: 'About Me', section: 'about', visible: true },
      { id: 'nav-projects', label: 'Projects', section: 'projects', visible: true },
      { id: 'nav-testimonials', label: 'Testimonials', section: 'testimonials', visible: true },
      { id: 'nav-contact', label: 'Contact', section: 'contact', visible: true },
      { id: 'nav-articles', label: 'Articles', section: 'articles', visible: false },
    ],
    letsTalkLabel: "Let's Talk",
    letsTalkHref: 'mailto:hello@example.com',
    musicSrc: '/audio/for_website_1.mp3',
    musicVolume: 0.3,
  },
  footer: {
    brandTitle: 'Oussama Lassoued',
    brandDescription:
      'Digital product designer and AI expert. I help companies craft better products and practical AI workflows.',
    quickLinksTitle: 'Quick Links',
    followTitle: 'Follow Me',
    socialIconBackgroundColor: '#e7eefc',
    socialIconBorderColor: '#b9cdfa',
    socialIconColor: '#1f4fd4',
    ctaTitle: 'Need a designer for your product?',
    ctaDescription:
      'If your company needs UX/UI design, SaaS design, Webflow development, or AI consulting, book a free 30-minute call.',
    ctaButtonLabel: 'Get in Touch',
    ctaButtonHref: '#contact',
    bottomNote: 'Made with love by Oussama Lassoued',
    email: 'hello@example.com',
    copyrightText: 'Oussama Lassoued. All rights reserved.',
    officeTitle: 'Oussama Office',
    officeAddress: '123 Cinematic Blvd\nParis, France',
    socialLinks: [
      { id: 'social-youtube', label: 'YouTube', href: '#', icon: 'youtube', visible: true },
      { id: 'social-twitter', label: 'X', href: '#', icon: 'twitter', visible: true },
      { id: 'social-linkedin', label: 'LinkedIn', href: '#', icon: 'linkedin', visible: true },
      { id: 'social-instagram', label: 'Instagram', href: '#', icon: 'instagram', visible: true },
      { id: 'social-telegram', label: 'Telegram', href: '#', icon: 'telegram', visible: true },
      { id: 'social-mail', label: 'Mail', href: 'mailto:hello@example.com', icon: 'mail', visible: true },
    ],
    legalLinks: [
      { id: 'legal-terms', label: 'Terms of Service', href: '#/terms-of-service', visible: true },
      { id: 'legal-privacy', label: 'Privacy Policy', href: '#/privacy-policy', visible: true },
    ],
    navLinks: [
      { id: 'footer-nav-home', label: 'Home', href: '#home', visible: true },
      { id: 'footer-nav-about', label: 'About Me', href: '#about', visible: true },
      { id: 'footer-nav-projects', label: 'Projects', href: '#projects', visible: true },
      { id: 'footer-nav-testimonials', label: 'Testimonials', href: '#testimonials', visible: true },
      { id: 'footer-nav-contact', label: 'Contact', href: '#contact', visible: true },
      { id: 'footer-nav-articles', label: 'Articles', href: '#/articles', visible: false },
    ],
  },
  legalPages: {
    termsTitle: 'Terms of Service',
    termsLastUpdated: 'May 15, 2026',
    termsContent:
      'By using this website, you agree to use it lawfully and respectfully.\n\nAll content is provided for informational and portfolio purposes. Unauthorized copying, misuse, or harmful activity is prohibited.\n\nThese terms may be updated over time. Continued use of the website means you accept the latest version.',
    privacyTitle: 'Privacy Policy',
    privacyLastUpdated: 'May 15, 2026',
    privacyContent:
      'We only collect the information you voluntarily provide, such as contact form submissions.\n\nYour information is used only to respond to your requests and improve services. We do not sell your personal data.\n\nIf you have questions about your data, please contact us through the available contact channels.',
    lastUpdatedLabel: 'Last updated',
    backToHomeLabel: 'Back to Home',
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
    undatedLabel: 'Undated',
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
  contactPage: {
    // Hero Section
    heroTitleLine1: 'Get in Touch',
    heroTitleLine2: "Let's Work Together",
    heroSubtitle:
      "Have a project in mind or want to explore opportunities? I'm always open to discussing new projects, creative ideas, or partnerships.",
    // Direct Contact Card
    directContactTitle: 'Direct Contact',
    phoneLabel: 'Phone',
    phoneNumber: '+1 234 567 890',
    emailLabel: 'Email',
    emailAddress: 'hello@example.com',
    officeLabel: 'Office',
    officeAddress: '123 Creative Ave, San Francisco, CA',
    availabilityText: 'Available for projects worldwide',
    // Response Time Card
    responseTimeLabel: 'Response Time',
    responseTimeValue: '< 24 hours',
    responseTimeDescription: 'I typically respond within one business day',
    // Form Section
    formTitle: 'Send a Message',
    formSubtitle: "I'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible.",
    formNameLabel: 'Your Name',
    formNamePlaceholder: 'John Smith',
    formEmailLabel: 'Email Address',
    formEmailPlaceholder: 'john@company.com',
    formSubjectLabel: 'Subject',
    formSubjectPlaceholder: 'Project inquiry',
    formMessageLabel: 'Message',
    formMessagePlaceholder: 'Tell me about your project...',
    formPrivacyText: 'By submitting, you agree to our',
    formPrivacyLink: '#/privacy-policy',
    formSubmitButton: 'Send Message',
    // Social Channels Section
    socialSectionLabel: 'Social Channels',
    socialSectionTitle: 'Connect on Social',
    socialSectionDescription:
      'Follow me on social media for updates, behind-the-scenes content, and more.',
    // Contact Cards
    contactCards: [
      {
        id: 'card-linkedin',
        title: 'LinkedIn',
        subtitle: 'Connect professionally',
        icon: 'linkedin',
        href: 'https://linkedin.com/in/oussama',
        action: 'Connect',
        color: '#0077B5',
        hoverColor: '#005A8C',
        visible: true,
      },
      {
        id: 'card-twitter',
        title: 'X',
        subtitle: 'Follow for updates',
        icon: 'twitter',
        href: 'https://twitter.com/oussama',
        action: 'Follow',
        color: '#000000',
        hoverColor: '#333333',
        visible: true,
      },
        {
          id: 'card-instagram',
          title: 'Instagram',
          subtitle: 'See the creative process',
          icon: 'instagram',
          href: 'https://instagram.com/oussama',
          action: 'Follow',
          color: '#E4405F',
          hoverColor: '#C1355A',
          visible: true,
        },
        {
          id: 'card-behance',
          title: 'Behance',
          subtitle: 'View my portfolio',
          icon: 'behance',
          href: 'https://behance.net/oussama',
          action: 'View',
          color: '#1769FF',
          hoverColor: '#0D5BB8',
          visible: true,
        },
        {
          id: 'card-facebook',
          title: 'Facebook',
          subtitle: 'Follow for updates',
          icon: 'facebook',
          href: 'https://facebook.com/oussama',
          action: 'Follow',
          color: '#1877F2',
          hoverColor: '#0D5BB8',
          visible: true,
        },
      {
        id: 'card-youtube',
        title: 'YouTube',
        subtitle: 'Watch tutorials',
        icon: 'youtube',
        href: 'https://youtube.com/@oussama',
        action: 'Subscribe',
        color: '#FF0000',
        hoverColor: '#CC0000',
        visible: true,
      },
      {
        id: 'card-email',
        title: 'Email',
        subtitle: 'Send me a message',
        icon: 'email',
        href: 'mailto:hello@example.com',
        action: 'Send',
        color: '#000000',
        hoverColor: '#333333',
        visible: true,
      },
      {
        id: 'card-cv',
        title: 'CV / Resume',
        subtitle: 'Download my CV',
        icon: 'cv',
        href: '/cv.pdf',
        action: 'Download',
        color: '#000000',
        hoverColor: '#333333',
        visible: true,
      },
    ],
    // Success Messages
    formSuccessTitle: 'Message Sent!',
    formSuccessMessage:
      "Thank you for reaching out. I've received your message and will get back to you within 24 hours.",
    // Validation Messages
    validationRequired: 'This field is required',
    validationInvalidEmail: 'Please enter a valid email address',
    validationMinLength: 'Message must be at least 10 characters',
    // Security
    honeypotFieldName: 'website_url',
    maxMessageLength: 5000,
    minMessageLength: 10,
    rateLimitMinutes: 5,
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
      coverImage: '/frames/scene-03-screen-entry/ezgif-frame-001.avif',
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
      coverImage: '/frames/scene-02-desk-focus/ezgif-frame-001.avif',
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
      thumbnail: '/frames/scene-07/ezgif-frame-001.avif',
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
      thumbnail: '/frames/scene-07/ezgif-frame-001.avif',
      platform: 'vimeo',
      durationLabel: '05:47',
      publishedAt: '2026-04-08',
      status: 'published',
      featured: false,
      visible: true,
    },
  ],
  dashboard: {
    browser: {
      browserTabTitle: 'Oussama Lassoued — Product Designer',
      faviconUrl: '/favicon.ico',
    },
    integrations: {
      apiBaseUrl: 'https://api.example.com',
      customDomain: 'portfolio.example.com',
      googleAnalyticsMeasurementId: '',
      googleAnalyticsEnabled: false,
    },
    analytics: {
      monthlyVisitors: 18420,
      conversionRate: 3.8,
      avgSessionDurationSec: 228,
      topChannels: [
        { id: 'organic', label: 'Organic Search', sessions: 7420, conversionRate: 4.1, trendPct: 7.2 },
        { id: 'direct', label: 'Direct', sessions: 4890, conversionRate: 3.4, trendPct: 2.6 },
        { id: 'social', label: 'Social', sessions: 3610, conversionRate: 2.9, trendPct: -1.4 },
        { id: 'referral', label: 'Referral', sessions: 2500, conversionRate: 3.1, trendPct: 1.9 },
      ],
    },
    inbox: {
      forwardToEmail: 'hello@example.com',
      autoReplyEnabled: true,
      items: [
        {
          id: 'msg-1',
          senderName: 'Lina Adams',
          companyName: 'Northstar Labs',
          email: 'lina@northstarlabs.co',
          subject: 'New product launch landing page',
          message:
            'Hi Oussama, we are preparing a launch in May and need a conversion-focused landing page with strong storytelling.',
          receivedAt: '2026-04-18T11:15:00.000Z',
          status: 'new',
          source: 'website',
        },
        {
          id: 'msg-2',
          senderName: 'Marco Diaz',
          companyName: 'Studio M',
          email: 'marco@studiom.io',
          subject: 'Design system audit request',
          message:
            'Could you review our current design system and propose a cleaner component architecture for scaling?',
          receivedAt: '2026-04-15T08:42:00.000Z',
          status: 'read',
          source: 'website',
        },
        {
          id: 'msg-3',
          senderName: 'Amira Rahman',
          companyName: 'Orion Ventures',
          email: 'amira@orion.vc',
          subject: 'Portfolio collaboration',
          message:
            'We would like to discuss a collaboration for two portfolio companies that need product UX direction.',
          receivedAt: '2026-04-10T16:25:00.000Z',
          status: 'archived',
          source: 'website',
        },
      ],
    },
  },
  designSystem: {
    theme: {
      primaryColor: '#111217',
      secondaryColor: '#7a8192',
      onPrimaryColor: '#ffffff',
      onSecondaryColor: '#ffffff',
      headingScale: 1,
      displayTitleSizeRem: 3,
      sectionTitleSizeRem: 2.5,
      bodyTextSizeRem: 1,
      headingWeight: 600,
      headingLetterSpacingEm: -0.025,
      bodyLineHeight: 1.7,
      buttonRadius: 12,
      buttonBorderWidth: 1.5,
      buttonShadowOpacity: 0.12,
      cardRadius: 16,
      cardBorderWidth: 1.5,
      cardBlurPx: 20,
      cardShadowOpacity: 0.15,
      glassTintColor: 'rgba(18,18,20,0.6)',
      glassBorderColor: 'rgba(255,255,255,0.18)',
      glowEnabled: true,
      glowColor: '#f7d9a7',
      glowIntensity: 0.75,
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
          radiusPx: 12,
          borderWidthPx: 1.5,
          darkBackground: '#FFFFFF',
          darkBorder: '#E5E5E5',
          darkText: '#000000',
          darkHoverBackground: '#F8F8F8',
          lightBackground: '#000000',
          lightBorder: '#333333',
          lightText: '#FFFFFF',
          lightHoverBackground: '#1A1A1A',
        },
        'button-2': {
          radiusPx: 12,
          borderWidthPx: 1.5,
          darkBackground: 'rgba(255,255,255,0.08)',
          darkBorder: 'rgba(255,255,255,0.15)',
          darkText: '#FFFFFF',
          darkHoverBackground: 'rgba(255,255,255,0.12)',
          lightBackground: 'rgba(0,0,0,0.05)',
          lightBorder: 'rgba(0,0,0,0.1)',
          lightText: '#000000',
          lightHoverBackground: 'rgba(0,0,0,0.08)',
        },
        'button-3': {
          radiusPx: 12,
          borderWidthPx: 1.5,
          darkBackground: 'rgba(255,255,255,0.05)',
          darkBorder: 'rgba(255,255,255,0.12)',
          darkText: '#FFFFFF',
          darkHoverBackground: 'rgba(255,255,255,0.08)',
          lightBackground: 'rgba(0,0,0,0.03)',
          lightBorder: 'rgba(0,0,0,0.08)',
          lightText: '#000000',
          lightHoverBackground: 'rgba(0,0,0,0.06)',
        },
      },
      cards: {
        'card-1': {
          radiusPx: 16,
          borderWidthPx: 1.5,
          darkBackground: 'rgba(255,255,255,0.08)',
          lightBackground: 'rgba(255,255,255,0.85)',
          darkBorder: 'rgba(255,255,255,0.15)',
          lightBorder: 'rgba(0,0,0,0.08)',
          darkText: '#FFFFFF',
          lightText: '#000000',
          darkShadowOpacity: 0.18,
          lightShadowOpacity: 0.1,
        },
        'card-2': {
          radiusPx: 18,
          borderWidthPx: 1.5,
          darkBackground: 'rgba(255,255,255,0.06)',
          lightBackground: 'rgba(255,255,255,0.9)',
          darkBorder: 'rgba(255,255,255,0.12)',
          lightBorder: 'rgba(0,0,0,0.06)',
          darkText: '#FFFFFF',
          lightText: '#000000',
          darkShadowOpacity: 0.22,
          lightShadowOpacity: 0.12,
        },
        'card-3': {
          radiusPx: 20,
          borderWidthPx: 1.5,
          darkBackground: 'rgba(255,255,255,0.04)',
          lightBackground: 'rgba(255,255,255,0.95)',
          darkBorder: 'rgba(255,255,255,0.1)',
          lightBorder: 'rgba(0,0,0,0.04)',
          darkText: '#FFFFFF',
          lightText: '#000000',
          darkShadowOpacity: 0.25,
          lightShadowOpacity: 0.14,
        },
      },
    },
    foundation: {
      typography: {
        eyebrowSizeRem: 0.75,
        eyebrowWeight: 600,
        eyebrowLetterSpacingEm: 0.25,
      },
      spacing: {
        sectionPaddingRem: 5,
        stackGapRem: 1.5,
        gridGapRem: 2,
        cardPaddingRem: 2,
      },
      layout: {
        contentMaxWidthPx: 1400,
        columnGapRem: 1.5,
        maxGridColumns: 12,
      },
    },
    tokens: {
      brand: {
        primary: {
          50: '#E6EDFF',
          100: '#CDDBFE',
          200: '#9AB6FE',
          300: '#6892FD',
          400: '#356DFD',
          500: '#0349FC',
          600: '#023ACA',
          700: '#011D65',
          800: '#010F32',
          900: '#010F32',
          950: '#000719',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#18181B',
          950: '#0B121F',
          White: '#FFFFFF',
          'Off-white': '#F9F8F4',
          Black: '#0C0C0D',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#5F1616',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#52240A',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#0E3A1F',
        },
      },
      semantic: {
        background: {
          base: {
            'bg-primary': '#FFFFFF',
            'bg-warm': '#F8F9FA',
            'bg-primary-cards': '#FFFFFF',
            'bg-secondary': '#F9FAFB',
            'bg-tertiary': '#F3F4F6',
            'bg-quaternary': '#E5E7EB',
            'bg-senary': '#D1D5DB',
          },
          solid: {
            'bg-solid-primary': '#18181B',
            'bg-solid-secondary': '#1F2937',
            'bg-solid-tertiary': '#374151',
            'bg-solid-quarternary': '#6B7280',
          },
          brand: {
            'bg-brand-primary': '#F9FAFB',
            'bg-brand-secondary': '#F3F4F6',
            'bg-brand-tertiary': '#E5E7EB',
            'bg-brand-quaternary': '#6B7280',
            'bg-brand-quinary': '#4B5563',
            'bg-brand-senary': '#374151',
            'bg-green-cards': '#F9FAFB',
          },
          success: {
            'bg-success-primary': '#F0FDF4',
            'bg-success-secondary': '#DCFCE7',
            'bg-success-tertiary': '#22C55E',
            'bg-success-quarternary': '#16A34A',
            'bg-success-senery': '#15803D',
          },
          warning: {
            'bg-warning': '#FFFBEB',
          },
          error: {
            'bg-error-primary': '#FEF2F2',
            'bg-error-secondary': '#FEE2E2',
            'bg-error-tertiary': '#FECACA',
            'bg-error-quarternary': '#DC2626',
            'bg-error-quinary': '#B91C1C',
            'bg-error-senary': '#991B1B',
          },
        },
        border: {
          base: {
            'border-primary': '#D1D5DB',
            'border-secondary': '#E5E7EB',
            'border-tertiary': '#F3F4F6',
            'border-disabled': '#D1D5DB',
            'border-solid': '#4B5563',
            'border-white': '#FFFFFF',
          },
          brand: {
            'border-brand': '#6B7280',
            'border-brand-hover': '#4B5563',
            'border-brand-click': '#374151',
            'border-brand-subtle': '#E5E7EB',
          },
          error: {
            'border-error': '#DC2626',
            'border-error-hover': '#B91C1C',
            'border-error-click': '#991B1B',
            'border-error-subtle': '#FCA5A5',
            'border-error-disabled': '#FECACA',
          },
        },
        text: {
          heading: {
            'heading-primary': '#0C0C0D',
            'heading-secondary': '#374151',
            'heading-inverted': '#FFFFFF',
          },
          body: {
            body: '#4B5563',
            'body-inverted': '#E5E7EB',
            'body-on-brand': '#F9FAFB',
          },
          utility: {
            placeholder: '#6B7280',
            'sub-headline-brand': '#6B7280',
            'footer-headline': '#6B7280',
            'footer-headline-inverted': '#FFFFFF',
            disabled: '#9CA3AF',
            'error-primary': '#DC2626',
            'error-secondary': '#EF4444',
          },
        },
        icons: {
          tokens: {
            'icon-primary': '#18181B',
            'icon-secondary': '#1F2937',
            'icon-tertiary': '#374151',
            'icon-quaternary': '#4B5563',
            'icon-quinary': '#6B7280',
            'icon-senary': '#9CA3AF',
            'icon-septenary': '#D1D5DB',
            'icon-on-fill': '#FFFFFF',
          },
        },
      },
      spacing: {
        gap: {
          None: 0,
          'X Small': 4,
          Small: 8,
          Large: 16,
          XLarge: 20,
          '2X Large': 24,
          '3X Large': 32,
          '4X Large': 40,
          '5X Large': 48,
          '6X Large': 56,
          '7X Large': 64,
        },
        padding: {
          None: 0,
          'X Small': 2,
          Small: 4,
          Large: 12,
          XLarge: 16,
          '2X Large': 20,
          '3X Large': 24,
          '4X Large': 32,
          '5X Large': 40,
          '6X Large': 48,
        },
        input: {
          'Padding v': 8,
          'Padding h': 12,
          Gap: 4,
        },
        components: {
          'Border - focus': 2,
        },
      },
      radius: {
        None: 0,
        'X Small': 2,
        Small: 4,
        Medium: 6,
        Large: 8,
        XLarge: 10,
        '2X Large': 12,
        '3X Large': 16,
        '4X Large': 24,
        '5X Large': 32,
        Full: 9999,
      },
      typography: {
        display: {
          family: 'Plus Jakarta Sans',
          weights: {
            regular: 400,
            medium: 500,
            semiBold: 600,
            bold: 700,
          },
          sizes: {
            webXXL: 48,
            webXL: 42,
            webL: 40,
            webM: 38,
            webS: 36,
            webXS: 34,
            headlineXXL: 40,
          },
          lineHeight: 1.2,
          letterSpacing: 0,
        },
        body: {
          family: 'Plus Jakarta Sans',
          weights: {
            regular: 400,
            medium: 500,
          },
          sizes: {
            textM: 14,
            textS: 12,
            textXS: 10,
          },
          lineHeight: 1.2,
          letterSpacing: 0,
        },
        labels: {
          sizeXL: 18,
          weightMedium: 500,
        },
        subtitles: {
          sizeXXL: 32,
          weightSemiBold: 600,
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
    motion: {
      durationFastMs: 160,
      durationBaseMs: 260,
      durationSlowMs: 420,
      ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
      staggerMs: 60,
      hoverScale: 1.02,
      hoverLiftPx: 2,
    },
  },
  cinematicSequence: {
    skipScene06Exit: false,
    scene06PauseMs: 900,
    scroll: {
      wheelIntensity: 0.00015,
      maxWheelDelta: 48,
      smoothDurationMs: 400,
      momentumDamping: 0.86,
      touchMultiplier: 1.6,
      keyboardStep: 0.07,
      inputCooldownMs: 140,
    },
  },
  globalFrame: {
    topOffsetMobilePx: 60,
    topOffsetDesktopPx: 120,
    bottomOffsetMobilePx: 40,
    bottomOffsetDesktopPx: 80,
    watermarkMaskEnabled: true,
    watermarkMaskMobilePx: 70,
    watermarkMaskDesktopPx: 90,
    watermarkMaskWidthMobilePx: 160,
    watermarkMaskWidthDesktopPx: 220,
    watermarkMaskRightMobilePx: 12,
    watermarkMaskRightDesktopPx: 24,
    watermarkMaskBottomMobilePx: 12,
    watermarkMaskBottomDesktopPx: 16,
    sideOffsetMobilePx: 12,
    sideOffsetDesktopPx: 60,
    topRadiusMobilePx: 80,
    topRadiusDesktopPx: 160,
    bottomRadiusPx: 16,
    matteColor: '#0c0a08',
  },
  crt: {
    enabled: true,
    intensity: 'medium',
    screenGeometry: {
      enabled: true,
      curvature: 0.5,
    },
    barrelCurvature: {
      enabled: true,
      intensity: 0.3,
    },
    vignette: {
      enabled: true,
      opacity: 0.6,
      size: 0.8,
    },
    analogSignal: {
      enabled: true,
      interference: 0.2,
      sync: 0.1,
    },
    colorBleed: {
      enabled: true,
      intensity: 0.15,
      chromaticAberration: 0.1,
    },
    staticNoise: {
      enabled: true,
      intensity: 0.15,
      speed: 0.5,
    },
    phosphorDisplay: {
      enabled: true,
      persistence: 0.3,
      decay: 0.2,
    },
    scanlines: {
      enabled: true,
      intensity: 0.4,
      thickness: 1,
      gap: 2,
    },
    phosphorMask: {
      enabled: true,
      pattern: 'rgb',
      intensity: 0.3,
    },
    phosphorGlow: {
      enabled: true,
      intensity: 0.25,
      spread: 0.5,
      color: '#00ff00',
    },
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
  // Personal Hub defaults
  partners: [],
  personalProjects: [],
  socialAccounts: [],
  socialPosts: [],
  financialTransactions: [],
  investments: [],
  invoices: [],
  // Communication defaults
  emails: [],
  // Notes defaults
  notes: [],
  // AI Intelligence defaults
  aiTracking: [],
  aiReports: [],
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

const isClearbitLogo = (value: string) => value.includes('logo.clearbit.com');

const sanitizeFramePath = (value: string, fallback: string) => {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const normalized = trimmed.toLowerCase();
  if (!normalized.startsWith('/frames/')) return trimmed;
  if (normalized.endsWith('.avif')) return trimmed;
  return fallback;
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

const mergeStringRecord = (value: unknown, fallback: Record<string, string>) => {
  if (!isRecord(value)) return fallback;
  return Object.keys(fallback).reduce<Record<string, string>>((acc, key) => {
    acc[key] = asString(value[key], fallback[key]);
    return acc;
  }, {});
};

const mergeNumberRecord = (value: unknown, fallback: Record<string, number>) => {
  if (!isRecord(value)) return fallback;
  return Object.keys(fallback).reduce<Record<string, number>>((acc, key) => {
    acc[key] = asNumber(value[key], fallback[key]);
    return acc;
  }, {});
};

const mergeNestedStringRecord = (
  value: unknown,
  fallback: Record<string, Record<string, string>>,
) => {
  if (!isRecord(value)) return fallback;
  return Object.keys(fallback).reduce<Record<string, Record<string, string>>>((acc, key) => {
    acc[key] = mergeStringRecord(value[key], fallback[key]);
    return acc;
  }, {});
};

export const hydrateSiteConfig = (value: unknown): SiteConfig => {
  if (!isRecord(value)) return DEFAULT_SITE_CONFIG;

  const featured = isRecord(value.featured) ? value.featured : {};
  const scene05 = isRecord(value.scene05) ? value.scene05 : {};
  const persistentUI = isRecord(value.persistentUI) ? value.persistentUI : {};
  const footer = isRecord(value.footer) ? value.footer : {};
  const legalPages = isRecord(value.legalPages) ? value.legalPages : {};
  const articlesPage = isRecord(value.articlesPage) ? value.articlesPage : {};
  const footerSocialRecord = isRecord(footer.socialLinks) ? footer.socialLinks : {};
  const footerSocialArray = Array.isArray(footer.socialLinks) ? footer.socialLinks : [];
  const designSystem = isRecord(value.designSystem) ? value.designSystem : {};
  const designTheme = isRecord(designSystem.theme) ? designSystem.theme : {};
  const designComponents = isRecord(designSystem.components) ? designSystem.components : {};
  const designComponentStyles = isRecord(designSystem.componentStyles)
    ? designSystem.componentStyles
    : {};
  const designFoundation = isRecord(designSystem.foundation) ? designSystem.foundation : {};
  const foundationTypography = isRecord(designFoundation.typography) ? designFoundation.typography : {};
  const foundationSpacing = isRecord(designFoundation.spacing) ? designFoundation.spacing : {};
  const foundationLayout = isRecord(designFoundation.layout) ? designFoundation.layout : {};
  const designTokens = isRecord(designSystem.tokens) ? designSystem.tokens : {};
  const tokenBrand = isRecord(designTokens.brand) ? designTokens.brand : {};
  const tokenSemantic = isRecord(designTokens.semantic) ? designTokens.semantic : {};
  const tokenSpacing = isRecord(designTokens.spacing) ? designTokens.spacing : {};
  const tokenRadius = isRecord(designTokens.radius) ? designTokens.radius : {};
  const tokenTypography = isRecord(designTokens.typography) ? designTokens.typography : {};
  const tokenDisplay = isRecord(tokenTypography.display) ? tokenTypography.display : {};
  const tokenDisplayWeights = isRecord(tokenDisplay.weights) ? tokenDisplay.weights : {};
  const tokenDisplaySizes = isRecord(tokenDisplay.sizes) ? tokenDisplay.sizes : {};
  const tokenBody = isRecord(tokenTypography.body) ? tokenTypography.body : {};
  const tokenBodyWeights = isRecord(tokenBody.weights) ? tokenBody.weights : {};
  const tokenBodySizes = isRecord(tokenBody.sizes) ? tokenBody.sizes : {};
  const tokenLabels = isRecord(tokenTypography.labels) ? tokenTypography.labels : {};
  const tokenSubtitles = isRecord(tokenTypography.subtitles) ? tokenTypography.subtitles : {};
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
  const motion = isRecord(animation.motion) ? animation.motion : {};
  const aboutSection = isRecord(sections.about) ? sections.about : {};
  const projectsSection = isRecord(sections.projects) ? sections.projects : {};
  const testimonialsSection = isRecord(sections.testimonials) ? sections.testimonials : {};
  const cinematicSequence = isRecord(value.cinematicSequence) ? value.cinematicSequence : {};
  const cinematicScroll = isRecord(cinematicSequence.scroll) ? cinematicSequence.scroll : {};
  const globalFrame = isRecord(value.globalFrame) ? value.globalFrame : {};
  const crt = isRecord(value.crt) ? value.crt : {};
  const visibility = isRecord(value.visibility) ? value.visibility : {};
  const dashboard = isRecord(value.dashboard) ? value.dashboard : {};
  const dashboardBrowser = isRecord(dashboard.browser) ? dashboard.browser : {};
  const dashboardIntegrations = isRecord(dashboard.integrations) ? dashboard.integrations : {};
  const dashboardAnalytics = isRecord(dashboard.analytics) ? dashboard.analytics : {};
  const dashboardInbox = isRecord(dashboard.inbox) ? dashboard.inbox : {};
  const contactPage = isRecord(value.contactPage) ? value.contactPage : {};

  const projects = Array.isArray(value.projects)
    ? value.projects
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const fallback = DEFAULT_SITE_CONFIG.projects[Math.min(index, DEFAULT_SITE_CONFIG.projects.length - 1)];
          const fallbackImg = fallback?.img ?? '';
          return {
            id: asString(item.id, `project-${index + 1}`),
            title: asString(item.title, ''),
            tags: asString(item.tags, ''),
            img: sanitizeFramePath(asString(item.img, fallbackImg), fallbackImg),
            behance: asString(item.behance, '#'),
            live: asString(item.live, '#'),
            buttonType: (item.buttonType === 'caseStudy' ? 'caseStudy' : 'live') as 'live' | 'caseStudy',
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


  const navItems = Array.isArray(persistentUI.navItems)
    ? persistentUI.navItems
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const section = asString(item.section, 'home') as SiteSection;
          if (!['home', 'about', 'projects', 'testimonials', 'articles', 'contact'].includes(section)) return null;
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

  const legalLinksWithRoutes = legalLinks.map((link) => {
    if (link.id === 'legal-terms' && link.href.trim() === '#') {
      return { ...link, href: '#/terms-of-service' };
    }
    if (link.id === 'legal-privacy' && link.href.trim() === '#') {
      return { ...link, href: '#/privacy-policy' };
    }
    return link;
  });

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
      visible: false,
    };

  const defaultContactNavItem =
    DEFAULT_SITE_CONFIG.persistentUI.navItems.find((item) => item.section === 'contact') ?? {
      id: 'nav-contact',
      label: 'Contact',
      section: 'contact' as const,
      visible: true,
    };

  const navItemsWithArticles = (navItems.length > 0 ? navItems : DEFAULT_SITE_CONFIG.persistentUI.navItems).some(
    (item) => item.section === 'articles',
  )
    ? navItems.length > 0
      ? navItems
      : DEFAULT_SITE_CONFIG.persistentUI.navItems
    : [...(navItems.length > 0 ? navItems : DEFAULT_SITE_CONFIG.persistentUI.navItems), defaultArticlesNavItem];

  // Ensure nav-contact always exists with visible: true
  const navItemsWithContact = navItemsWithArticles.some((item) => item.section === 'contact')
    ? navItemsWithArticles
    : [...navItemsWithArticles, defaultContactNavItem];

  const defaultFooterArticlesLink =
    DEFAULT_SITE_CONFIG.footer.navLinks.find((link) => link.href.toLowerCase() === '#/articles') ?? {
      id: 'footer-nav-articles',
      label: 'Articles',
      href: '#/articles',
      visible: false,
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
            coverImage: sanitizeFramePath(
              asString(item.coverImage, fallback?.coverImage ?? ''),
              fallback?.coverImage ?? '',
            ),
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
            thumbnail: sanitizeFramePath(
              asString(item.thumbnail, fallback?.thumbnail ?? ''),
              fallback?.thumbnail ?? '',
            ),
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

  const dashboardTopChannels = Array.isArray(dashboardAnalytics.topChannels)
    ? dashboardAnalytics.topChannels
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `channel-${index + 1}`),
            label: asString(item.label, `Channel ${index + 1}`),
            sessions: asBoundedNumber(item.sessions, 0, 0, 100000000),
            conversionRate: asBoundedNumber(item.conversionRate, 0, 0, 100),
            trendPct: asBoundedNumber(item.trendPct, 0, -100, 1000),
          };
        })
        .filter((item): item is SiteDashboardTopChannel => !!item)
    : DEFAULT_SITE_CONFIG.dashboard.analytics.topChannels;

  const dashboardInboxItems = Array.isArray(dashboardInbox.items)
    ? dashboardInbox.items
        .map((item, index) => {
          if (!isRecord(item)) return null;
          return {
            id: asString(item.id, `inbox-${index + 1}`),
            senderName: asString(item.senderName, ''),
            companyName: asString(item.companyName, ''),
            email: asString(item.email, ''),
            subject: asString(item.subject, ''),
            message: asString(item.message, ''),
            receivedAt: asString(item.receivedAt, new Date().toISOString()),
            status:
              asString(item.status, 'new') === 'archived'
                ? 'archived'
                : asString(item.status, 'new') === 'read'
                  ? 'read'
                  : 'new',
            source: asString(item.source, 'website'),
          };
        })
        .filter((item): item is SiteInboxMessage => !!item)
    : DEFAULT_SITE_CONFIG.dashboard.inbox.items;

  const skills = Array.isArray(scene05.skills)
    ? scene05.skills.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.skills;

  const certifications = Array.isArray(scene05.certifications)
    ? scene05.certifications.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.certifications;

  const storyParagraphs = Array.isArray(scene05.storyParagraphs)
    ? scene05.storyParagraphs.map((item) => asString(item, '')).filter(Boolean)
    : DEFAULT_SITE_CONFIG.scene05.storyParagraphs;


  const companyLogos = Array.isArray(scene05.companyLogos)
    ? scene05.companyLogos
        .map((item, index) => {
          if (!isRecord(item)) return null;
          const logoSrc = asString(item.logoSrc, '');
          return {
            id: asString(item.id, `company-${index + 1}`),
            name: asString(item.name, ''),
            logoSrc,
            href: asString(item.href, '#'),
            visible: asBoolean(item.visible, true) && !isClearbitLogo(logoSrc),
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
          const logoSrc = asString(item.logoSrc, '');
          return {
            id: asString(item.id, `cert-${index + 1}`),
            title: asString(item.title, ''),
            issuer: asString(item.issuer, ''),
            year: asString(item.year, ''),
            credentialUrl: asString(item.credentialUrl, '#'),
            logoSrc,
            visible: asBoolean(item.visible, true) && !isClearbitLogo(logoSrc),
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

  const rawScene05Name = asString(scene05.name, DEFAULT_SITE_CONFIG.scene05.name).trim();
  const migratedScene05Name =
    rawScene05Name === 'أسامة'
      ? DEFAULT_SITE_CONFIG.scene05.name
      : rawScene05Name || DEFAULT_SITE_CONFIG.scene05.name;

  const rawScene05Role = asString(scene05.role, DEFAULT_SITE_CONFIG.scene05.role).trim();
  const migratedScene05Role =
    rawScene05Role === 'UX/UI Designer & AI Product Builder'
      ? DEFAULT_SITE_CONFIG.scene05.role
      : rawScene05Role || DEFAULT_SITE_CONFIG.scene05.role;

  return {
    introText: asString(value.introText, DEFAULT_SITE_CONFIG.introText),
    introScrollPrompt: asString(value.introScrollPrompt, DEFAULT_SITE_CONFIG.introScrollPrompt),
    introOverlayBackdropColor: asString(
      value.introOverlayBackdropColor,
      DEFAULT_SITE_CONFIG.introOverlayBackdropColor,
    ),
    introOverlayBackdropOpacity: asBoundedNumber(
      value.introOverlayBackdropOpacity,
      DEFAULT_SITE_CONFIG.introOverlayBackdropOpacity,
      0,
      0.95,
    ),
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
    projects: projects.length > 0
      ? projects.map((project) => ({
          ...project,
          buttonType: (project as any).buttonType || 'live',
        }))
      : DEFAULT_SITE_CONFIG.projects,
    experienceMarquee: experienceMarquee.length > 0 ? experienceMarquee : DEFAULT_SITE_CONFIG.experienceMarquee,
    testimonials: testimonials.length > 0 ? testimonials : DEFAULT_SITE_CONFIG.testimonials,
    scene05: {
      badge: asString(scene05.badge, DEFAULT_SITE_CONFIG.scene05.badge),
      name: migratedScene05Name,
      role: migratedScene05Role,
      portraitImage: sanitizeFramePath(
        asString(scene05.portraitImage, DEFAULT_SITE_CONFIG.scene05.portraitImage),
        DEFAULT_SITE_CONFIG.scene05.portraitImage,
      ),
      portraitAlt: asString(scene05.portraitAlt, DEFAULT_SITE_CONFIG.scene05.portraitAlt),
      portraitCaption: asString(scene05.portraitCaption, DEFAULT_SITE_CONFIG.scene05.portraitCaption),
      visionTitle: asString(scene05.visionTitle, DEFAULT_SITE_CONFIG.scene05.visionTitle),
      visionText: asString(scene05.visionText, DEFAULT_SITE_CONFIG.scene05.visionText),
      storyTitle: asString(scene05.storyTitle, DEFAULT_SITE_CONFIG.scene05.storyTitle),
      storyParagraphs:
        storyParagraphs.length > 0 ? storyParagraphs : DEFAULT_SITE_CONFIG.scene05.storyParagraphs,
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
      logoLightSrc: asString(persistentUI.logoLightSrc, DEFAULT_SITE_CONFIG.persistentUI.logoLightSrc),
      logoDarkSrc: asString(persistentUI.logoDarkSrc, DEFAULT_SITE_CONFIG.persistentUI.logoDarkSrc),
      musicToggleAriaLabel: asString(
        persistentUI.musicToggleAriaLabel,
        DEFAULT_SITE_CONFIG.persistentUI.musicToggleAriaLabel,
      ),
      navItems: navItemsWithContact,
      letsTalkLabel: asString(persistentUI.letsTalkLabel, DEFAULT_SITE_CONFIG.persistentUI.letsTalkLabel),
      letsTalkHref: asString(persistentUI.letsTalkHref, DEFAULT_SITE_CONFIG.persistentUI.letsTalkHref),
      musicSrc: asString(persistentUI.musicSrc, DEFAULT_SITE_CONFIG.persistentUI.musicSrc),
      musicVolume: asNumber(persistentUI.musicVolume, DEFAULT_SITE_CONFIG.persistentUI.musicVolume),
    },
    footer: {
      brandTitle: asString(footer.brandTitle, DEFAULT_SITE_CONFIG.footer.brandTitle),
      brandDescription: asString(footer.brandDescription, DEFAULT_SITE_CONFIG.footer.brandDescription),
      quickLinksTitle: asString(footer.quickLinksTitle, DEFAULT_SITE_CONFIG.footer.quickLinksTitle),
      followTitle: asString(footer.followTitle, DEFAULT_SITE_CONFIG.footer.followTitle),
      socialIconBackgroundColor: asString(
        footer.socialIconBackgroundColor,
        DEFAULT_SITE_CONFIG.footer.socialIconBackgroundColor,
      ),
      socialIconBorderColor: asString(footer.socialIconBorderColor, DEFAULT_SITE_CONFIG.footer.socialIconBorderColor),
      socialIconColor: asString(footer.socialIconColor, DEFAULT_SITE_CONFIG.footer.socialIconColor),
      ctaTitle: asString(footer.ctaTitle, DEFAULT_SITE_CONFIG.footer.ctaTitle),
      ctaDescription: asString(footer.ctaDescription, DEFAULT_SITE_CONFIG.footer.ctaDescription),
      ctaButtonLabel: asString(footer.ctaButtonLabel, DEFAULT_SITE_CONFIG.footer.ctaButtonLabel),
      ctaButtonHref: asString(footer.ctaButtonHref, DEFAULT_SITE_CONFIG.footer.ctaButtonHref),
      bottomNote: asString(footer.bottomNote, DEFAULT_SITE_CONFIG.footer.bottomNote),
      email: asString(footer.email, DEFAULT_SITE_CONFIG.footer.email),
      copyrightText: asString(footer.copyrightText, DEFAULT_SITE_CONFIG.footer.copyrightText),
      officeTitle: asString(footer.officeTitle, DEFAULT_SITE_CONFIG.footer.officeTitle),
      officeAddress: asString(footer.officeAddress, DEFAULT_SITE_CONFIG.footer.officeAddress),
      socialLinks: socialLinks.length > 0 ? socialLinks : DEFAULT_SITE_CONFIG.footer.socialLinks,
      legalLinks: legalLinksWithRoutes.length > 0 ? legalLinksWithRoutes : DEFAULT_SITE_CONFIG.footer.legalLinks,
      navLinks: navLinksWithArticles,
    },
    legalPages: {
      termsTitle: asString(legalPages.termsTitle, DEFAULT_SITE_CONFIG.legalPages.termsTitle),
      termsLastUpdated: asString(legalPages.termsLastUpdated, DEFAULT_SITE_CONFIG.legalPages.termsLastUpdated),
      termsContent: asString(legalPages.termsContent, DEFAULT_SITE_CONFIG.legalPages.termsContent),
      privacyTitle: asString(legalPages.privacyTitle, DEFAULT_SITE_CONFIG.legalPages.privacyTitle),
      privacyLastUpdated: asString(
        legalPages.privacyLastUpdated,
        DEFAULT_SITE_CONFIG.legalPages.privacyLastUpdated,
      ),
      privacyContent: asString(legalPages.privacyContent, DEFAULT_SITE_CONFIG.legalPages.privacyContent),
      lastUpdatedLabel: asString(legalPages.lastUpdatedLabel, DEFAULT_SITE_CONFIG.legalPages.lastUpdatedLabel),
      backToHomeLabel: asString(legalPages.backToHomeLabel, DEFAULT_SITE_CONFIG.legalPages.backToHomeLabel),
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
      undatedLabel: asString(articlesPage.undatedLabel, DEFAULT_SITE_CONFIG.articlesPage.undatedLabel),
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
    contactPage: {
      heroTitleLine1: asString(
        contactPage?.heroTitleLine1,
        DEFAULT_SITE_CONFIG.contactPage.heroTitleLine1,
      ),
      heroTitleLine2: asString(
        contactPage?.heroTitleLine2,
        DEFAULT_SITE_CONFIG.contactPage.heroTitleLine2,
      ),
      heroSubtitle: asString(
        contactPage?.heroSubtitle,
        DEFAULT_SITE_CONFIG.contactPage.heroSubtitle,
      ),
      directContactTitle: asString(
        contactPage?.directContactTitle,
        DEFAULT_SITE_CONFIG.contactPage.directContactTitle,
      ),
      phoneLabel: asString(contactPage?.phoneLabel, DEFAULT_SITE_CONFIG.contactPage.phoneLabel),
      phoneNumber: asString(contactPage?.phoneNumber, DEFAULT_SITE_CONFIG.contactPage.phoneNumber),
      emailLabel: asString(contactPage?.emailLabel, DEFAULT_SITE_CONFIG.contactPage.emailLabel),
      emailAddress: asString(contactPage?.emailAddress, DEFAULT_SITE_CONFIG.contactPage.emailAddress),
      officeLabel: asString(contactPage?.officeLabel, DEFAULT_SITE_CONFIG.contactPage.officeLabel),
      officeAddress: asString(contactPage?.officeAddress, DEFAULT_SITE_CONFIG.contactPage.officeAddress),
      availabilityText: asString(
        contactPage?.availabilityText,
        DEFAULT_SITE_CONFIG.contactPage.availabilityText,
      ),
      responseTimeLabel: asString(
        contactPage?.responseTimeLabel,
        DEFAULT_SITE_CONFIG.contactPage.responseTimeLabel,
      ),
      responseTimeValue: asString(
        contactPage?.responseTimeValue,
        DEFAULT_SITE_CONFIG.contactPage.responseTimeValue,
      ),
      responseTimeDescription: asString(
        contactPage?.responseTimeDescription,
        DEFAULT_SITE_CONFIG.contactPage.responseTimeDescription,
      ),
      formTitle: asString(contactPage?.formTitle, DEFAULT_SITE_CONFIG.contactPage.formTitle),
      formSubtitle: asString(contactPage?.formSubtitle, DEFAULT_SITE_CONFIG.contactPage.formSubtitle),
      formNameLabel: asString(contactPage?.formNameLabel, DEFAULT_SITE_CONFIG.contactPage.formNameLabel),
      formNamePlaceholder: asString(
        contactPage?.formNamePlaceholder,
        DEFAULT_SITE_CONFIG.contactPage.formNamePlaceholder,
      ),
      formEmailLabel: asString(contactPage?.formEmailLabel, DEFAULT_SITE_CONFIG.contactPage.formEmailLabel),
      formEmailPlaceholder: asString(
        contactPage?.formEmailPlaceholder,
        DEFAULT_SITE_CONFIG.contactPage.formEmailPlaceholder,
      ),
      formSubjectLabel: asString(
        contactPage?.formSubjectLabel,
        DEFAULT_SITE_CONFIG.contactPage.formSubjectLabel,
      ),
      formSubjectPlaceholder: asString(
        contactPage?.formSubjectPlaceholder,
        DEFAULT_SITE_CONFIG.contactPage.formSubjectPlaceholder,
      ),
      formMessageLabel: asString(
        contactPage?.formMessageLabel,
        DEFAULT_SITE_CONFIG.contactPage.formMessageLabel,
      ),
      formMessagePlaceholder: asString(
        contactPage?.formMessagePlaceholder,
        DEFAULT_SITE_CONFIG.contactPage.formMessagePlaceholder,
      ),
      formPrivacyText: asString(
        contactPage?.formPrivacyText,
        DEFAULT_SITE_CONFIG.contactPage.formPrivacyText,
      ),
      formPrivacyLink:
        asString(contactPage?.formPrivacyLink, DEFAULT_SITE_CONFIG.contactPage.formPrivacyLink).trim() ===
        '/privacy-policy'
          ? '#/privacy-policy'
          : asString(contactPage?.formPrivacyLink, DEFAULT_SITE_CONFIG.contactPage.formPrivacyLink),
      formSubmitButton: asString(
        contactPage?.formSubmitButton,
        DEFAULT_SITE_CONFIG.contactPage.formSubmitButton,
      ),
      socialSectionLabel: asString(
        contactPage?.socialSectionLabel,
        DEFAULT_SITE_CONFIG.contactPage.socialSectionLabel,
      ),
      socialSectionTitle: asString(
        contactPage?.socialSectionTitle,
        DEFAULT_SITE_CONFIG.contactPage.socialSectionTitle,
      ),
      socialSectionDescription: asString(
        contactPage?.socialSectionDescription,
        DEFAULT_SITE_CONFIG.contactPage.socialSectionDescription,
      ),
      contactCards: Array.isArray(contactPage?.contactCards) 
        ? (contactPage.contactCards as any[]).map((card: any, index: number) => ({
            id: asString(card.id, `contact-card-${index + 1}`),
            title: asString(card.title, ''),
            subtitle: asString(card.subtitle, ''),
            icon: (['linkedin', 'twitter', 'instagram', 'behance', 'facebook', 'dribbble', 'youtube', 'email', 'phone', 'location', 'globe', 'github', 'figma', 'mail', 'cv'].includes(card.icon) ? card.icon : 'globe') as any,
            href: asString(card.href, '#'),
            action: asString(card.action, ''),
            color: asString(card.color, '#0077B5'),
            hoverColor: asString(card.hoverColor, '#005A8C'),
            visible: asBoolean(card.visible, true),
          }))
        : DEFAULT_SITE_CONFIG.contactPage.contactCards,
      formSuccessTitle: asString(
        contactPage?.formSuccessTitle,
        DEFAULT_SITE_CONFIG.contactPage.formSuccessTitle,
      ),
      formSuccessMessage: asString(
        contactPage?.formSuccessMessage,
        DEFAULT_SITE_CONFIG.contactPage.formSuccessMessage,
      ),
      validationRequired: asString(
        contactPage?.validationRequired,
        DEFAULT_SITE_CONFIG.contactPage.validationRequired,
      ),
      validationInvalidEmail: asString(
        contactPage?.validationInvalidEmail,
        DEFAULT_SITE_CONFIG.contactPage.validationInvalidEmail,
      ),
      validationMinLength: asString(
        contactPage?.validationMinLength,
        DEFAULT_SITE_CONFIG.contactPage.validationMinLength,
      ),
      honeypotFieldName: asString(
        contactPage?.honeypotFieldName,
        DEFAULT_SITE_CONFIG.contactPage.honeypotFieldName,
      ),
      maxMessageLength: asBoundedNumber(
        contactPage?.maxMessageLength,
        DEFAULT_SITE_CONFIG.contactPage.maxMessageLength,
        10,
        5000,
      ),
      minMessageLength: asBoundedNumber(
        contactPage?.minMessageLength,
        DEFAULT_SITE_CONFIG.contactPage.minMessageLength,
        1,
        500,
      ),
      rateLimitMinutes: asBoundedNumber(
        contactPage?.rateLimitMinutes,
        DEFAULT_SITE_CONFIG.contactPage.rateLimitMinutes,
        1,
        60,
      ),
    },
    articles: articles.length > 0 ? articles : DEFAULT_SITE_CONFIG.articles,
    videos: videos.length > 0 ? videos : DEFAULT_SITE_CONFIG.videos,
    dashboard: {
      browser: {
        browserTabTitle: asString(
          dashboardBrowser.browserTabTitle,
          DEFAULT_SITE_CONFIG.dashboard.browser.browserTabTitle,
        ),
        faviconUrl: asString(
          dashboardBrowser.faviconUrl,
          DEFAULT_SITE_CONFIG.dashboard.browser.faviconUrl,
        ),
      },
      integrations: {
        apiBaseUrl: asString(
          dashboardIntegrations.apiBaseUrl,
          DEFAULT_SITE_CONFIG.dashboard.integrations.apiBaseUrl,
        ),
        customDomain: asString(
          dashboardIntegrations.customDomain,
          DEFAULT_SITE_CONFIG.dashboard.integrations.customDomain,
        ),
        googleAnalyticsMeasurementId: asString(
          dashboardIntegrations.googleAnalyticsMeasurementId,
          DEFAULT_SITE_CONFIG.dashboard.integrations.googleAnalyticsMeasurementId,
        ),
        googleAnalyticsEnabled: asBoolean(
          dashboardIntegrations.googleAnalyticsEnabled,
          DEFAULT_SITE_CONFIG.dashboard.integrations.googleAnalyticsEnabled,
        ),
      },
      analytics: {
        monthlyVisitors: asBoundedNumber(
          dashboardAnalytics.monthlyVisitors,
          DEFAULT_SITE_CONFIG.dashboard.analytics.monthlyVisitors,
          0,
          100000000,
        ),
        conversionRate: asBoundedNumber(
          dashboardAnalytics.conversionRate,
          DEFAULT_SITE_CONFIG.dashboard.analytics.conversionRate,
          0,
          100,
        ),
        avgSessionDurationSec: asBoundedNumber(
          dashboardAnalytics.avgSessionDurationSec,
          DEFAULT_SITE_CONFIG.dashboard.analytics.avgSessionDurationSec,
          0,
          7200,
        ),
        topChannels:
          dashboardTopChannels.length > 0
            ? dashboardTopChannels
            : DEFAULT_SITE_CONFIG.dashboard.analytics.topChannels,
      },
      inbox: {
        forwardToEmail: asString(
          dashboardInbox.forwardToEmail,
          DEFAULT_SITE_CONFIG.dashboard.inbox.forwardToEmail,
        ),
        autoReplyEnabled: asBoolean(
          dashboardInbox.autoReplyEnabled,
          DEFAULT_SITE_CONFIG.dashboard.inbox.autoReplyEnabled,
        ),
        items:
          dashboardInboxItems.length > 0
            ? dashboardInboxItems
            : DEFAULT_SITE_CONFIG.dashboard.inbox.items,
      },
    },
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
        glowEnabled: asBoolean(
          designTheme.glowEnabled,
          DEFAULT_SITE_CONFIG.designSystem.theme.glowEnabled,
        ),
        glowColor: asString(
          designTheme.glowColor,
          DEFAULT_SITE_CONFIG.designSystem.theme.glowColor,
        ),
        glowIntensity: asBoundedNumber(
          designTheme.glowIntensity,
          DEFAULT_SITE_CONFIG.designSystem.theme.glowIntensity,
          0,
          1.2,
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
      foundation: {
        typography: {
          eyebrowSizeRem: asBoundedNumber(
            foundationTypography.eyebrowSizeRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.typography.eyebrowSizeRem,
            0.4,
            1.4,
          ),
          eyebrowWeight: asBoundedNumber(
            foundationTypography.eyebrowWeight,
            DEFAULT_SITE_CONFIG.designSystem.foundation.typography.eyebrowWeight,
            300,
            900,
          ),
          eyebrowLetterSpacingEm: asBoundedNumber(
            foundationTypography.eyebrowLetterSpacingEm,
            DEFAULT_SITE_CONFIG.designSystem.foundation.typography.eyebrowLetterSpacingEm,
            -0.1,
            0.6,
          ),
        },
        spacing: {
          sectionPaddingRem: asBoundedNumber(
            foundationSpacing.sectionPaddingRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.spacing.sectionPaddingRem,
            1,
            8,
          ),
          stackGapRem: asBoundedNumber(
            foundationSpacing.stackGapRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.spacing.stackGapRem,
            0.4,
            3,
          ),
          gridGapRem: asBoundedNumber(
            foundationSpacing.gridGapRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.spacing.gridGapRem,
            0.4,
            3,
          ),
          cardPaddingRem: asBoundedNumber(
            foundationSpacing.cardPaddingRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.spacing.cardPaddingRem,
            0.75,
            3.5,
          ),
        },
        layout: {
          contentMaxWidthPx: asBoundedNumber(
            foundationLayout.contentMaxWidthPx,
            DEFAULT_SITE_CONFIG.designSystem.foundation.layout.contentMaxWidthPx,
            960,
            1920,
          ),
          columnGapRem: asBoundedNumber(
            foundationLayout.columnGapRem,
            DEFAULT_SITE_CONFIG.designSystem.foundation.layout.columnGapRem,
            0.5,
            4,
          ),
          maxGridColumns: asBoundedNumber(
            foundationLayout.maxGridColumns,
            DEFAULT_SITE_CONFIG.designSystem.foundation.layout.maxGridColumns,
            6,
            18,
          ),
        },
      },
      tokens: {
        brand: {
          primary: mergeStringRecord(
            tokenBrand.primary,
            DEFAULT_SITE_CONFIG.designSystem.tokens.brand.primary,
          ),
          neutral: mergeStringRecord(
            tokenBrand.neutral,
            DEFAULT_SITE_CONFIG.designSystem.tokens.brand.neutral,
          ),
          error: mergeStringRecord(
            tokenBrand.error,
            DEFAULT_SITE_CONFIG.designSystem.tokens.brand.error,
          ),
          warning: mergeStringRecord(
            tokenBrand.warning,
            DEFAULT_SITE_CONFIG.designSystem.tokens.brand.warning,
          ),
          success: mergeStringRecord(
            tokenBrand.success,
            DEFAULT_SITE_CONFIG.designSystem.tokens.brand.success,
          ),
        },
        semantic: {
          background: mergeNestedStringRecord(
            tokenSemantic.background,
            DEFAULT_SITE_CONFIG.designSystem.tokens.semantic.background,
          ),
          border: mergeNestedStringRecord(
            tokenSemantic.border,
            DEFAULT_SITE_CONFIG.designSystem.tokens.semantic.border,
          ),
          text: mergeNestedStringRecord(
            tokenSemantic.text,
            DEFAULT_SITE_CONFIG.designSystem.tokens.semantic.text,
          ),
          icons: mergeNestedStringRecord(
            tokenSemantic.icons,
            DEFAULT_SITE_CONFIG.designSystem.tokens.semantic.icons,
          ),
        },
        spacing: {
          gap: mergeNumberRecord(
            tokenSpacing.gap,
            DEFAULT_SITE_CONFIG.designSystem.tokens.spacing.gap,
          ),
          padding: mergeNumberRecord(
            tokenSpacing.padding,
            DEFAULT_SITE_CONFIG.designSystem.tokens.spacing.padding,
          ),
          input: mergeNumberRecord(
            tokenSpacing.input,
            DEFAULT_SITE_CONFIG.designSystem.tokens.spacing.input,
          ),
          components: mergeNumberRecord(
            tokenSpacing.components,
            DEFAULT_SITE_CONFIG.designSystem.tokens.spacing.components,
          ),
        },
        radius: mergeNumberRecord(
          tokenRadius,
          DEFAULT_SITE_CONFIG.designSystem.tokens.radius,
        ),
        typography: {
          display: {
            family: asString(
              tokenDisplay.family,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.family,
            ),
            weights: {
              regular: asNumber(
                tokenDisplayWeights.regular,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.weights.regular,
              ),
              medium: asNumber(
                tokenDisplayWeights.medium,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.weights.medium,
              ),
              semiBold: asNumber(
                tokenDisplayWeights.semiBold,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.weights.semiBold,
              ),
              bold: asNumber(
                tokenDisplayWeights.bold,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.weights.bold,
              ),
            },
            sizes: {
              webXXL: asNumber(
                tokenDisplaySizes.webXXL,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webXXL,
              ),
              webXL: asNumber(
                tokenDisplaySizes.webXL,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webXL,
              ),
              webL: asNumber(
                tokenDisplaySizes.webL,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webL,
              ),
              webM: asNumber(
                tokenDisplaySizes.webM,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webM,
              ),
              webS: asNumber(
                tokenDisplaySizes.webS,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webS,
              ),
              webXS: asNumber(
                tokenDisplaySizes.webXS,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.webXS,
              ),
              headlineXXL: asNumber(
                tokenDisplaySizes.headlineXXL,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.sizes.headlineXXL,
              ),
            },
            lineHeight: asNumber(
              tokenDisplay.lineHeight,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.lineHeight,
            ),
            letterSpacing: asNumber(
              tokenDisplay.letterSpacing,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.display.letterSpacing,
            ),
          },
          body: {
            family: asString(
              tokenBody.family,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.family,
            ),
            weights: {
              regular: asNumber(
                tokenBodyWeights.regular,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.weights.regular,
              ),
              medium: asNumber(
                tokenBodyWeights.medium,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.weights.medium,
              ),
            },
            sizes: {
              textM: asNumber(
                tokenBodySizes.textM,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.sizes.textM,
              ),
              textS: asNumber(
                tokenBodySizes.textS,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.sizes.textS,
              ),
              textXS: asNumber(
                tokenBodySizes.textXS,
                DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.sizes.textXS,
              ),
            },
            lineHeight: asNumber(
              tokenBody.lineHeight,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.lineHeight,
            ),
            letterSpacing: asNumber(
              tokenBody.letterSpacing,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.body.letterSpacing,
            ),
          },
          labels: {
            sizeXL: asNumber(
              tokenLabels.sizeXL,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.labels.sizeXL,
            ),
            weightMedium: asNumber(
              tokenLabels.weightMedium,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.labels.weightMedium,
            ),
          },
          subtitles: {
            sizeXXL: asNumber(
              tokenSubtitles.sizeXXL,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.subtitles.sizeXXL,
            ),
            weightSemiBold: asNumber(
              tokenSubtitles.weightSemiBold,
              DEFAULT_SITE_CONFIG.designSystem.tokens.typography.subtitles.weightSemiBold,
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
      motion: {
        durationFastMs: asBoundedNumber(
          motion.durationFastMs,
          DEFAULT_SITE_CONFIG.animation.motion.durationFastMs,
          60,
          600,
        ),
        durationBaseMs: asBoundedNumber(
          motion.durationBaseMs,
          DEFAULT_SITE_CONFIG.animation.motion.durationBaseMs,
          120,
          900,
        ),
        durationSlowMs: asBoundedNumber(
          motion.durationSlowMs,
          DEFAULT_SITE_CONFIG.animation.motion.durationSlowMs,
          180,
          1600,
        ),
        ease: asString(motion.ease, DEFAULT_SITE_CONFIG.animation.motion.ease),
        staggerMs: asBoundedNumber(
          motion.staggerMs,
          DEFAULT_SITE_CONFIG.animation.motion.staggerMs,
          0,
          420,
        ),
        hoverScale: asBoundedNumber(
          motion.hoverScale,
          DEFAULT_SITE_CONFIG.animation.motion.hoverScale,
          0.9,
          1.2,
        ),
        hoverLiftPx: asBoundedNumber(
          motion.hoverLiftPx,
          DEFAULT_SITE_CONFIG.animation.motion.hoverLiftPx,
          0,
          18,
        ),
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
        inputCooldownMs: asBoundedNumber(
          cinematicScroll.inputCooldownMs,
          DEFAULT_SITE_CONFIG.cinematicSequence.scroll.inputCooldownMs,
          0,
          2000,
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
      watermarkMaskEnabled: asBoolean(
        globalFrame.watermarkMaskEnabled,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskEnabled,
      ),
      watermarkMaskMobilePx: asBoundedNumber(
        globalFrame.watermarkMaskMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskMobilePx,
        0,
        240,
      ),
      watermarkMaskDesktopPx: asBoundedNumber(
        globalFrame.watermarkMaskDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskDesktopPx,
        0,
        320,
      ),
      watermarkMaskWidthMobilePx: asBoundedNumber(
        globalFrame.watermarkMaskWidthMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskWidthMobilePx,
        0,
        420,
      ),
      watermarkMaskWidthDesktopPx: asBoundedNumber(
        globalFrame.watermarkMaskWidthDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskWidthDesktopPx,
        0,
        520,
      ),
      watermarkMaskRightMobilePx: asBoundedNumber(
        globalFrame.watermarkMaskRightMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskRightMobilePx,
        0,
        160,
      ),
      watermarkMaskRightDesktopPx: asBoundedNumber(
        globalFrame.watermarkMaskRightDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskRightDesktopPx,
        0,
        240,
      ),
      watermarkMaskBottomMobilePx: asBoundedNumber(
        globalFrame.watermarkMaskBottomMobilePx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskBottomMobilePx,
        0,
        160,
      ),
      watermarkMaskBottomDesktopPx: asBoundedNumber(
        globalFrame.watermarkMaskBottomDesktopPx,
        DEFAULT_SITE_CONFIG.globalFrame.watermarkMaskBottomDesktopPx,
        0,
        240,
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
    crt: {
      enabled: asBoolean(crt?.enabled, DEFAULT_SITE_CONFIG.crt.enabled),
      intensity: (crt?.intensity === 'low' || crt?.intensity === 'medium' || crt?.intensity === 'high'
        ? crt.intensity
        : DEFAULT_SITE_CONFIG.crt.intensity) as 'low' | 'medium' | 'high',
      screenGeometry: {
        enabled: asBoolean(crt?.screenGeometry?.enabled, DEFAULT_SITE_CONFIG.crt.screenGeometry.enabled),
        curvature: asBoundedNumber(
          crt?.screenGeometry?.curvature,
          DEFAULT_SITE_CONFIG.crt.screenGeometry.curvature,
          0,
          1,
        ),
      },
      barrelCurvature: {
        enabled: asBoolean(crt?.barrelCurvature?.enabled, DEFAULT_SITE_CONFIG.crt.barrelCurvature.enabled),
        intensity: asBoundedNumber(
          crt?.barrelCurvature?.intensity,
          DEFAULT_SITE_CONFIG.crt.barrelCurvature.intensity,
          0,
          1,
        ),
      },
      vignette: {
        enabled: asBoolean((crt?.vignette as any)?.enabled, DEFAULT_SITE_CONFIG.crt.vignette.enabled),
        opacity: asBoundedNumber(crt?.vignette?.opacity, DEFAULT_SITE_CONFIG.crt.vignette.opacity, 0, 1),
        size: asBoundedNumber(crt?.vignette?.size, DEFAULT_SITE_CONFIG.crt.vignette.size, 0, 1),
      },
      analogSignal: {
        enabled: asBoolean(crt?.analogSignal?.enabled, DEFAULT_SITE_CONFIG.crt.analogSignal.enabled),
        interference: asBoundedNumber(
          crt?.analogSignal?.interference,
          DEFAULT_SITE_CONFIG.crt.analogSignal.interference,
          0,
          1,
        ),
        sync: asBoundedNumber(crt?.analogSignal?.sync, DEFAULT_SITE_CONFIG.crt.analogSignal.sync, 0, 1),
      },
      colorBleed: {
        enabled: asBoolean(crt?.colorBleed?.enabled, DEFAULT_SITE_CONFIG.crt.colorBleed.enabled),
        intensity: asBoundedNumber(crt?.colorBleed?.intensity, DEFAULT_SITE_CONFIG.crt.colorBleed.intensity, 0, 1),
        chromaticAberration: asBoundedNumber(
          crt?.colorBleed?.chromaticAberration,
          DEFAULT_SITE_CONFIG.crt.colorBleed.chromaticAberration,
          0,
          1,
        ),
      },
      staticNoise: {
        enabled: asBoolean(crt?.staticNoise?.enabled, DEFAULT_SITE_CONFIG.crt.staticNoise.enabled),
        intensity: asBoundedNumber(crt?.staticNoise?.intensity, DEFAULT_SITE_CONFIG.crt.staticNoise.intensity, 0, 1),
        speed: asBoundedNumber(crt?.staticNoise?.speed, DEFAULT_SITE_CONFIG.crt.staticNoise.speed, 0, 1),
      },
      phosphorDisplay: {
        enabled: asBoolean(crt?.phosphorDisplay?.enabled, DEFAULT_SITE_CONFIG.crt.phosphorDisplay.enabled),
        persistence: asBoundedNumber(
          crt?.phosphorDisplay?.persistence,
          DEFAULT_SITE_CONFIG.crt.phosphorDisplay.persistence,
          0,
          1,
        ),
        decay: asBoundedNumber(crt?.phosphorDisplay?.decay, DEFAULT_SITE_CONFIG.crt.phosphorDisplay.decay, 0, 1),
      },
      scanlines: {
        enabled: asBoolean(crt?.scanlines?.enabled, DEFAULT_SITE_CONFIG.crt.scanlines.enabled),
        intensity: asBoundedNumber(crt?.scanlines?.intensity, DEFAULT_SITE_CONFIG.crt.scanlines.intensity, 0, 1),
        thickness: asBoundedNumber(crt?.scanlines?.thickness, DEFAULT_SITE_CONFIG.crt.scanlines.thickness, 0, 5),
        gap: asBoundedNumber(crt?.scanlines?.gap, DEFAULT_SITE_CONFIG.crt.scanlines.gap, 0, 10),
      },
      phosphorMask: {
        enabled: asBoolean(crt?.phosphorMask?.enabled, DEFAULT_SITE_CONFIG.crt.phosphorMask.enabled),
        pattern: (crt?.phosphorMask?.pattern === 'none' ||
          crt?.phosphorMask?.pattern === 'rgb' ||
          crt?.phosphorMask?.pattern === 'aperture' ||
          crt?.phosphorMask?.pattern === 'slot'
          ? crt.phosphorMask.pattern
          : DEFAULT_SITE_CONFIG.crt.phosphorMask.pattern) as 'none' | 'rgb' | 'aperture' | 'slot',
        intensity: asBoundedNumber(crt?.phosphorMask?.intensity, DEFAULT_SITE_CONFIG.crt.phosphorMask.intensity, 0, 1),
      },
      phosphorGlow: {
        enabled: asBoolean((crt?.phosphorGlow as any)?.enabled, DEFAULT_SITE_CONFIG.crt.phosphorGlow.enabled),
        intensity: asBoundedNumber((crt?.phosphorGlow as any)?.intensity, DEFAULT_SITE_CONFIG.crt.phosphorGlow.intensity, 0, 1),
        spread: asBoundedNumber((crt?.phosphorGlow as any)?.spread, DEFAULT_SITE_CONFIG.crt.phosphorGlow.spread, 0, 1),
        color: asString((crt?.phosphorGlow as any)?.color, DEFAULT_SITE_CONFIG.crt.phosphorGlow.color),
      },
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
