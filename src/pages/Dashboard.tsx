import React, { useMemo, useRef, useState } from 'react';
import CursorAnimationLayer from '../components/CursorAnimationLayer';
import {
  getButtonClass,
  getCardClass,
  getGlassClass,
  getScaledRem,
  type SurfaceTone,
} from '../components/designSystem';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  DEFAULT_SITE_CONFIG,
  SITE_BUTTON_VARIANTS,
  SITE_CARD_VARIANTS,
  SITE_GLASS_VARIANTS,
  SITE_SOCIAL_ICON_KEYS,
  SITE_CONFIG_STORAGE_KEY,
  type SiteButtonVariant,
  type SiteCardVariant,
  type SiteCursorAnimationMode,
  type SiteGlassVariant,
  type SiteConfig,
  type SiteContentStatus,
  type SiteNavItem,
  type SiteArticle,
  type SiteProject,
  type SiteSection,
  type SiteTestimonial,
  type SiteTimelineEvent,
  type SiteScene05Certification,
  type SiteVideoItem,
} from '../config/siteConfig';

const DASHBOARD_PASSWORD = '00000008';
const DASHBOARD_AUTH_KEY = 'portfolio.dashboard.auth.v1';

const MAX_IMAGE_UPLOAD_BYTES = 1_500_000;
const MAX_AUDIO_UPLOAD_BYTES = 2_500_000;

type DashboardSectionId =
  | 'sequence'
  | 'intro'
  | 'featured'
  | 'projects'
  | 'timeline'
  | 'testimonials'
  | 'navigation'
  | 'footer'
  | 'visibility'
  | 'scene05'
  | 'designSystem'
  | 'animation'
  | 'articlesPage';

type DashboardWorkspace = 'settings' | 'writing';

const DASHBOARD_SECTIONS: Array<{ id: DashboardSectionId; label: string; hint: string }> = [
  { id: 'intro', label: 'Intro Window', hint: 'Opening text and intro card styling' },
  { id: 'scene05', label: 'About Page', hint: 'Profile layout, portrait, story, and certifications' },
  { id: 'featured', label: 'Featured Area', hint: 'Section headings and CTA copy' },
  { id: 'projects', label: 'Projects', hint: 'Project cards and media sources' },
  { id: 'testimonials', label: 'Testimonials', hint: 'Slider content and avatar cards' },
  { id: 'articlesPage', label: 'Articles Page', hint: 'Hero, filters, labels, and video copy' },
  { id: 'timeline', label: 'Career Timeline', hint: 'About page timeline milestones and descriptions' },
  { id: 'navigation', label: 'Navigation + Music', hint: 'Top bar links, CTA, and music controls' },
  { id: 'footer', label: 'Footer', hint: 'Contact, social, legal, and office details' },
  { id: 'visibility', label: 'Visibility', hint: 'Show/hide layers and major sections' },
  { id: 'sequence', label: 'Cinematic Flow', hint: 'Scene order, auto handoff, and portal frame' },
  { id: 'designSystem', label: 'Design System', hint: 'Tokens, foundations, and style mapping' },
  { id: 'animation', label: 'Animation Lab', hint: 'Cursor presets and motion timings' },
];

const DASHBOARD_SECTION_GROUPS: Array<{ id: string; label: string; sectionIds: DashboardSectionId[] }> = [
  {
    id: 'pages',
    label: 'Pages & Content',
    sectionIds: ['intro', 'scene05', 'featured', 'projects', 'testimonials', 'articlesPage', 'timeline', 'navigation', 'footer'],
  },
  {
    id: 'system-motion',
    label: 'System Layer',
    sectionIds: ['visibility', 'sequence', 'designSystem', 'animation'],
  },
];

const formatVariantLabel = (variant: string) => {
  if (variant.startsWith('button-')) return `Button ${variant.replace('button-', '')}`;
  if (variant.startsWith('card-')) return `Card ${variant.replace('card-', '')}`;
  if (variant.startsWith('glass-')) return `Glass ${variant.replace('glass-', '')}`;
  return variant;
};

const isValidSection = (value: string): value is SiteSection => {
  return ['home', 'about', 'projects', 'testimonials', 'articles'].includes(value);
};

const splitLines = (value: string) => {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const slugify = (value: string) => {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return normalized || `post-${Date.now()}`;
};

const toSafeNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toSafeNumberInRange = (value: string, fallback: number, min: number, max: number) => {
  const parsed = toSafeNumber(value, fallback);
  return Math.min(max, Math.max(min, parsed));
};

const formatMegabytes = (bytes: number) => {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Invalid file payload.'));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('Unable to read file.'));
    };
    reader.readAsDataURL(file);
  });
};

const Card: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, className }) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(18,18,22,0.92),rgba(8,8,11,0.86))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl ${
        className ?? ''
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <div className="mb-4 border-b border-white/8 pb-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/95">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-[12px] text-white/52">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
};

const SectionButton: React.FC<{
  label: string;
  hint: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, hint, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-[12px] border px-3 py-3 text-left transition-all duration-300 backdrop-blur-lg ${
        isActive
          ? 'border-white/32 bg-gradient-to-r from-white/16 via-white/8 to-transparent text-white shadow-[0_12px_24px_rgba(0,0,0,0.22)]'
          : 'border-white/10 bg-black/20 text-white/75 hover:border-white/22 hover:bg-white/8'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.15em]">{label}</p>
      <p className="mt-1 text-[12px] text-white/45 group-hover:text-white/62">{hint}</p>
    </button>
  );
};

const Input: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}> = ({ label, value, onChange, type = 'text', min, max, step }) => {
  if (type === 'number') {
    const stepValue = typeof step === 'number' && step > 0 ? step : 1;
    const decimals = (() => {
      const stepString = stepValue.toString();
      if (!stepString.includes('.')) return 0;
      return stepString.split('.')[1]?.length ?? 0;
    })();

    const clampValue = (next: number) => {
      let clamped = next;
      if (typeof min === 'number') clamped = Math.max(min, clamped);
      if (typeof max === 'number') clamped = Math.min(max, clamped);
      return clamped;
    };

    const formatNumber = (next: number) => {
      if (decimals <= 0) return `${Math.round(next)}`;
      return `${Number(next.toFixed(decimals))}`;
    };

    const parsedValue = typeof value === 'number' ? value : Number(value);
    const currentNumber = Number.isFinite(parsedValue)
      ? clampValue(parsedValue)
      : typeof min === 'number'
        ? min
        : 0;
    const showSlider = typeof min === 'number' && typeof max === 'number';

    const nudgeValue = (direction: -1 | 1) => {
      const nextValue = clampValue(currentNumber + direction * stepValue);
      onChange(formatNumber(nextValue));
    };

    return (
      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</span>
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => nudgeValue(-1)}
            className="rounded-[10px] border border-white/14 bg-black/30 px-3 text-[16px] leading-none text-white/85 transition-all hover:border-white/30 hover:bg-white/10"
            aria-label={`Decrease ${label}`}
          >
            -
          </button>

          <input
            type="number"
            min={min}
            max={max}
            step={stepValue}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1 rounded-[10px] border border-white/14 bg-[rgba(0,0,0,0.36)] px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
          />

          <button
            type="button"
            onClick={() => nudgeValue(1)}
            className="rounded-[10px] border border-white/14 bg-black/30 px-3 text-[16px] leading-none text-white/85 transition-all hover:border-white/30 hover:bg-white/10"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>

        {showSlider ? (
          <input
            type="range"
            min={min}
            max={max}
            step={stepValue}
            value={currentNumber}
            onChange={(e) => onChange(e.target.value)}
            className="accent-white"
          />
        ) : null}
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</span>
      <input
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-white/14 bg-[rgba(0,0,0,0.36)] px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
      />
    </label>
  );
};

const Textarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}> = ({ label, value, onChange, rows = 3 }) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-white/14 bg-[rgba(0,0,0,0.36)] px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
      />
    </label>
  );
};

const SelectInput: React.FC<{
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-white/14 bg-[rgba(0,0,0,0.36)] px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const VariantPickerTitle: React.FC<{ label: string; tone: SurfaceTone }> = ({ label, tone }) => {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
        tone === 'dark' ? 'text-white/70' : 'text-black/60'
      }`}
    >
      {label}
    </p>
  );
};

const ButtonVariantPicker: React.FC<{
  label: string;
  value: SiteButtonVariant;
  onChange: (variant: SiteButtonVariant) => void;
  tone?: SurfaceTone;
  sampleText?: string;
}> = ({ label, value, onChange, tone = 'dark', sampleText = 'Sample Action' }) => {
  const wrapperToneClass = tone === 'dark' ? 'bg-black/20 border-white/12' : 'bg-white/75 border-black/10';

  return (
    <div className="space-y-2">
      <VariantPickerTitle label={label} tone={tone} />
      <div className={`grid gap-2 rounded-[12px] border p-2 ${wrapperToneClass} sm:grid-cols-3`}>
        {SITE_BUTTON_VARIANTS.map((variant) => {
          const isActive = value === variant;
          return (
            <button
              key={variant}
              type="button"
              onClick={() => onChange(variant)}
              className={`rounded-[12px] p-1.5 text-left transition-all ${
                isActive
                  ? tone === 'dark'
                    ? 'bg-white/10 ring-1 ring-white/40'
                    : 'bg-black/5 ring-1 ring-black/30'
                  : tone === 'dark'
                    ? 'hover:bg-white/5'
                    : 'hover:bg-black/5'
              }`}
            >
              <span className={getButtonClass(variant, tone as SurfaceTone, 'sm', 'w-full justify-center')}>
                {sampleText}
              </span>
              <span
                className={`mt-1.5 block text-center font-mono text-[10px] uppercase tracking-[0.12em] ${
                  tone === 'dark' ? 'text-white/65' : 'text-black/55'
                }`}
              >
                {formatVariantLabel(variant)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CardVariantPicker: React.FC<{
  label: string;
  value: SiteCardVariant;
  glassVariant: SiteGlassVariant;
  onChange: (variant: SiteCardVariant) => void;
  tone?: SurfaceTone;
}> = ({ label, value, glassVariant, onChange, tone = 'dark' }) => {
  const wrapperToneClass = tone === 'dark' ? 'bg-black/20 border-white/12' : 'bg-white/75 border-black/10';
  const textToneClass = tone === 'dark' ? 'text-white/80' : 'text-black/75';

  return (
    <div className="space-y-2">
      <VariantPickerTitle label={label} tone={tone} />
      <div className={`grid gap-2 rounded-[12px] border p-2 ${wrapperToneClass} sm:grid-cols-2`}>
        {SITE_CARD_VARIANTS.map((variant) => {
          const isActive = value === variant;
          return (
            <button
              key={variant}
              type="button"
              onClick={() => onChange(variant)}
              className={`rounded-[12px] p-1.5 text-left transition-all ${
                isActive
                  ? tone === 'dark'
                    ? 'bg-white/10 ring-1 ring-white/40'
                    : 'bg-black/5 ring-1 ring-black/30'
                  : tone === 'dark'
                    ? 'hover:bg-white/5'
                    : 'hover:bg-black/5'
              }`}
            >
              <div
                className={`${getCardClass(variant, tone as SurfaceTone, 'p-3')} ${getGlassClass(
                  glassVariant,
                  tone as SurfaceTone,
                )}`}
              >
                <p className={`font-sans text-sm font-semibold ${textToneClass}`}>Card Surface</p>
                <p className={`mt-1 text-xs ${tone === 'dark' ? 'text-white/60' : 'text-black/55'}`}>
                  Glass depth and border behavior preview.
                </p>
              </div>
              <span
                className={`mt-1.5 block text-center font-mono text-[10px] uppercase tracking-[0.12em] ${
                  tone === 'dark' ? 'text-white/65' : 'text-black/55'
                }`}
              >
                {formatVariantLabel(variant)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const GlassVariantPicker: React.FC<{
  label: string;
  value: SiteGlassVariant;
  onChange: (variant: SiteGlassVariant) => void;
  tone?: SurfaceTone;
}> = ({ label, value, onChange, tone = 'dark' }) => {
  const wrapperToneClass = tone === 'dark' ? 'bg-black/20 border-white/12' : 'bg-white/75 border-black/10';

  return (
    <div className="space-y-2">
      <VariantPickerTitle label={label} tone={tone} />
      <div className={`grid gap-2 rounded-[12px] border p-2 ${wrapperToneClass} sm:grid-cols-3`}>
        {SITE_GLASS_VARIANTS.map((variant) => {
          const isActive = value === variant;
          return (
            <button
              key={variant}
              type="button"
              onClick={() => onChange(variant)}
              className={`rounded-[12px] p-1.5 text-left transition-all ${
                isActive
                  ? tone === 'dark'
                    ? 'bg-white/10 ring-1 ring-white/40'
                    : 'bg-black/5 ring-1 ring-black/30'
                  : tone === 'dark'
                    ? 'hover:bg-white/5'
                    : 'hover:bg-black/5'
              }`}
            >
              <div className={`${getGlassClass(variant, tone as SurfaceTone)} rounded-[10px] p-3`}>
                <p className={`font-mono text-[10px] uppercase tracking-[0.12em] ${tone === 'dark' ? 'text-white/75' : 'text-black/60'}`}>
                  Glass Surface
                </p>
              </div>
              <span
                className={`mt-1.5 block text-center font-mono text-[10px] uppercase tracking-[0.12em] ${
                  tone === 'dark' ? 'text-white/65' : 'text-black/55'
                }`}
              >
                {formatVariantLabel(variant)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-black/25 px-3 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/80">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  );
};

const listItemClass =
  'rounded-[12px] border border-white/12 bg-[rgba(0,0,0,0.3)] p-3 md:p-4 space-y-2.5';

export const Dashboard: React.FC = () => {
  const { siteConfig, setSiteConfig, resetSiteConfig } = useSiteConfig();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeWorkspace, setActiveWorkspace] = useState<DashboardWorkspace>('settings');
  const [activeSection, setActiveSection] = useState<DashboardSectionId>('sequence');
  const [writingPanel, setWritingPanel] = useState<'articles' | 'videos'>('articles');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeButtonStudio, setActiveButtonStudio] = useState<SiteButtonVariant>('button-1');
  const [activeCardStudio, setActiveCardStudio] = useState<SiteCardVariant>('card-1');
  const previewAnimationAreaRef = useRef<HTMLDivElement | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem(DASHBOARD_AUTH_KEY) === 'ok';
  });

  const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setSiteConfig((prev) => updater(prev));
    setHasUnsavedChanges(true);
  };

  const updateProject = (projectId: string, updater: (project: SiteProject) => SiteProject) => {
    updateConfig((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => (project.id === projectId ? updater(project) : project)),
    }));
  };

  const updateArticle = (articleId: string, updater: (article: SiteArticle) => SiteArticle) => {
    updateConfig((prev) => ({
      ...prev,
      articles: prev.articles.map((article) => (article.id === articleId ? updater(article) : article)),
    }));
  };

  const updateVideo = (videoId: string, updater: (video: SiteVideoItem) => SiteVideoItem) => {
    updateConfig((prev) => ({
      ...prev,
      videos: prev.videos.map((video) => (video.id === videoId ? updater(video) : video)),
    }));
  };

  const updateTimelineEvent = (
    eventId: string,
    updater: (prev: SiteTimelineEvent) => SiteTimelineEvent,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      journeyTimeline: prev.journeyTimeline.map((ev) =>
        ev.id === eventId ? updater(ev) : ev,
      ),
    }));
  };

  const updateTestimonial = (
    testimonialId: string,
    updater: (testimonial: SiteTestimonial) => SiteTestimonial,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial) =>
        testimonial.id === testimonialId ? updater(testimonial) : testimonial,
      ),
    }));
  };

  const updateScene05Certification = (
    certificationId: string,
    updater: (item: SiteScene05Certification) => SiteScene05Certification,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      scene05: {
        ...prev.scene05,
        featuredCertifications: prev.scene05.featuredCertifications.map((item) =>
          item.id === certificationId ? updater(item) : item,
        ),
      },
    }));
  };

  const updateDesignTheme = <K extends keyof SiteConfig['designSystem']['theme']>(
    key: K,
    value: SiteConfig['designSystem']['theme'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        theme: {
          ...prev.designSystem.theme,
          [key]: value,
        },
      },
    }));
  };

  const updateDesignComponent = <K extends keyof SiteConfig['designSystem']['components']>(
    key: K,
    value: SiteConfig['designSystem']['components'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        components: {
          ...prev.designSystem.components,
          [key]: value,
        },
      },
    }));
  };

  const updateFoundationTypography = <K extends keyof SiteConfig['designSystem']['foundation']['typography']>(
    key: K,
    value: SiteConfig['designSystem']['foundation']['typography'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        foundation: {
          ...prev.designSystem.foundation,
          typography: {
            ...prev.designSystem.foundation.typography,
            [key]: value,
          },
        },
      },
    }));
  };

  const updateFoundationSpacing = <K extends keyof SiteConfig['designSystem']['foundation']['spacing']>(
    key: K,
    value: SiteConfig['designSystem']['foundation']['spacing'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        foundation: {
          ...prev.designSystem.foundation,
          spacing: {
            ...prev.designSystem.foundation.spacing,
            [key]: value,
          },
        },
      },
    }));
  };

  const updateFoundationLayout = <K extends keyof SiteConfig['designSystem']['foundation']['layout']>(
    key: K,
    value: SiteConfig['designSystem']['foundation']['layout'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        foundation: {
          ...prev.designSystem.foundation,
          layout: {
            ...prev.designSystem.foundation.layout,
            [key]: value,
          },
        },
      },
    }));
  };

  const updateArticlesPageField = <K extends keyof SiteConfig['articlesPage']>(
    key: K,
    value: SiteConfig['articlesPage'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      articlesPage: {
        ...prev.articlesPage,
        [key]: value,
      },
    }));
  };

  const updateButtonPreset = (
    variant: SiteButtonVariant,
    patch: Partial<SiteConfig['designSystem']['componentStyles']['buttons'][SiteButtonVariant]>,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        componentStyles: {
          ...prev.designSystem.componentStyles,
          buttons: {
            ...prev.designSystem.componentStyles.buttons,
            [variant]: {
              ...prev.designSystem.componentStyles.buttons[variant],
              ...patch,
            },
          },
        },
      },
    }));
  };

  const updateCardPreset = (
    variant: SiteCardVariant,
    patch: Partial<SiteConfig['designSystem']['componentStyles']['cards'][SiteCardVariant]>,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      designSystem: {
        ...prev.designSystem,
        componentStyles: {
          ...prev.designSystem.componentStyles,
          cards: {
            ...prev.designSystem.componentStyles.cards,
            [variant]: {
              ...prev.designSystem.componentStyles.cards[variant],
              ...patch,
            },
          },
        },
      },
    }));
  };

  const updateMotionSystem = <K extends keyof SiteConfig['animation']['motion']>(
    key: K,
    value: SiteConfig['animation']['motion'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        motion: {
          ...prev.animation.motion,
          [key]: value,
        },
      },
    }));
  };

  const updateAnimationMode = (mode: SiteCursorAnimationMode) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        activeCursorAnimation: mode,
      },
    }));
  };

  const updateFluidCursor = <K extends keyof SiteConfig['animation']['cursor']>(
    key: K,
    value: SiteConfig['animation']['cursor'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        cursor: {
          ...prev.animation.cursor,
          [key]: value,
        },
      },
    }));
  };

  const updateAuraCursor = <K extends keyof SiteConfig['animation']['aura']>(
    key: K,
    value: SiteConfig['animation']['aura'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        aura: {
          ...prev.animation.aura,
          [key]: value,
        },
      },
    }));
  };

  const updateOrbitCursor = <K extends keyof SiteConfig['animation']['orbit']>(
    key: K,
    value: SiteConfig['animation']['orbit'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        orbit: {
          ...prev.animation.orbit,
          [key]: value,
        },
      },
    }));
  };

  const updateCometCursor = <K extends keyof SiteConfig['animation']['comet']>(
    key: K,
    value: SiteConfig['animation']['comet'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        comet: {
          ...prev.animation.comet,
          [key]: value,
        },
      },
    }));
  };

  const updateRippleCursor = <K extends keyof SiteConfig['animation']['ripple']>(
    key: K,
    value: SiteConfig['animation']['ripple'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        ripple: {
          ...prev.animation.ripple,
          [key]: value,
        },
      },
    }));
  };

  const updateSparkCursor = <K extends keyof SiteConfig['animation']['spark']>(
    key: K,
    value: SiteConfig['animation']['spark'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        spark: {
          ...prev.animation.spark,
          [key]: value,
        },
      },
    }));
  };

  const updateBeamCursor = <K extends keyof SiteConfig['animation']['beam']>(
    key: K,
    value: SiteConfig['animation']['beam'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        beam: {
          ...prev.animation.beam,
          [key]: value,
        },
      },
    }));
  };

  const updatePlasmaCursor = <K extends keyof SiteConfig['animation']['plasma']>(
    key: K,
    value: SiteConfig['animation']['plasma'][K],
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        plasma: {
          ...prev.animation.plasma,
          [key]: value,
        },
      },
    }));
  };

  const updateSectionAnimation = <K extends keyof SiteConfig['animation']['sections']>(
    section: K,
    patch: Partial<SiteConfig['animation']['sections'][K]>,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      animation: {
        ...prev.animation,
        sections: {
          ...prev.animation.sections,
          [section]: {
            ...prev.animation.sections[section],
            ...patch,
          },
        },
      },
    }));
  };

  const updateVisibility = <K extends keyof SiteConfig['visibility']>(key: K, value: SiteConfig['visibility'][K]) => {
    updateConfig((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: value,
      },
    }));
  };

  const clearUploadFeedback = () => {
    setUploadError('');
    setUploadMessage('');
  };

  const handleSaveChanges = () => {
    clearUploadFeedback();
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(siteConfig));
      setHasUnsavedChanges(false);
      setUploadMessage('Changes saved successfully.');
      return true;
    } catch {
      setUploadError('Unable to save changes. Try reducing uploaded file sizes and save again.');
      return false;
    }
  };

  const handleOpenSite = () => {
    const didSave = handleSaveChanges();
    if (!didSave) return;
    window.location.hash = '#/';
  };

  const handleMusicUpload = async (file: File | null) => {
    clearUploadFeedback();
    if (!file) return;

    if (file.size > MAX_AUDIO_UPLOAD_BYTES) {
      setUploadError(
        `Audio file is too large. Keep it under ${formatMegabytes(MAX_AUDIO_UPLOAD_BYTES)} for reliable local save.`,
      );
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateConfig((prev) => ({
        ...prev,
        persistentUI: { ...prev.persistentUI, musicSrc: dataUrl },
      }));
      setUploadMessage(`Music file "${file.name}" uploaded successfully.`);
    } catch {
      setUploadError('Could not read the selected audio file.');
    }
  };

  const handleProjectImageUpload = async (project: SiteProject, file: File | null) => {
    clearUploadFeedback();
    if (!file) return;

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      setUploadError(
        `Image is too large. Keep it under ${formatMegabytes(MAX_IMAGE_UPLOAD_BYTES)} for reliable local save.`,
      );
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateProject(project.id, (item) => ({ ...item, img: dataUrl }));
      setUploadMessage(`Image for "${project.title}" updated.`);
    } catch {
      setUploadError('Could not read the selected image file.');
    }
  };

  const stats = useMemo(() => {
    return {
      projects: siteConfig.projects.length,
      testimonials: siteConfig.testimonials.length,
      navItems: siteConfig.persistentUI.navItems.length,
      articles: siteConfig.articles.length,
      publishedArticles: siteConfig.articles.filter((item) => item.status === 'published').length,
      videos: siteConfig.videos.length,
      publishedVideos: siteConfig.videos.filter((item) => item.status === 'published').length,
    };
  }, [siteConfig]);

  const activeSectionInfo =
    DASHBOARD_SECTIONS.find((section) => section.id === activeSection) ?? DASHBOARD_SECTIONS[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== DASHBOARD_PASSWORD) {
      setAuthError('Wrong password');
      return;
    }

    setAuthError('');
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DASHBOARD_AUTH_KEY, 'ok');
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPassword('');
    setAuthError('');
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(DASHBOARD_AUTH_KEY);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'sequence':
        return (
          <div className="grid gap-4 xl:grid-cols-2">
            <Card title="Cinematic Sequence" subtitle="Control scene handoff from About to Projects">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Wheel intensity"
                  type="number"
                  min={0.00002}
                  max={0.0003}
                  step={0.00001}
                  value={siteConfig.cinematicSequence.scroll.wheelIntensity}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          wheelIntensity: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.wheelIntensity,
                            0.00002,
                            0.0003,
                          ),
                        },
                      },
                    }))
                  }
                />
                <Input
                  label="Max wheel delta"
                  type="number"
                  min={10}
                  max={200}
                  step={1}
                  value={siteConfig.cinematicSequence.scroll.maxWheelDelta}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          maxWheelDelta: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.maxWheelDelta,
                            10,
                            200,
                          ),
                        },
                      },
                    }))
                  }
                />
                <Input
                  label="Smoothing duration (ms)"
                  type="number"
                  min={120}
                  max={2400}
                  step={20}
                  value={siteConfig.cinematicSequence.scroll.smoothDurationMs}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          smoothDurationMs: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.smoothDurationMs,
                            120,
                            2400,
                          ),
                        },
                      },
                    }))
                  }
                />
                <Input
                  label="Momentum damping"
                  type="number"
                  min={0.6}
                  max={0.98}
                  step={0.01}
                  value={siteConfig.cinematicSequence.scroll.momentumDamping}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          momentumDamping: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.momentumDamping,
                            0.6,
                            0.98,
                          ),
                        },
                      },
                    }))
                  }
                />
                <Input
                  label="Touch multiplier"
                  type="number"
                  min={0.5}
                  max={6}
                  step={0.1}
                  value={siteConfig.cinematicSequence.scroll.touchMultiplier}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          touchMultiplier: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.touchMultiplier,
                            0.5,
                            6,
                          ),
                        },
                      },
                    }))
                  }
                />
                <Input
                  label="Keyboard step"
                  type="number"
                  min={0.02}
                  max={0.2}
                  step={0.01}
                  value={siteConfig.cinematicSequence.scroll.keyboardStep}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      cinematicSequence: {
                        ...prev.cinematicSequence,
                        scroll: {
                          ...prev.cinematicSequence.scroll,
                          keyboardStep: toSafeNumberInRange(
                            next,
                            prev.cinematicSequence.scroll.keyboardStep,
                            0.02,
                            0.2,
                          ),
                        },
                      },
                    }))
                  }
                />
              </div>

              <Input
                label="Pause before portfolio reveal (ms)"
                type="number"
                min={0}
                max={6000}
                step={50}
                value={siteConfig.cinematicSequence.scene06PauseMs}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    cinematicSequence: {
                      ...prev.cinematicSequence,
                      scene06PauseMs: toSafeNumberInRange(next, prev.cinematicSequence.scene06PauseMs, 0, 6000),
                    },
                  }))
                }
              />

              <p className="rounded-[10px] border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/58">
                Tune hero scroll sensitivity, touch feel, and easing when moving between the cinematic frames. Pause timing still controls how long the About closet holds before the Projects reveal.
              </p>
            </Card>

            <Card title="Portal Frame Window" subtitle="Edit the first-scene window size, offsets, and matte tone">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Top offset mobile (px)"
                  type="number"
                  min={0}
                  max={360}
                  step={1}
                  value={siteConfig.globalFrame.topOffsetMobilePx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        topOffsetMobilePx: toSafeNumberInRange(next, prev.globalFrame.topOffsetMobilePx, 0, 360),
                      },
                    }))
                  }
                />
                <Input
                  label="Top offset desktop (px)"
                  type="number"
                  min={0}
                  max={500}
                  step={1}
                  value={siteConfig.globalFrame.topOffsetDesktopPx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        topOffsetDesktopPx: toSafeNumberInRange(next, prev.globalFrame.topOffsetDesktopPx, 0, 500),
                      },
                    }))
                  }
                />
                <Input
                  label="Bottom offset mobile (px)"
                  type="number"
                  min={0}
                  max={300}
                  step={1}
                  value={siteConfig.globalFrame.bottomOffsetMobilePx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        bottomOffsetMobilePx: toSafeNumberInRange(next, prev.globalFrame.bottomOffsetMobilePx, 0, 300),
                      },
                    }))
                  }
                />
                <Input
                  label="Bottom offset desktop (px)"
                  type="number"
                  min={0}
                  max={360}
                  step={1}
                  value={siteConfig.globalFrame.bottomOffsetDesktopPx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        bottomOffsetDesktopPx: toSafeNumberInRange(next, prev.globalFrame.bottomOffsetDesktopPx, 0, 360),
                      },
                    }))
                  }
                />
                <Input
                  label="Side offset mobile (px)"
                  type="number"
                  min={0}
                  max={220}
                  step={1}
                  value={siteConfig.globalFrame.sideOffsetMobilePx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        sideOffsetMobilePx: toSafeNumberInRange(next, prev.globalFrame.sideOffsetMobilePx, 0, 220),
                      },
                    }))
                  }
                />
                <Input
                  label="Side offset desktop (px)"
                  type="number"
                  min={0}
                  max={300}
                  step={1}
                  value={siteConfig.globalFrame.sideOffsetDesktopPx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        sideOffsetDesktopPx: toSafeNumberInRange(next, prev.globalFrame.sideOffsetDesktopPx, 0, 300),
                      },
                    }))
                  }
                />
                <Input
                  label="Top radius mobile (px)"
                  type="number"
                  min={8}
                  max={240}
                  step={1}
                  value={siteConfig.globalFrame.topRadiusMobilePx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        topRadiusMobilePx: toSafeNumberInRange(next, prev.globalFrame.topRadiusMobilePx, 8, 240),
                      },
                    }))
                  }
                />
                <Input
                  label="Top radius desktop (px)"
                  type="number"
                  min={8}
                  max={320}
                  step={1}
                  value={siteConfig.globalFrame.topRadiusDesktopPx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        topRadiusDesktopPx: toSafeNumberInRange(next, prev.globalFrame.topRadiusDesktopPx, 8, 320),
                      },
                    }))
                  }
                />
                <Input
                  label="Bottom radius (px)"
                  type="number"
                  min={0}
                  max={120}
                  step={1}
                  value={siteConfig.globalFrame.bottomRadiusPx}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        bottomRadiusPx: toSafeNumberInRange(next, prev.globalFrame.bottomRadiusPx, 0, 120),
                      },
                    }))
                  }
                />
                <Input
                  label="Matte color"
                  value={siteConfig.globalFrame.matteColor}
                  onChange={(next) =>
                    updateConfig((prev) => ({
                      ...prev,
                      globalFrame: {
                        ...prev.globalFrame,
                        matteColor: next,
                      },
                    }))
                  }
                />
              </div>
            </Card>
          </div>
        );

      case 'intro':
        return (
          <div className="grid gap-4">
            <Card title="Intro Text" subtitle="Main cinematic sentence on page load">
              <Textarea
                label="Intro paragraph"
                value={siteConfig.introText}
                rows={5}
                onChange={(next) => updateConfig((prev) => ({ ...prev, introText: next }))}
              />
              <CardVariantPicker
                label="Intro window card type"
                value={siteConfig.designSystem.components.introCardVariant}
                glassVariant={siteConfig.designSystem.components.globalGlassVariant}
                onChange={(next) => updateDesignComponent('introCardVariant', next as SiteCardVariant)}
              />
            </Card>
          </div>
        );

      case 'featured':
        return (
          <div className="grid gap-4">
            <Card title="Featured Section" subtitle="Headline, labels, CTA text">
              <Input
                label="Title line 1"
                value={siteConfig.featured.titleLine1}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, titleLine1: next } }))
                }
              />
              <Input
                label="Title line 2"
                value={siteConfig.featured.titleLine2}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, titleLine2: next } }))
                }
              />
              <Textarea
                label="Section description"
                value={siteConfig.featured.description}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, description: next } }))
                }
              />
              <Input
                label="Case Study button label"
                value={siteConfig.featured.caseStudyLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, caseStudyLabel: next } }))
                }
              />
              <Input
                label="Live button label"
                value={siteConfig.featured.liveLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, liveLabel: next } }))
                }
              />
              <Input
                label="View All button label"
                value={siteConfig.featured.viewAllLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, viewAllLabel: next } }))
                }
              />
              <Input
                label="CTA title line 1"
                value={siteConfig.featured.ctaTitleLine1}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, ctaTitleLine1: next } }))
                }
              />
              <Input
                label="CTA title line 2"
                value={siteConfig.featured.ctaTitleLine2}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, ctaTitleLine2: next } }))
                }
              />
              <Textarea
                label="CTA description"
                value={siteConfig.featured.ctaDescription}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, ctaDescription: next } }))
                }
              />
              <Input
                label="CTA button text"
                value={siteConfig.featured.ctaButtonText}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, ctaButtonText: next } }))
                }
              />
              <Input
                label="CTA button link"
                value={siteConfig.featured.ctaButtonHref}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, featured: { ...prev.featured, ctaButtonHref: next } }))
                }
              />

              <div className="space-y-3 rounded-[12px] border border-white/10 bg-black/20 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Style mapping for this section
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <CardVariantPicker
                    label="Project card type"
                    value={siteConfig.designSystem.components.featuredProjectCardVariant}
                    glassVariant={siteConfig.designSystem.components.globalGlassVariant}
                    onChange={(next) =>
                      updateDesignComponent('featuredProjectCardVariant', next as SiteCardVariant)
                    }
                  />
                  <ButtonVariantPicker
                    label="Project link buttons"
                    value={siteConfig.designSystem.components.featuredProjectButtonVariant}
                    onChange={(next) =>
                      updateDesignComponent('featuredProjectButtonVariant', next as SiteButtonVariant)
                    }
                    sampleText={siteConfig.featured.caseStudyLabel || 'Case Study'}
                  />
                  <ButtonVariantPicker
                    label="View All button"
                    value={siteConfig.designSystem.components.featuredViewAllButtonVariant}
                    onChange={(next) =>
                      updateDesignComponent('featuredViewAllButtonVariant', next as SiteButtonVariant)
                    }
                    sampleText={siteConfig.featured.viewAllLabel || 'View All'}
                  />
                  <ButtonVariantPicker
                    label="CTA button"
                    value={siteConfig.designSystem.components.featuredCtaButtonVariant}
                    onChange={(next) => updateDesignComponent('featuredCtaButtonVariant', next as SiteButtonVariant)}
                    sampleText={siteConfig.featured.ctaButtonText || 'Start Project'}
                  />
                </div>
              </div>
            </Card>
          </div>
        );

      case 'projects':
        return (
          <div className="grid gap-4">
            <Card title="Projects" subtitle="Edit, add, remove cards + upload images">
              <p className="text-xs text-white/55">
                You can upload image files directly. For local storage reliability keep each image under{' '}
                {formatMegabytes(MAX_IMAGE_UPLOAD_BYTES)}.
              </p>

              {siteConfig.projects.map((project) => (
                <div key={project.id} className={listItemClass}>
                  <div className="overflow-hidden rounded-[10px] border border-white/10 bg-black/20">
                    <img src={project.img} alt={project.title} className="h-40 w-full object-cover" />
                  </div>

                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                      Upload project image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        e.currentTarget.value = '';
                        void handleProjectImageUpload(project, file);
                      }}
                      className="rounded-[10px] border border-white/15 bg-black/30 px-3 py-2 text-xs text-white/85 file:mr-3 file:rounded-[8px] file:border-0 file:bg-white/15 file:px-2.5 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/20"
                    />
                  </label>

                  <Input
                    label="Title"
                    value={project.title}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, title: next }))}
                  />
                  <Toggle
                    label="Visible on site"
                    checked={project.visible}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, visible: next }))}
                  />
                  <Textarea
                    label="Tags"
                    value={project.tags}
                    rows={2}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, tags: next }))}
                  />
                  <Input
                    label="Image path / data URL"
                    value={project.img}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, img: next }))}
                  />
                  <Input
                    label="Case Study URL"
                    value={project.behance}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, behance: next }))}
                  />
                  <Input
                    label="Live URL"
                    value={project.live}
                    onChange={(next) => updateProject(project.id, (item) => ({ ...item, live: next }))}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        projects: prev.projects.filter((item) => item.id !== project.id),
                      }));
                    }}
                    className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                  >
                    Remove Project
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const nextProject: SiteProject = {
                    id: `project-${Date.now()}`,
                    title: 'New Project',
                    tags: 'WEB • DESIGN',
                    img: '/frames/scene-02-desk-focus/ezgif-frame-001.jpg',
                    behance: '#',
                    live: '#',
                    visible: true,
                  };
                  updateConfig((prev) => ({
                    ...prev,
                    projects: [...prev.projects, nextProject],
                  }));
                }}
                className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Project
              </button>
            </Card>
          </div>
        );

      case 'timeline':
        return (
          <div className="grid gap-4">
            <Card title="Journey Timeline" subtitle="Edit vertical timeline events">
              {siteConfig.journeyTimeline.map((event) => (
                <div key={event.id} className={listItemClass}>
                  <Input
                    label="Role"
                    value={event.role}
                    onChange={(next) => updateTimelineEvent(event.id, (item) => ({ ...item, role: next }))}
                  />
                  <Input
                    label="Company / Title"
                    value={event.title}
                    onChange={(next) => updateTimelineEvent(event.id, (item) => ({ ...item, title: next }))}
                  />
                  <Input
                    label="Date / Period"
                    value={event.date}
                    onChange={(next) => updateTimelineEvent(event.id, (item) => ({ ...item, date: next }))}
                  />
                  <Textarea
                    label="Description"
                    value={event.description}
                    rows={3}
                    onChange={(next) => updateTimelineEvent(event.id, (item) => ({ ...item, description: next }))}
                  />
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <Toggle
                      label="Visible"
                      checked={event.visible}
                      onChange={(next) => updateTimelineEvent(event.id, (item) => ({ ...item, visible: next }))}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateConfig((prev) => ({
                          ...prev,
                          journeyTimeline: prev.journeyTimeline.filter((item) => item.id !== event.id),
                        }));
                      }}
                      className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newEvent: SiteTimelineEvent = {
                    id: `timeline-${Date.now()}`,
                    title: 'New Company',
                    role: 'New Role',
                    date: 'Present',
                    description: 'Role description',
                    visible: true,
                  };
                  updateConfig((prev) => ({
                    ...prev,
                    journeyTimeline: [...prev.journeyTimeline, newEvent],
                  }));
                }}
                className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Timeline Event
              </button>
            </Card>
          </div>
        );

      case 'testimonials':
        return (
          <div className="grid gap-4">
            <Card title="Testimonials" subtitle="Edit slider content">
              {siteConfig.testimonials.map((testimonial) => (
                <div key={testimonial.id} className={listItemClass}>
                  <Input
                    label="Name"
                    value={testimonial.name}
                    onChange={(next) => updateTestimonial(testimonial.id, (item) => ({ ...item, name: next }))}
                  />
                  <Toggle
                    label="Visible on site"
                    checked={testimonial.visible}
                    onChange={(next) => updateTestimonial(testimonial.id, (item) => ({ ...item, visible: next }))}
                  />
                  <Input
                    label="Title"
                    value={testimonial.title}
                    onChange={(next) => updateTestimonial(testimonial.id, (item) => ({ ...item, title: next }))}
                  />
                  <Textarea
                    label="Quote"
                    value={testimonial.quote}
                    rows={4}
                    onChange={(next) => updateTestimonial(testimonial.id, (item) => ({ ...item, quote: next }))}
                  />
                  <Input
                    label="Avatar URL"
                    value={testimonial.avatar}
                    onChange={(next) => updateTestimonial(testimonial.id, (item) => ({ ...item, avatar: next }))}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.filter((item) => item.id !== testimonial.id),
                      }));
                    }}
                    className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                  >
                    Remove Testimonial
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const nextTestimonial: SiteTestimonial = {
                    id: `testimonial-${Date.now()}`,
                    name: 'New Name',
                    title: 'New Title',
                    quote: 'New quote',
                    avatar: 'https://i.pravatar.cc/150?u=new',
                    visible: true,
                  };
                  updateConfig((prev) => ({
                    ...prev,
                    testimonials: [...prev.testimonials, nextTestimonial],
                  }));
                }}
                className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Testimonial
              </button>

              <ButtonVariantPicker
                label="Testimonials pagination button type"
                value={siteConfig.designSystem.components.testimonialsPaginationButtonVariant}
                onChange={(next) =>
                  updateDesignComponent('testimonialsPaginationButtonVariant', next as SiteButtonVariant)
                }
                tone="light"
                sampleText="Dot Button"
              />
            </Card>
          </div>
        );

      case 'articlesPage':
        return (
          <div className="grid gap-4">
            <Card title="Articles Page Copy" subtitle="Control the global copy seen on /articles">
              <Input
                label="Page title"
                value={siteConfig.articlesPage.title}
                onChange={(next) => updateArticlesPageField('title', next)}
              />
              <Input
                label="Page subtitle"
                value={siteConfig.articlesPage.subtitle}
                onChange={(next) => updateArticlesPageField('subtitle', next)}
              />
              <Textarea
                label="Page description"
                value={siteConfig.articlesPage.description}
                rows={4}
                onChange={(next) => updateArticlesPageField('description', next)}
              />

              <div className="grid gap-3 rounded-[12px] border border-white/10 bg-black/20 p-3 md:grid-cols-2">
                <Input
                  label="Search placeholder"
                  value={siteConfig.articlesPage.searchPlaceholder}
                  onChange={(next) => updateArticlesPageField('searchPlaceholder', next)}
                />
                <Input
                  label="All topics filter label"
                  value={siteConfig.articlesPage.allTopicsLabel}
                  onChange={(next) => updateArticlesPageField('allTopicsLabel', next)}
                />
                <Input
                  label="Continue reading label"
                  value={siteConfig.articlesPage.continueReadingLabel}
                  onChange={(next) => updateArticlesPageField('continueReadingLabel', next)}
                />
                <Input
                  label="Reading time suffix"
                  value={siteConfig.articlesPage.minReadLabel}
                  onChange={(next) => updateArticlesPageField('minReadLabel', next)}
                />
                <Input
                  label="Byline prefix"
                  value={siteConfig.articlesPage.byAuthorPrefix}
                  onChange={(next) => updateArticlesPageField('byAuthorPrefix', next)}
                />
                <Input
                  label="Featured article badge"
                  value={siteConfig.articlesPage.featuredArticleLabel}
                  onChange={(next) => updateArticlesPageField('featuredArticleLabel', next)}
                />
              </div>

              <Input
                label="Latest articles label"
                value={siteConfig.articlesPage.latestArticlesLabel}
                onChange={(next) => updateArticlesPageField('latestArticlesLabel', next)}
              />

              <div className="grid gap-3 rounded-[12px] border border-white/10 bg-black/20 p-3 md:grid-cols-2">
                <Input
                  label="No results title"
                  value={siteConfig.articlesPage.noResultsTitle}
                  onChange={(next) => updateArticlesPageField('noResultsTitle', next)}
                />
                <Input
                  label="No results description"
                  value={siteConfig.articlesPage.noResultsDescription}
                  onChange={(next) => updateArticlesPageField('noResultsDescription', next)}
                />
                <Input
                  label="Previous page label"
                  value={siteConfig.articlesPage.previousPageLabel}
                  onChange={(next) => updateArticlesPageField('previousPageLabel', next)}
                />
                <Input
                  label="Next page label"
                  value={siteConfig.articlesPage.nextPageLabel}
                  onChange={(next) => updateArticlesPageField('nextPageLabel', next)}
                />
              </div>

              <Input
                label="Videos section title"
                value={siteConfig.articlesPage.videosSectionTitle}
                onChange={(next) => updateArticlesPageField('videosSectionTitle', next)}
              />
              <Textarea
                label="Videos section description"
                value={siteConfig.articlesPage.videosSectionDescription}
                rows={3}
                onChange={(next) => updateArticlesPageField('videosSectionDescription', next)}
              />

              <div className="grid gap-3 rounded-[12px] border border-white/10 bg-black/20 p-3 md:grid-cols-2">
                <Input
                  label="Article not found title"
                  value={siteConfig.articlesPage.articleNotFoundTitle}
                  onChange={(next) => updateArticlesPageField('articleNotFoundTitle', next)}
                />
                <Input
                  label="Article not found description"
                  value={siteConfig.articlesPage.articleNotFoundDescription}
                  onChange={(next) => updateArticlesPageField('articleNotFoundDescription', next)}
                />
                <Input
                  label="Back to articles label"
                  value={siteConfig.articlesPage.backToArticlesLabel}
                  onChange={(next) => updateArticlesPageField('backToArticlesLabel', next)}
                />
                <Input
                  label="Related video label"
                  value={siteConfig.articlesPage.relatedVideoLabel}
                  onChange={(next) => updateArticlesPageField('relatedVideoLabel', next)}
                />
                <Input
                  label="Open video button label"
                  value={siteConfig.articlesPage.openVideoLabel}
                  onChange={(next) => updateArticlesPageField('openVideoLabel', next)}
                />
                <Input
                  label="Watch video button label"
                  value={siteConfig.articlesPage.watchVideoLabel}
                  onChange={(next) => updateArticlesPageField('watchVideoLabel', next)}
                />
                <Input
                  label="No thumbnail label"
                  value={siteConfig.articlesPage.noThumbnailLabel}
                  onChange={(next) => updateArticlesPageField('noThumbnailLabel', next)}
                />
              </div>

              <div className="grid gap-3 rounded-[12px] border border-white/10 bg-black/20 p-3 md:grid-cols-2">
                <Input
                  label="Newsletter title"
                  value={siteConfig.articlesPage.newsletterTitle}
                  onChange={(next) => updateArticlesPageField('newsletterTitle', next)}
                />
                <Input
                  label="Newsletter button label"
                  value={siteConfig.articlesPage.newsletterButtonLabel}
                  onChange={(next) => updateArticlesPageField('newsletterButtonLabel', next)}
                />
                <Input
                  label="Newsletter input placeholder"
                  value={siteConfig.articlesPage.newsletterInputPlaceholder}
                  onChange={(next) => updateArticlesPageField('newsletterInputPlaceholder', next)}
                />
                <Textarea
                  label="Newsletter description"
                  value={siteConfig.articlesPage.newsletterDescription}
                  rows={3}
                  onChange={(next) => updateArticlesPageField('newsletterDescription', next)}
                />
              </div>
            </Card>
          </div>
        );

      case 'navigation':
        return (
          <div className="grid gap-4 xl:grid-cols-2">
            <Card title="Music + CTA Button" subtitle="Audio upload and persistent controls">
              <p className="text-xs text-white/55">
                Upload an audio file for site music. Keep the file under {formatMegabytes(MAX_AUDIO_UPLOAD_BYTES)} so
                it can be saved reliably in browser storage.
              </p>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Upload music</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    e.currentTarget.value = '';
                    void handleMusicUpload(file);
                  }}
                  className="rounded-[10px] border border-white/15 bg-black/30 px-3 py-2 text-xs text-white/85 file:mr-3 file:rounded-[8px] file:border-0 file:bg-white/15 file:px-2.5 file:py-1.5 file:text-xs file:text-white hover:file:bg-white/20"
                />
              </label>

              <audio controls src={siteConfig.persistentUI.musicSrc} className="w-full" />

              <Input
                label="Music source URL / data URL"
                value={siteConfig.persistentUI.musicSrc}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    persistentUI: { ...prev.persistentUI, musicSrc: next },
                  }))
                }
              />
              <Input
                label="Music volume"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={siteConfig.persistentUI.musicVolume}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    persistentUI: {
                      ...prev.persistentUI,
                      musicVolume: toSafeNumber(next, prev.persistentUI.musicVolume),
                    },
                  }))
                }
              />
              <Input
                label="Let's Talk label"
                value={siteConfig.persistentUI.letsTalkLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    persistentUI: { ...prev.persistentUI, letsTalkLabel: next },
                  }))
                }
              />
              <Input
                label="Let's Talk link"
                value={siteConfig.persistentUI.letsTalkHref}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    persistentUI: { ...prev.persistentUI, letsTalkHref: next },
                  }))
                }
              />

              <div className="space-y-3 rounded-[12px] border border-white/10 bg-black/20 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Style mapping for navigation
                </p>
                <CardVariantPicker
                  label="Navigation glass card"
                  value={siteConfig.designSystem.components.navigationShellCardVariant}
                  glassVariant={siteConfig.designSystem.components.navigationGlassVariant}
                  onChange={(next) => updateDesignComponent('navigationShellCardVariant', next as SiteCardVariant)}
                />
                <GlassVariantPicker
                  label="Navigation glass type"
                  value={siteConfig.designSystem.components.navigationGlassVariant}
                  onChange={(next) => updateDesignComponent('navigationGlassVariant', next as SiteGlassVariant)}
                />
                <ButtonVariantPicker
                  label="Music toggle button"
                  value={siteConfig.designSystem.components.musicToggleButtonVariant}
                  onChange={(next) => updateDesignComponent('musicToggleButtonVariant', next as SiteButtonVariant)}
                  sampleText="Music"
                />
                <ButtonVariantPicker
                  label="Let's Talk button"
                  value={siteConfig.designSystem.components.persistentLetsTalkButtonVariant}
                  onChange={(next) =>
                    updateDesignComponent('persistentLetsTalkButtonVariant', next as SiteButtonVariant)
                  }
                  sampleText={siteConfig.persistentUI.letsTalkLabel || 'Let\'s Talk'}
                />
              </div>
            </Card>

            <Card title="Navigation Labels" subtitle="Desktop and mobile menu items">
              {siteConfig.persistentUI.navItems.map((item) => (
                <div key={item.id} className={listItemClass}>
                  <Input
                    label="Label"
                    value={item.label}
                    onChange={(next) => {
                      updateConfig((prev) => ({
                        ...prev,
                        persistentUI: {
                          ...prev.persistentUI,
                          navItems: prev.persistentUI.navItems.map((navItem) =>
                            navItem.id === item.id ? { ...navItem, label: next } : navItem,
                          ),
                        },
                      }));
                    }}
                  />

                  <Toggle
                    label="Visible on site"
                    checked={item.visible}
                    onChange={(next) => {
                      updateConfig((prev) => ({
                        ...prev,
                        persistentUI: {
                          ...prev.persistentUI,
                          navItems: prev.persistentUI.navItems.map((navItem) =>
                            navItem.id === item.id ? { ...navItem, visible: next } : navItem,
                          ),
                        },
                      }));
                    }}
                  />

                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Section</span>
                    <select
                      value={item.section}
                      onChange={(e) => {
                        const nextSection = e.target.value;
                        if (!isValidSection(nextSection)) return;
                        updateConfig((prev) => ({
                          ...prev,
                          persistentUI: {
                            ...prev.persistentUI,
                            navItems: prev.persistentUI.navItems.map((navItem) =>
                              navItem.id === item.id ? { ...navItem, section: nextSection } : navItem,
                            ),
                          },
                        }));
                      }}
                      className="rounded-[10px] border border-white/15 bg-black/35 px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                    >
                      <option value="home">home</option>
                      <option value="about">about</option>
                      <option value="projects">projects</option>
                      <option value="testimonials">testimonials</option>
                      <option value="articles">articles</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        persistentUI: {
                          ...prev.persistentUI,
                          navItems: prev.persistentUI.navItems.filter((navItem) => navItem.id !== item.id),
                        },
                      }));
                    }}
                    className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                  >
                    Remove Nav Item
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const nextNavItem: SiteNavItem = {
                    id: `nav-${Date.now()}`,
                    label: 'New Item',
                    section: 'home',
                    visible: true,
                  };
                  updateConfig((prev) => ({
                    ...prev,
                    persistentUI: {
                      ...prev.persistentUI,
                      navItems: [...prev.persistentUI.navItems, nextNavItem],
                    },
                  }));
                }}
                className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Nav Item
              </button>
            </Card>
          </div>
        );

      case 'footer':
        return (
          <div className="grid gap-4">
            <Card title="Footer + Social + Legal" subtitle="Email, address, links, socials">
              <Input
                label="Footer email"
                value={siteConfig.footer.email}
                onChange={(next) => updateConfig((prev) => ({ ...prev, footer: { ...prev.footer, email: next } }))}
              />
              <div className="space-y-2 rounded-[10px] border border-white/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Social links</p>
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          socialLinks: [
                            ...prev.footer.socialLinks,
                            {
                              id: `social-${Date.now()}`,
                              label: 'New Social',
                              href: 'https://',
                              icon: 'globe',
                              visible: true,
                            },
                          ],
                        },
                      }));
                    }}
                    className="rounded-[8px] border border-white/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
                  >
                    Add Social Link
                  </button>
                </div>

                {siteConfig.footer.socialLinks.map((link) => (
                  <div key={link.id} className="grid gap-2 rounded-[10px] border border-white/10 bg-black/20 p-3">
                    <Input
                      label="Label"
                      value={link.label}
                      onChange={(next) => {
                        updateConfig((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            socialLinks: prev.footer.socialLinks.map((item) =>
                              item.id === link.id ? { ...item, label: next } : item,
                            ),
                          },
                        }));
                      }}
                    />

                    <div className="grid gap-2 md:grid-cols-2">
                      <SelectInput
                        label="Icon"
                        value={link.icon}
                        options={SITE_SOCIAL_ICON_KEYS.map((iconKey) => ({
                          value: iconKey,
                          label: iconKey,
                        }))}
                        onChange={(next) => {
                          updateConfig((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              socialLinks: prev.footer.socialLinks.map((item) =>
                                item.id === link.id
                                  ? {
                                      ...item,
                                      icon: next as SiteConfig['footer']['socialLinks'][number]['icon'],
                                    }
                                  : item,
                              ),
                            },
                          }));
                        }}
                      />

                      <Input
                        label="Href"
                        value={link.href}
                        onChange={(next) => {
                          updateConfig((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              socialLinks: prev.footer.socialLinks.map((item) =>
                                item.id === link.id ? { ...item, href: next } : item,
                              ),
                            },
                          }));
                        }}
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Toggle
                        label="Visible"
                        checked={link.visible}
                        onChange={(next) => {
                          updateConfig((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              socialLinks: prev.footer.socialLinks.map((item) =>
                                item.id === link.id ? { ...item, visible: next } : item,
                              ),
                            },
                          }));
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              socialLinks: prev.footer.socialLinks.filter((item) => item.id !== link.id),
                            },
                          }));
                        }}
                        className="rounded-[10px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                      >
                        Remove Social Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Input
                label="Office title"
                value={siteConfig.footer.officeTitle}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      officeTitle: next,
                    },
                  }))
                }
              />
              <Textarea
                label="Office address (line breaks supported)"
                value={siteConfig.footer.officeAddress}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      officeAddress: next,
                    },
                  }))
                }
              />
              <Input
                label="Copyright text"
                value={siteConfig.footer.copyrightText}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    footer: {
                      ...prev.footer,
                      copyrightText: next,
                    },
                  }))
                }
              />

              <div className="space-y-2 rounded-[10px] border border-white/10 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Legal links</p>
                {siteConfig.footer.legalLinks.map((link) => (
                  <div key={link.id} className="grid gap-2 md:grid-cols-2">
                    <Input
                      label="Label"
                      value={link.label}
                      onChange={(next) => {
                        updateConfig((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            legalLinks: prev.footer.legalLinks.map((item) =>
                              item.id === link.id ? { ...item, label: next } : item,
                            ),
                          },
                        }));
                      }}
                    />
                    <Input
                      label="Href"
                      value={link.href}
                      onChange={(next) => {
                        updateConfig((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            legalLinks: prev.footer.legalLinks.map((item) =>
                              item.id === link.id ? { ...item, href: next } : item,
                            ),
                          },
                        }));
                      }}
                    />
                    <Toggle
                      label="Visible"
                      checked={link.visible}
                      onChange={(next) => {
                        updateConfig((prev) => ({
                          ...prev,
                          footer: {
                            ...prev.footer,
                            legalLinks: prev.footer.legalLinks.map((item) =>
                              item.id === link.id ? { ...item, visible: next } : item,
                            ),
                          },
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-[10px] border border-white/10 bg-black/20 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">Footer nav links</p>
                <p className="text-xs text-white/56">
                  Footer navigation is synced automatically from the Navigation labels and sections, so links always match the top menu.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSection('navigation')}
                  className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
                >
                  Edit Navigation Labels
                </button>
              </div>
            </Card>
          </div>
        );

      case 'visibility':
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Global Layers" subtitle="Master overlays and cross-page UI visibility">
              <Toggle
                label="Global frame overlay"
                checked={siteConfig.visibility.globalFrameOverlay}
                onChange={(next) => updateVisibility('globalFrameOverlay', next)}
              />
              <Toggle
                label="Cursor animation"
                checked={siteConfig.visibility.cursorAnimation}
                onChange={(next) => updateVisibility('cursorAnimation', next)}
              />
              <Toggle
                label="Intro overlay"
                checked={siteConfig.visibility.introOverlay}
                onChange={(next) => updateVisibility('introOverlay', next)}
              />
              <Toggle
                label="About card overlay (Scene 05)"
                checked={siteConfig.visibility.scene05Overlay}
                onChange={(next) => updateVisibility('scene05Overlay', next)}
              />
              <Toggle
                label="Persistent top bar"
                checked={siteConfig.visibility.persistentUI}
                onChange={(next) => updateVisibility('persistentUI', next)}
              />
            </Card>

            <Card title="Navigation Items" subtitle="Control each element inside the persistent top bar">
              <Toggle
                label="Navigation logo"
                checked={siteConfig.visibility.navigationLogo}
                onChange={(next) => updateVisibility('navigationLogo', next)}
              />
              <Toggle
                label="Navigation menu"
                checked={siteConfig.visibility.navigationMenu}
                onChange={(next) => updateVisibility('navigationMenu', next)}
              />
              <Toggle
                label="Music toggle"
                checked={siteConfig.visibility.musicToggle}
                onChange={(next) => updateVisibility('musicToggle', next)}
              />
              <Toggle
                label="Let's Talk button"
                checked={siteConfig.visibility.letsTalkButton}
                onChange={(next) => updateVisibility('letsTalkButton', next)}
              />
            </Card>

            <Card title="Featured Section" subtitle="Main portfolio scene visibility controls">
              <Toggle
                label="Featured section container"
                checked={siteConfig.visibility.featuredWork}
                onChange={(next) => updateVisibility('featuredWork', next)}
              />
              <Toggle
                label="Featured header"
                checked={siteConfig.visibility.featuredHeader}
                onChange={(next) => updateVisibility('featuredHeader', next)}
              />
              <Toggle
                label="Projects grid"
                checked={siteConfig.visibility.featuredProjectsGrid}
                onChange={(next) => updateVisibility('featuredProjectsGrid', next)}
              />
              <Toggle
                label="View all button"
                checked={siteConfig.visibility.featuredViewAllButton}
                onChange={(next) => updateVisibility('featuredViewAllButton', next)}
              />
              <Toggle
                label="Testimonials block"
                checked={siteConfig.visibility.testimonialsSection}
                onChange={(next) => updateVisibility('testimonialsSection', next)}
              />
              <Toggle
                label="CTA block"
                checked={siteConfig.visibility.featuredCtaSection}
                onChange={(next) => updateVisibility('featuredCtaSection', next)}
              />
            </Card>

            <Card title="Footer Internals" subtitle="Turn footer subsections on or off">
              <Toggle
                label="Footer container"
                checked={siteConfig.visibility.footer}
                onChange={(next) => updateVisibility('footer', next)}
              />
              <Toggle
                label="Footer email"
                checked={siteConfig.visibility.footerEmail}
                onChange={(next) => updateVisibility('footerEmail', next)}
              />
              <Toggle
                label="Footer social links"
                checked={siteConfig.visibility.footerSocialLinks}
                onChange={(next) => updateVisibility('footerSocialLinks', next)}
              />
              <Toggle
                label="Footer legal links"
                checked={siteConfig.visibility.footerLegalLinks}
                onChange={(next) => updateVisibility('footerLegalLinks', next)}
              />
              <Toggle
                label="Footer nav links"
                checked={siteConfig.visibility.footerNavLinks}
                onChange={(next) => updateVisibility('footerNavLinks', next)}
              />
              <Toggle
                label="Footer office info"
                checked={siteConfig.visibility.footerOffice}
                onChange={(next) => updateVisibility('footerOffice', next)}
              />
            </Card>
          </div>
        );

      case 'scene05':
        return (
          <div className="grid gap-4">
            <Card title="Storytelling Animations" subtitle="Control narrative animation style (WebGL-like) for About Me section">
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-white text-sm font-bold flex flex-col">
                      Enable Storytelling
                      <span className="text-[#aeb4c0] text-xs font-normal font-sans">
                        Activate sequential text and card animations
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={siteConfig.scene05.animations?.enabled ?? true}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          scene05: {
                            ...prev.scene05,
                            animations: prev.scene05.animations 
                              ? { ...prev.scene05.animations, enabled: e.target.checked } 
                              : { enabled: e.target.checked, textRevealStyle: 'cinematic', cardEntranceStyle: 'creative' },
                          },
                        }))
                      }
                    />
                    <div
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        siteConfig.scene05.animations?.enabled ? 'bg-white' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
                          siteConfig.scene05.animations?.enabled ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white/50'
                        }`}
                      />
                    </div>
                  </label>

                  {siteConfig.scene05.animations?.enabled && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Text Reveal Style
                        </label>
                        <select
                          className="w-full bg-[#161a23] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                          value={siteConfig.scene05.animations.textRevealStyle}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              scene05: {
                                ...prev.scene05,
                                animations: prev.scene05.animations
                                  ? { ...prev.scene05.animations, textRevealStyle: e.target.value as any }
                                  : { enabled: true, textRevealStyle: e.target.value as any, cardEntranceStyle: 'creative' },
                              },
                            }))
                          }
                        >
                          <option value="none">None</option>
                          <option value="fade-up">Fade Up</option>
                          <option value="cinematic">Cinematic Read</option>
                          <option value="glitch">Glitch</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Card Entrance Style
                        </label>
                        <select
                          className="w-full bg-[#161a23] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                          value={siteConfig.scene05.animations.cardEntranceStyle}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              scene05: {
                                ...prev.scene05,
                                animations: prev.scene05.animations
                                  ? { ...prev.scene05.animations, cardEntranceStyle: e.target.value as any }
                                  : { enabled: true, textRevealStyle: 'cinematic', cardEntranceStyle: e.target.value as any },
                              },
                            }))
                          }
                        >
                          <option value="none">None</option>
                          <option value="stack">Stack Reveal</option>
                          <option value="stagger">Staggered Entrance</option>
                          <option value="creative">Creative Pop</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
            </Card>

            <Card title="About Page" subtitle="Edit full About content and certification cards">
              <Input
                label="Badge"
                value={siteConfig.scene05.badge}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, badge: next } }))}
              />
              <Input
                label="Name"
                value={siteConfig.scene05.name}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, name: next } }))}
              />
              <Input
                label="Role"
                value={siteConfig.scene05.role}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, role: next } }))}
              />
              <Input
                label="Portrait image URL"
                value={siteConfig.scene05.portraitImage}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, portraitImage: next } }))
                }
              />
              <Input
                label="Portrait alt text"
                value={siteConfig.scene05.portraitAlt}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, portraitAlt: next } }))
                }
              />
              <Textarea
                label="Vision text"
                value={siteConfig.scene05.visionText}
                rows={4}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, visionText: next } }))}
              />

              <Input
                label="Story title"
                value={siteConfig.scene05.storyTitle}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, storyTitle: next } }))
                }
              />

              <Textarea
                label="Story paragraphs (one per line)"
                value={siteConfig.scene05.storyParagraphs.join('\n')}
                rows={5}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, storyParagraphs: splitLines(next) },
                  }))
                }
              />

              <Input
                label="Skills title"
                value={siteConfig.scene05.skillsTitle}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, skillsTitle: next } }))
                }
              />
              <Textarea
                label="Skills (one per line)"
                value={siteConfig.scene05.skills.join('\n')}
                rows={4}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, skills: splitLines(next) },
                  }))
                }
              />
              <Input
                label="Certifications title"
                value={siteConfig.scene05.certificationsTitle}
                onChange={(next) =>
                  updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, certificationsTitle: next } }))
                }
              />

              <Input
                label="Credential button label"
                value={siteConfig.scene05.credentialButtonLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, credentialButtonLabel: next },
                  }))
                }
              />

              <div className="space-y-3 rounded-[12px] border border-white/10 bg-black/20 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Certification cards
                </p>

                {siteConfig.scene05.featuredCertifications.map((item) => (
                  <div key={item.id} className={listItemClass}>
                    <Input
                      label="Certificate title"
                      value={item.title}
                      onChange={(next) =>
                        updateScene05Certification(item.id, (prev) => ({ ...prev, title: next }))
                      }
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        label="Issuer"
                        value={item.issuer}
                        onChange={(next) =>
                          updateScene05Certification(item.id, (prev) => ({ ...prev, issuer: next }))
                        }
                      />
                      <Input
                        label="Year"
                        value={item.year}
                        onChange={(next) =>
                          updateScene05Certification(item.id, (prev) => ({ ...prev, year: next }))
                        }
                      />
                    </div>

                    <Input
                      label="Credential URL"
                      value={item.credentialUrl}
                      onChange={(next) =>
                        updateScene05Certification(item.id, (prev) => ({ ...prev, credentialUrl: next }))
                      }
                    />

                    <Input
                      label="Badge / logo URL"
                      value={item.logoSrc}
                      onChange={(next) =>
                        updateScene05Certification(item.id, (prev) => ({ ...prev, logoSrc: next }))
                      }
                    />

                    <div className="flex items-center justify-between gap-4 mt-2">
                      <Toggle
                        label="Visible"
                        checked={item.visible}
                        onChange={(next) =>
                          updateScene05Certification(item.id, (prev) => ({ ...prev, visible: next }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateConfig((prev) => ({
                            ...prev,
                            scene05: {
                              ...prev.scene05,
                              featuredCertifications: prev.scene05.featuredCertifications.filter(
                                (entry) => entry.id !== item.id,
                              ),
                            },
                          }));
                        }}
                        className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newCertification: SiteScene05Certification = {
                      id: `cert-${Date.now()}`,
                      title: 'New Certification',
                      issuer: 'Provider',
                      year: '2026',
                      credentialUrl: '#',
                      logoSrc: '',
                      visible: true,
                    };
                    updateConfig((prev) => ({
                      ...prev,
                      scene05: {
                        ...prev.scene05,
                        featuredCertifications: [...prev.scene05.featuredCertifications, newCertification],
                      },
                    }));
                  }}
                  className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
                >
                  Add Certification Card
                </button>
              </div>

              <Textarea
                label="Certification highlights (one per line)"
                value={siteConfig.scene05.certifications.join('\n')}
                rows={4}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, certifications: splitLines(next) },
                  }))
                }
              />
              <Input
                label="AI section title"
                value={siteConfig.scene05.aiTitle}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, aiTitle: next } }))}
              />
              <Textarea
                label="AI section text"
                value={siteConfig.scene05.aiText}
                rows={4}
                onChange={(next) => updateConfig((prev) => ({ ...prev, scene05: { ...prev.scene05, aiText: next } }))}
              />
              <Textarea
                label="AI tags (one per line)"
                value={siteConfig.scene05.aiTags.join('\n')}
                rows={4}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, aiTags: splitLines(next) },
                  }))
                }
              />
              <Input
                label="Action label"
                value={siteConfig.scene05.actionLabel}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, actionLabel: next },
                  }))
                }
              />
              <Input
                label="Action link"
                value={siteConfig.scene05.actionHref}
                onChange={(next) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scene05: { ...prev.scene05, actionHref: next },
                  }))
                }
              />

              <div className="space-y-3 rounded-[12px] border border-white/10 bg-black/20 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Style mapping for Scene 05
                </p>
                <CardVariantPicker
                  label="About card type"
                  value={siteConfig.designSystem.components.scene05CardVariant}
                  glassVariant={siteConfig.designSystem.components.globalGlassVariant}
                  onChange={(next) => updateDesignComponent('scene05CardVariant', next as SiteCardVariant)}
                />
                <ButtonVariantPicker
                  label="Action button type"
                  value={siteConfig.designSystem.components.scene05ActionButtonVariant}
                  onChange={(next) => updateDesignComponent('scene05ActionButtonVariant', next as SiteButtonVariant)}
                  sampleText={siteConfig.scene05.actionLabel || 'Connect'}
                />
              </div>
            </Card>
          </div>
        );

      case 'designSystem':
        return (
          <div className="grid gap-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <Card title="Color Tokens" subtitle="Brand and surface colors used by all shared components">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Primary color"
                  type="color"
                    value={siteConfig.designSystem.theme.primaryColor}
                    onChange={(next) => updateDesignTheme('primaryColor', next)}
                  />
                  <Input
                    label="Secondary color"
                    type="color"
                    value={siteConfig.designSystem.theme.secondaryColor}
                    onChange={(next) => updateDesignTheme('secondaryColor', next)}
                  />
                  <Input
                    label="Text on primary"
                    type="color"
                    value={siteConfig.designSystem.theme.onPrimaryColor}
                    onChange={(next) => updateDesignTheme('onPrimaryColor', next)}
                  />
                  <Input
                    label="Text on secondary"
                    type="color"
                    value={siteConfig.designSystem.theme.onSecondaryColor}
                    onChange={(next) => updateDesignTheme('onSecondaryColor', next)}
                  />
                </div>

                <Input
                  label="Glass tint (rgba)"
                  value={siteConfig.designSystem.theme.glassTintColor}
                  onChange={(next) => updateDesignTheme('glassTintColor', next)}
                />
                <Input
                  label="Glass border color (rgba)"
                  value={siteConfig.designSystem.theme.glassBorderColor}
                  onChange={(next) => updateDesignTheme('glassBorderColor', next)}
                />

                <GlassVariantPicker
                  label="Global glass type"
                  value={siteConfig.designSystem.components.globalGlassVariant}
                  onChange={(next) => updateDesignComponent('globalGlassVariant', next as SiteGlassVariant)}
                />

                <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-white/10 bg-black/20 p-2">
                  <div
                    className="rounded-[10px] border border-white/10 p-2 text-center font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ background: siteConfig.designSystem.theme.primaryColor, color: siteConfig.designSystem.theme.onPrimaryColor }}
                  >
                    Primary
                  </div>
                  <div
                    className="rounded-[10px] border border-white/10 p-2 text-center font-mono text-[10px] uppercase tracking-[0.12em]"
                    style={{ background: siteConfig.designSystem.theme.secondaryColor, color: siteConfig.designSystem.theme.onSecondaryColor }}
                  >
                    Secondary
                  </div>
                </div>
              </Card>

              <Card title="Typography Tokens" subtitle="Display/title/body sizing, rhythm and personality">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Heading scale"
                    type="number"
                    min={0.7}
                    max={1.8}
                    step={0.05}
                    value={siteConfig.designSystem.theme.headingScale}
                    onChange={(next) =>
                      updateDesignTheme('headingScale', toSafeNumberInRange(next, 1, 0.7, 1.8))
                    }
                  />
                  <Input
                    label="Display size (rem)"
                    type="number"
                    min={2.6}
                    max={12}
                    step={0.1}
                    value={siteConfig.designSystem.theme.displayTitleSizeRem}
                    onChange={(next) =>
                      updateDesignTheme('displayTitleSizeRem', toSafeNumberInRange(next, 8.4, 2.6, 12))
                    }
                  />
                  <Input
                    label="Section title size (rem)"
                    type="number"
                    min={1}
                    max={4}
                    step={0.05}
                    value={siteConfig.designSystem.theme.sectionTitleSizeRem}
                    onChange={(next) =>
                      updateDesignTheme('sectionTitleSizeRem', toSafeNumberInRange(next, 2.7, 1, 4))
                    }
                  />
                  <Input
                    label="Body size (rem)"
                    type="number"
                    min={0.75}
                    max={1.6}
                    step={0.02}
                    value={siteConfig.designSystem.theme.bodyTextSizeRem}
                    onChange={(next) =>
                      updateDesignTheme('bodyTextSizeRem', toSafeNumberInRange(next, 1.08, 0.75, 1.6))
                    }
                  />
                  <Input
                    label="Heading weight"
                    type="number"
                    min={300}
                    max={800}
                    step={10}
                    value={siteConfig.designSystem.theme.headingWeight}
                    onChange={(next) =>
                      updateDesignTheme('headingWeight', toSafeNumberInRange(next, 610, 300, 800))
                    }
                  />
                  <Input
                    label="Heading letter spacing (em)"
                    type="number"
                    min={-0.12}
                    max={0.2}
                    step={0.005}
                    value={siteConfig.designSystem.theme.headingLetterSpacingEm}
                  onChange={(next) =>
                    updateDesignTheme('headingLetterSpacingEm', toSafeNumberInRange(next, -0.02, -0.12, 0.2))
                  }
                />
                <Input
                  label="Eyebrow size (rem)"
                  type="number"
                  min={0.4}
                  max={1.4}
                  step={0.02}
                  value={siteConfig.designSystem.foundation.typography.eyebrowSizeRem}
                  onChange={(next) =>
                    updateFoundationTypography(
                      'eyebrowSizeRem',
                      toSafeNumberInRange(
                        next,
                        siteConfig.designSystem.foundation.typography.eyebrowSizeRem,
                        0.4,
                        1.4,
                      ),
                    )
                  }
                />
                <Input
                  label="Eyebrow letter spacing (em)"
                  type="number"
                  min={-0.1}
                  max={0.6}
                  step={0.01}
                  value={siteConfig.designSystem.foundation.typography.eyebrowLetterSpacingEm}
                  onChange={(next) =>
                    updateFoundationTypography(
                      'eyebrowLetterSpacingEm',
                      toSafeNumberInRange(
                        next,
                        siteConfig.designSystem.foundation.typography.eyebrowLetterSpacingEm,
                        -0.1,
                        0.6,
                      ),
                    )
                  }
                />
                <Input
                  label="Eyebrow weight"
                  type="number"
                  min={300}
                  max={900}
                  step={10}
                  value={siteConfig.designSystem.foundation.typography.eyebrowWeight}
                  onChange={(next) =>
                    updateFoundationTypography(
                      'eyebrowWeight',
                      toSafeNumberInRange(
                        next,
                        siteConfig.designSystem.foundation.typography.eyebrowWeight,
                        300,
                        900,
                      ),
                    )
                  }
                />
              </div>

              <Input
                label="Body line-height"
                type="number"
                  min={1.1}
                  max={2.2}
                  step={0.05}
                  value={siteConfig.designSystem.theme.bodyLineHeight}
                  onChange={(next) =>
                    updateDesignTheme('bodyLineHeight', toSafeNumberInRange(next, 1.6, 1.1, 2.2))
                  }
              />
            </Card>

            <Card title="Layout & Rhythm" subtitle="Control spacing scale, card padding, and max content width">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Section padding (rem)"
                  type="number"
                  min={1}
                  max={8}
                  step={0.1}
                  value={siteConfig.designSystem.foundation.spacing.sectionPaddingRem}
                  onChange={(next) =>
                    updateFoundationSpacing(
                      'sectionPaddingRem',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.spacing.sectionPaddingRem, 1, 8),
                    )
                  }
                />
                <Input
                  label="Stack gap (rem)"
                  type="number"
                  min={0.4}
                  max={3}
                  step={0.05}
                  value={siteConfig.designSystem.foundation.spacing.stackGapRem}
                  onChange={(next) =>
                    updateFoundationSpacing(
                      'stackGapRem',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.spacing.stackGapRem, 0.4, 3),
                    )
                  }
                />
                <Input
                  label="Grid gap (rem)"
                  type="number"
                  min={0.4}
                  max={3}
                  step={0.05}
                  value={siteConfig.designSystem.foundation.spacing.gridGapRem}
                  onChange={(next) =>
                    updateFoundationSpacing(
                      'gridGapRem',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.spacing.gridGapRem, 0.4, 3),
                    )
                  }
                />
                <Input
                  label="Card padding (rem)"
                  type="number"
                  min={0.75}
                  max={3.5}
                  step={0.05}
                  value={siteConfig.designSystem.foundation.spacing.cardPaddingRem}
                  onChange={(next) =>
                    updateFoundationSpacing(
                      'cardPaddingRem',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.spacing.cardPaddingRem, 0.75, 3.5),
                    )
                  }
                />
                <Input
                  label="Max content width (px)"
                  type="number"
                  min={960}
                  max={1920}
                  step={10}
                  value={siteConfig.designSystem.foundation.layout.contentMaxWidthPx}
                  onChange={(next) =>
                    updateFoundationLayout(
                      'contentMaxWidthPx',
                      toSafeNumberInRange(
                        next,
                        siteConfig.designSystem.foundation.layout.contentMaxWidthPx,
                        960,
                        1920,
                      ),
                    )
                  }
                />
                <Input
                  label="Column gap (rem)"
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.05}
                  value={siteConfig.designSystem.foundation.layout.columnGapRem}
                  onChange={(next) =>
                    updateFoundationLayout(
                      'columnGapRem',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.layout.columnGapRem, 0.5, 4),
                    )
                  }
                />
                <Input
                  label="Max grid columns"
                  type="number"
                  min={6}
                  max={18}
                  step={1}
                  value={siteConfig.designSystem.foundation.layout.maxGridColumns}
                  onChange={(next) =>
                    updateFoundationLayout(
                      'maxGridColumns',
                      toSafeNumberInRange(next, siteConfig.designSystem.foundation.layout.maxGridColumns, 6, 18),
                    )
                  }
                />
              </div>

              <p className="text-xs text-white/60">
                These tokens drive the new ds-section, ds-stack, and ds-grid spacing classes so every page respects the same rhythm.
              </p>
            </Card>
          </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card title="Component Physics" subtitle="Radius, borders, blur and shadows for buttons/cards">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Button radius (px)"
                    type="number"
                    min={2}
                    max={48}
                    step={1}
                    value={siteConfig.designSystem.theme.buttonRadius}
                    onChange={(next) =>
                      updateDesignTheme('buttonRadius', toSafeNumberInRange(next, 8, 2, 48))
                    }
                  />
                  <Input
                    label="Button border width (px)"
                    type="number"
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={siteConfig.designSystem.theme.buttonBorderWidth}
                    onChange={(next) =>
                      updateDesignTheme('buttonBorderWidth', toSafeNumberInRange(next, 1, 0.5, 5))
                    }
                  />
                  <Input
                    label="Button shadow opacity"
                    type="number"
                    min={0}
                    max={0.65}
                    step={0.01}
                    value={siteConfig.designSystem.theme.buttonShadowOpacity}
                    onChange={(next) =>
                      updateDesignTheme('buttonShadowOpacity', toSafeNumberInRange(next, 0.24, 0, 0.65))
                    }
                  />
                  <Input
                    label="Card radius (px)"
                    type="number"
                    min={4}
                    max={64}
                    step={1}
                    value={siteConfig.designSystem.theme.cardRadius}
                    onChange={(next) =>
                      updateDesignTheme('cardRadius', toSafeNumberInRange(next, 18, 4, 64))
                    }
                  />
                  <Input
                    label="Card border width (px)"
                    type="number"
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={siteConfig.designSystem.theme.cardBorderWidth}
                    onChange={(next) =>
                      updateDesignTheme('cardBorderWidth', toSafeNumberInRange(next, 1, 0.5, 5))
                    }
                  />
                  <Input
                    label="Card blur (px)"
                    type="number"
                    min={0}
                    max={40}
                    step={1}
                    value={siteConfig.designSystem.theme.cardBlurPx}
                    onChange={(next) =>
                      updateDesignTheme('cardBlurPx', toSafeNumberInRange(next, 18, 0, 40))
                    }
                  />
                  <Input
                    label="Card shadow opacity"
                    type="number"
                    min={0}
                    max={0.8}
                    step={0.01}
                    value={siteConfig.designSystem.theme.cardShadowOpacity}
                    onChange={(next) =>
                      updateDesignTheme('cardShadowOpacity', toSafeNumberInRange(next, 0.28, 0, 0.8))
                    }
                  />
                </div>
              </Card>

              <Card title="Component Library" subtitle="Canonical types available in the system">
                <ButtonVariantPicker
                  label="All button types"
                  value={siteConfig.designSystem.components.featuredCtaButtonVariant}
                  onChange={(next) => updateDesignComponent('featuredCtaButtonVariant', next as SiteButtonVariant)}
                  sampleText="Component"
                />
                <CardVariantPicker
                  label="All card types"
                  value={siteConfig.designSystem.components.introCardVariant}
                  glassVariant={siteConfig.designSystem.components.globalGlassVariant}
                  onChange={(next) => updateDesignComponent('introCardVariant', next as SiteCardVariant)}
                />
                <GlassVariantPicker
                  label="All glass types"
                  value={siteConfig.designSystem.components.globalGlassVariant}
                  onChange={(next) => updateDesignComponent('globalGlassVariant', next as SiteGlassVariant)}
                />
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card title="Component Studio: Buttons" subtitle="Select a button type then tune it deeply">
                <div className="grid gap-2 sm:grid-cols-3">
                  {SITE_BUTTON_VARIANTS.map((variant) => {
                    const active = variant === activeButtonStudio;
                    return (
                      <button
                        key={`button-studio-${variant}`}
                        type="button"
                        onClick={() => setActiveButtonStudio(variant)}
                        className={`rounded-[10px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                          active
                            ? 'border-white/36 bg-white/14 text-white'
                            : 'border-white/14 bg-black/25 text-white/70 hover:bg-white/8'
                        }`}
                      >
                        {formatVariantLabel(variant)}
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Radius (px)"
                    type="number"
                    min={2}
                    max={999}
                    step={1}
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].radiusPx}
                    onChange={(next) =>
                      updateButtonPreset(activeButtonStudio, {
                        radiusPx: toSafeNumberInRange(next, 10, 2, 999),
                      })
                    }
                  />
                  <Input
                    label="Border width (px)"
                    type="number"
                    min={0.5}
                    max={6}
                    step={0.1}
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].borderWidthPx}
                    onChange={(next) =>
                      updateButtonPreset(activeButtonStudio, {
                        borderWidthPx: toSafeNumberInRange(next, 1, 0.5, 6),
                      })
                    }
                  />
                  <Input
                    label="Dark background (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].darkBackground}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { darkBackground: next })}
                  />
                  <Input
                    label="Dark border (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].darkBorder}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { darkBorder: next })}
                  />
                  <Input
                    label="Dark text (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].darkText}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { darkText: next })}
                  />
                  <Input
                    label="Dark hover (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].darkHoverBackground}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { darkHoverBackground: next })}
                  />
                  <Input
                    label="Light background (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].lightBackground}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { lightBackground: next })}
                  />
                  <Input
                    label="Light border (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].lightBorder}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { lightBorder: next })}
                  />
                  <Input
                    label="Light text (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].lightText}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { lightText: next })}
                  />
                  <Input
                    label="Light hover (CSS color)"
                    value={siteConfig.designSystem.componentStyles.buttons[activeButtonStudio].lightHoverBackground}
                    onChange={(next) => updateButtonPreset(activeButtonStudio, { lightHoverBackground: next })}
                  />
                </div>

                <div className="grid gap-2 rounded-[12px] border border-white/10 bg-black/25 p-3 sm:grid-cols-2">
                  <div className="rounded-[10px] border border-white/10 bg-[#0f1014] p-3">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">Dark</p>
                    <button type="button" className={getButtonClass(activeButtonStudio, 'dark', 'sm')}>
                      Live Preview
                    </button>
                  </div>
                  <div className="rounded-[10px] border border-black/10 bg-[#f5f7fb] p-3">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">Light</p>
                    <button type="button" className={getButtonClass(activeButtonStudio, 'light', 'sm')}>
                      Live Preview
                    </button>
                  </div>
                </div>
              </Card>

              <Card title="Component Studio: Cards" subtitle="Tune fill, borders, radius and depth per card type">
                <div className="grid gap-2 sm:grid-cols-3">
                  {SITE_CARD_VARIANTS.map((variant) => {
                    const active = variant === activeCardStudio;
                    return (
                      <button
                        key={`card-studio-${variant}`}
                        type="button"
                        onClick={() => setActiveCardStudio(variant)}
                        className={`rounded-[10px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                          active
                            ? 'border-white/36 bg-white/14 text-white'
                            : 'border-white/14 bg-black/25 text-white/70 hover:bg-white/8'
                        }`}
                      >
                        {formatVariantLabel(variant)}
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Radius (px)"
                    type="number"
                    min={4}
                    max={80}
                    step={1}
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].radiusPx}
                    onChange={(next) =>
                      updateCardPreset(activeCardStudio, {
                        radiusPx: toSafeNumberInRange(next, 18, 4, 80),
                      })
                    }
                  />
                  <Input
                    label="Border width (px)"
                    type="number"
                    min={0.5}
                    max={6}
                    step={0.1}
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].borderWidthPx}
                    onChange={(next) =>
                      updateCardPreset(activeCardStudio, {
                        borderWidthPx: toSafeNumberInRange(next, 1, 0.5, 6),
                      })
                    }
                  />
                  <Input
                    label="Dark border"
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].darkBorder}
                    onChange={(next) => updateCardPreset(activeCardStudio, { darkBorder: next })}
                  />
                  <Input
                    label="Light border"
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].lightBorder}
                    onChange={(next) => updateCardPreset(activeCardStudio, { lightBorder: next })}
                  />
                  <Input
                    label="Dark background"
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].darkBackground}
                    onChange={(next) => updateCardPreset(activeCardStudio, { darkBackground: next })}
                  />
                  <Input
                    label="Light background"
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].lightBackground}
                    onChange={(next) => updateCardPreset(activeCardStudio, { lightBackground: next })}
                  />
                  <Input
                    label="Dark shadow opacity"
                    type="number"
                    min={0}
                    max={0.9}
                    step={0.01}
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].darkShadowOpacity}
                    onChange={(next) =>
                      updateCardPreset(activeCardStudio, {
                        darkShadowOpacity: toSafeNumberInRange(next, 0.28, 0, 0.9),
                      })
                    }
                  />
                  <Input
                    label="Light shadow opacity"
                    type="number"
                    min={0}
                    max={0.9}
                    step={0.01}
                    value={siteConfig.designSystem.componentStyles.cards[activeCardStudio].lightShadowOpacity}
                    onChange={(next) =>
                      updateCardPreset(activeCardStudio, {
                        lightShadowOpacity: toSafeNumberInRange(next, 0.24, 0, 0.9),
                      })
                    }
                  />
                </div>

                <div className="grid gap-2 rounded-[12px] border border-white/10 bg-black/25 p-3 sm:grid-cols-2">
                  <div
                    className={`${getCardClass(activeCardStudio, 'dark', 'p-3')} ${getGlassClass(
                      siteConfig.designSystem.components.globalGlassVariant,
                      'dark',
                    )}`}
                  >
                    <p className="text-sm font-semibold text-white">Dark Surface</p>
                    <p className="mt-1 text-xs text-white/65">Live card style preview</p>
                  </div>
                  <div
                    className={`${getCardClass(activeCardStudio, 'light', 'p-3')} ${getGlassClass(
                      siteConfig.designSystem.components.globalGlassVariant,
                      'light',
                    )}`}
                  >
                    <p className="text-sm font-semibold text-black/85">Light Surface</p>
                    <p className="mt-1 text-xs text-black/60">Live card style preview</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card title="Live Design Lab" subtitle="Instant preview on dark and light surfaces inside dashboard">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-[14px] border border-white/12 bg-[#0d0d12] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">Dark Surface</p>

                  <h3
                    className="mt-3 text-white"
                    style={{
                      fontSize: `clamp(${getScaledRem(
                        siteConfig.designSystem.theme.displayTitleSizeRem * 0.35,
                        siteConfig.designSystem.theme.headingScale,
                      )}, 5vw, ${getScaledRem(
                        siteConfig.designSystem.theme.displayTitleSizeRem * 0.6,
                        siteConfig.designSystem.theme.headingScale,
                      )})`,
                      fontWeight: siteConfig.designSystem.theme.headingWeight,
                      letterSpacing: `${siteConfig.designSystem.theme.headingLetterSpacingEm}em`,
                    }}
                  >
                    Display Heading
                  </h3>
                  <p
                    className="mt-1 text-white/70"
                    style={{
                      fontSize: `${siteConfig.designSystem.theme.bodyTextSizeRem}rem`,
                      lineHeight: siteConfig.designSystem.theme.bodyLineHeight,
                    }}
                  >
                    Body text rhythm preview for readability and spacing.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SITE_BUTTON_VARIANTS.map((variant) => (
                      <button key={`dark-${variant}`} type="button" className={getButtonClass(variant, 'dark', 'sm')}>
                        {formatVariantLabel(variant)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {SITE_CARD_VARIANTS.map((variant) => (
                      <div
                        key={`dark-card-${variant}`}
                        className={`${getCardClass(variant, 'dark', 'p-3')} ${getGlassClass(
                          siteConfig.designSystem.components.globalGlassVariant,
                          'dark',
                        )}`}
                      >
                        <p className="text-sm font-semibold text-white">{formatVariantLabel(variant)}</p>
                        <p className="mt-1 text-xs text-white/70">Shared dark card preview.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[14px] border border-black/10 bg-[#f5f7fb] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/55">Light Surface</p>

                  <h3
                    className="mt-3 text-[#111217]"
                    style={{
                      fontSize: `clamp(${getScaledRem(
                        siteConfig.designSystem.theme.sectionTitleSizeRem * 0.8,
                        siteConfig.designSystem.theme.headingScale,
                      )}, 3.5vw, ${getScaledRem(
                        siteConfig.designSystem.theme.sectionTitleSizeRem * 1.1,
                        siteConfig.designSystem.theme.headingScale,
                      )})`,
                      fontWeight: siteConfig.designSystem.theme.headingWeight,
                      letterSpacing: `${siteConfig.designSystem.theme.headingLetterSpacingEm}em`,
                    }}
                  >
                    Section Heading
                  </h3>
                  <p
                    className="mt-1 text-black/65"
                    style={{
                      fontSize: `${siteConfig.designSystem.theme.bodyTextSizeRem}rem`,
                      lineHeight: siteConfig.designSystem.theme.bodyLineHeight,
                    }}
                  >
                    Live visual confirmation before saving your style decisions.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SITE_BUTTON_VARIANTS.map((variant) => (
                      <button key={`light-${variant}`} type="button" className={getButtonClass(variant, 'light', 'sm')}>
                        {formatVariantLabel(variant)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {SITE_CARD_VARIANTS.map((variant) => (
                      <div
                        key={`light-card-${variant}`}
                        className={`${getCardClass(variant, 'light', 'p-3')} ${getGlassClass(
                          siteConfig.designSystem.components.globalGlassVariant,
                          'light',
                        )}`}
                      >
                        <p className="text-sm font-semibold text-black/85">{formatVariantLabel(variant)}</p>
                        <p className="mt-1 text-xs text-black/60">Shared light card preview.</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/55">
                This lab is live: every token change updates instantly here and in the site scenes that use the
                design-system components.
              </p>
            </Card>
          </div>
        );

      case 'animation':
        return (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
            <Card title="Animation Selector" subtitle="Pick one cursor animation and tune its own properties">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 'fluid', label: 'Fluid', hint: 'WebGL liquid motion' },
                  { id: 'aura', label: 'Aura', hint: 'Soft cinematic glow' },
                  { id: 'orbit', label: 'Orbit', hint: 'Trailing orbit particles' },
                  { id: 'comet', label: 'Comet', hint: 'Head-and-tail cinematic trail' },
                  { id: 'ripple', label: 'Ripple', hint: 'Pulse rings from pointer movement' },
                  { id: 'spark', label: 'Spark', hint: 'Reactive burst particles' },
                  { id: 'beam', label: 'Beam', hint: 'Neon streak with lag follow' },
                  { id: 'plasma', label: 'Plasma', hint: 'Dual-color energetic orb' },
                ].map((mode) => {
                  const active = siteConfig.animation.activeCursorAnimation === mode.id;
                  return (
                    <button
                      key={`cursor-mode-${mode.id}`}
                      type="button"
                      onClick={() => {
                        if (siteConfig.animation.activeCursorAnimation === mode.id) return;
                        updateAnimationMode(mode.id as SiteCursorAnimationMode);
                      }}
                      className={`rounded-[11px] border px-3 py-3 text-left transition-all ${
                        active
                          ? 'border-white/34 bg-white/12 text-white'
                          : 'border-white/12 bg-black/25 text-white/72 hover:bg-white/8'
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em]">{mode.label}</p>
                      <p className="mt-1 text-[12px] text-white/55">{mode.hint}</p>
                    </button>
                  );
                })}
              </div>

              {siteConfig.animation.activeCursorAnimation === 'fluid' ? (
                <div className="grid gap-3">
                  <Input
                    label="Density Dissipation"
                    type="number"
                    min={0.2}
                    max={10}
                    step={0.1}
                    value={siteConfig.animation.cursor.DENSITY_DISSIPATION}
                    onChange={(next) =>
                      updateFluidCursor(
                        'DENSITY_DISSIPATION',
                        toSafeNumberInRange(next, siteConfig.animation.cursor.DENSITY_DISSIPATION, 0.2, 10),
                      )
                    }
                  />
                  <Input
                    label="Velocity Dissipation"
                    type="number"
                    min={0.2}
                    max={20}
                    step={0.1}
                    value={siteConfig.animation.cursor.VELOCITY_DISSIPATION}
                    onChange={(next) =>
                      updateFluidCursor(
                        'VELOCITY_DISSIPATION',
                        toSafeNumberInRange(next, siteConfig.animation.cursor.VELOCITY_DISSIPATION, 0.2, 20),
                      )
                    }
                  />
                  <Input
                    label="Pressure"
                    type="number"
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.cursor.PRESSURE}
                    onChange={(next) =>
                      updateFluidCursor('PRESSURE', toSafeNumberInRange(next, siteConfig.animation.cursor.PRESSURE, 0.01, 1))
                    }
                  />
                  <Input
                    label="Curl"
                    type="number"
                    min={0}
                    max={30}
                    step={0.1}
                    value={siteConfig.animation.cursor.CURL}
                    onChange={(next) =>
                      updateFluidCursor('CURL', toSafeNumberInRange(next, siteConfig.animation.cursor.CURL, 0, 30))
                    }
                  />
                  <Input
                    label="Splat Radius"
                    type="number"
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.cursor.SPLAT_RADIUS}
                    onChange={(next) =>
                      updateFluidCursor(
                        'SPLAT_RADIUS',
                        toSafeNumberInRange(next, siteConfig.animation.cursor.SPLAT_RADIUS, 0.01, 1),
                      )
                    }
                  />
                  <Input
                    label="Splat Force"
                    type="number"
                    min={500}
                    max={20000}
                    step={10}
                    value={siteConfig.animation.cursor.SPLAT_FORCE}
                    onChange={(next) =>
                      updateFluidCursor('SPLAT_FORCE', toSafeNumberInRange(next, siteConfig.animation.cursor.SPLAT_FORCE, 500, 20000))
                    }
                  />
                  <Input
                    label="Color Speed"
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={siteConfig.animation.cursor.COLOR_UPDATE_SPEED}
                    onChange={(next) =>
                      updateFluidCursor(
                        'COLOR_UPDATE_SPEED',
                        toSafeNumberInRange(next, siteConfig.animation.cursor.COLOR_UPDATE_SPEED, 0.1, 10),
                      )
                    }
                  />
                  <Input
                    label="Cursor Color"
                    value={siteConfig.animation.cursor.COLOR}
                    onChange={(next) => updateFluidCursor('COLOR', next)}
                  />
                  <Toggle
                    label="Shading"
                    checked={siteConfig.animation.cursor.SHADING}
                    onChange={(next) => updateFluidCursor('SHADING', next)}
                  />
                  <Toggle
                    label="Rainbow Mode"
                    checked={siteConfig.animation.cursor.RAINBOW_MODE}
                    onChange={(next) => updateFluidCursor('RAINBOW_MODE', next)}
                  />
                  <Toggle
                    label="Auto Contrast"
                    checked={siteConfig.animation.cursor.AUTO_CONTRAST}
                    onChange={(next) => updateFluidCursor('AUTO_CONTRAST', next)}
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'aura' ? (
                <div className="grid gap-3">
                  <Input
                    label="Aura Color"
                    value={siteConfig.animation.aura.color}
                    onChange={(next) => updateAuraCursor('color', next)}
                  />
                  <Input
                    label="Aura Size (px)"
                    type="number"
                    min={120}
                    max={820}
                    step={5}
                    value={siteConfig.animation.aura.sizePx}
                    onChange={(next) =>
                      updateAuraCursor('sizePx', toSafeNumberInRange(next, 360, 120, 820))
                    }
                  />
                  <Input
                    label="Aura Blur (px)"
                    type="number"
                    min={0}
                    max={220}
                    step={1}
                    value={siteConfig.animation.aura.blurPx}
                    onChange={(next) => updateAuraCursor('blurPx', toSafeNumberInRange(next, 46, 0, 220))}
                  />
                  <Input
                    label="Intensity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.aura.intensity}
                    onChange={(next) => updateAuraCursor('intensity', toSafeNumberInRange(next, 0.5, 0.05, 1))}
                  />
                  <Input
                    label="Smoothing"
                    type="number"
                    min={0.02}
                    max={0.45}
                    step={0.01}
                    value={siteConfig.animation.aura.smoothing}
                    onChange={(next) => updateAuraCursor('smoothing', toSafeNumberInRange(next, 0.18, 0.02, 0.45))}
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'orbit' ? (
                <div className="grid gap-3">
                  <Input
                    label="Particle Color"
                    value={siteConfig.animation.orbit.color}
                    onChange={(next) => updateOrbitCursor('color', next)}
                  />
                  <Input
                    label="Orb Count"
                    type="number"
                    min={2}
                    max={14}
                    step={1}
                    value={siteConfig.animation.orbit.orbCount}
                    onChange={(next) => updateOrbitCursor('orbCount', toSafeNumberInRange(next, 6, 2, 14))}
                  />
                  <Input
                    label="Orb Size (px)"
                    type="number"
                    min={6}
                    max={72}
                    step={1}
                    value={siteConfig.animation.orbit.orbSizePx}
                    onChange={(next) => updateOrbitCursor('orbSizePx', toSafeNumberInRange(next, 22, 6, 72))}
                  />
                  <Input
                    label="Orb Blur (px)"
                    type="number"
                    min={0}
                    max={60}
                    step={1}
                    value={siteConfig.animation.orbit.blurPx}
                    onChange={(next) => updateOrbitCursor('blurPx', toSafeNumberInRange(next, 10, 0, 60))}
                  />
                  <Input
                    label="Opacity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.orbit.opacity}
                    onChange={(next) => updateOrbitCursor('opacity', toSafeNumberInRange(next, 0.32, 0.05, 1))}
                  />
                  <Input
                    label="Follow Strength"
                    type="number"
                    min={0.02}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.orbit.followStrength}
                    onChange={(next) =>
                      updateOrbitCursor('followStrength', toSafeNumberInRange(next, 0.22, 0.02, 1))
                    }
                  />
                  <Input
                    label="Trail Falloff"
                    type="number"
                    min={0.3}
                    max={0.99}
                    step={0.01}
                    value={siteConfig.animation.orbit.falloff}
                    onChange={(next) => updateOrbitCursor('falloff', toSafeNumberInRange(next, 0.84, 0.3, 0.99))}
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'comet' ? (
                <div className="grid gap-3">
                  <Input
                    label="Comet Color"
                    value={siteConfig.animation.comet.color}
                    onChange={(next) => updateCometCursor('color', next)}
                  />
                  <Input
                    label="Head Size (px)"
                    type="number"
                    min={8}
                    max={96}
                    step={1}
                    value={siteConfig.animation.comet.headSizePx}
                    onChange={(next) =>
                      updateCometCursor(
                        'headSizePx',
                        toSafeNumberInRange(next, siteConfig.animation.comet.headSizePx, 8, 96),
                      )
                    }
                  />
                  <Input
                    label="Tail Length"
                    type="number"
                    min={2}
                    max={24}
                    step={1}
                    value={siteConfig.animation.comet.tailLength}
                    onChange={(next) =>
                      updateCometCursor(
                        'tailLength',
                        toSafeNumberInRange(next, siteConfig.animation.comet.tailLength, 2, 24),
                      )
                    }
                  />
                  <Input
                    label="Blur (px)"
                    type="number"
                    min={0}
                    max={80}
                    step={1}
                    value={siteConfig.animation.comet.blurPx}
                    onChange={(next) =>
                      updateCometCursor('blurPx', toSafeNumberInRange(next, siteConfig.animation.comet.blurPx, 0, 80))
                    }
                  />
                  <Input
                    label="Opacity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.comet.opacity}
                    onChange={(next) =>
                      updateCometCursor('opacity', toSafeNumberInRange(next, siteConfig.animation.comet.opacity, 0.05, 1))
                    }
                  />
                  <Input
                    label="Follow Strength"
                    type="number"
                    min={0.02}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.comet.followStrength}
                    onChange={(next) =>
                      updateCometCursor(
                        'followStrength',
                        toSafeNumberInRange(next, siteConfig.animation.comet.followStrength, 0.02, 1),
                      )
                    }
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'ripple' ? (
                <div className="grid gap-3">
                  <Input
                    label="Ripple Color"
                    value={siteConfig.animation.ripple.color}
                    onChange={(next) => updateRippleCursor('color', next)}
                  />
                  <Input
                    label="Ring Size (px)"
                    type="number"
                    min={40}
                    max={280}
                    step={2}
                    value={siteConfig.animation.ripple.ringSizePx}
                    onChange={(next) =>
                      updateRippleCursor(
                        'ringSizePx',
                        toSafeNumberInRange(next, siteConfig.animation.ripple.ringSizePx, 40, 280),
                      )
                    }
                  />
                  <Input
                    label="Ring Width (px)"
                    type="number"
                    min={1}
                    max={14}
                    step={1}
                    value={siteConfig.animation.ripple.ringWidthPx}
                    onChange={(next) =>
                      updateRippleCursor(
                        'ringWidthPx',
                        toSafeNumberInRange(next, siteConfig.animation.ripple.ringWidthPx, 1, 14),
                      )
                    }
                  />
                  <Input
                    label="Lifetime (ms)"
                    type="number"
                    min={200}
                    max={2000}
                    step={10}
                    value={siteConfig.animation.ripple.lifeMs}
                    onChange={(next) =>
                      updateRippleCursor('lifeMs', toSafeNumberInRange(next, siteConfig.animation.ripple.lifeMs, 200, 2000))
                    }
                  />
                  <Input
                    label="Spawn Distance (px)"
                    type="number"
                    min={4}
                    max={120}
                    step={1}
                    value={siteConfig.animation.ripple.spawnDistancePx}
                    onChange={(next) =>
                      updateRippleCursor(
                        'spawnDistancePx',
                        toSafeNumberInRange(next, siteConfig.animation.ripple.spawnDistancePx, 4, 120),
                      )
                    }
                  />
                  <Input
                    label="Opacity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.ripple.opacity}
                    onChange={(next) =>
                      updateRippleCursor('opacity', toSafeNumberInRange(next, siteConfig.animation.ripple.opacity, 0.05, 1))
                    }
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'spark' ? (
                <div className="grid gap-3">
                  <Input
                    label="Spark Color"
                    value={siteConfig.animation.spark.color}
                    onChange={(next) => updateSparkCursor('color', next)}
                  />
                  <Input
                    label="Particle Count"
                    type="number"
                    min={4}
                    max={64}
                    step={1}
                    value={siteConfig.animation.spark.particleCount}
                    onChange={(next) =>
                      updateSparkCursor(
                        'particleCount',
                        toSafeNumberInRange(next, siteConfig.animation.spark.particleCount, 4, 64),
                      )
                    }
                  />
                  <Input
                    label="Particle Size (px)"
                    type="number"
                    min={1}
                    max={12}
                    step={1}
                    value={siteConfig.animation.spark.particleSizePx}
                    onChange={(next) =>
                      updateSparkCursor(
                        'particleSizePx',
                        toSafeNumberInRange(next, siteConfig.animation.spark.particleSizePx, 1, 12),
                      )
                    }
                  />
                  <Input
                    label="Spread (px)"
                    type="number"
                    min={8}
                    max={120}
                    step={1}
                    value={siteConfig.animation.spark.spreadPx}
                    onChange={(next) =>
                      updateSparkCursor('spreadPx', toSafeNumberInRange(next, siteConfig.animation.spark.spreadPx, 8, 120))
                    }
                  />
                  <Input
                    label="Lifetime (ms)"
                    type="number"
                    min={120}
                    max={1600}
                    step={10}
                    value={siteConfig.animation.spark.lifeMs}
                    onChange={(next) =>
                      updateSparkCursor('lifeMs', toSafeNumberInRange(next, siteConfig.animation.spark.lifeMs, 120, 1600))
                    }
                  />
                  <Input
                    label="Emission Rate"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.spark.emissionRate}
                    onChange={(next) =>
                      updateSparkCursor(
                        'emissionRate',
                        toSafeNumberInRange(next, siteConfig.animation.spark.emissionRate, 0.05, 1),
                      )
                    }
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'beam' ? (
                <div className="grid gap-3">
                  <Input
                    label="Beam Color"
                    value={siteConfig.animation.beam.color}
                    onChange={(next) => updateBeamCursor('color', next)}
                  />
                  <Input
                    label="Beam Width (px)"
                    type="number"
                    min={24}
                    max={360}
                    step={2}
                    value={siteConfig.animation.beam.widthPx}
                    onChange={(next) =>
                      updateBeamCursor('widthPx', toSafeNumberInRange(next, siteConfig.animation.beam.widthPx, 24, 360))
                    }
                  />
                  <Input
                    label="Beam Height (px)"
                    type="number"
                    min={6}
                    max={120}
                    step={1}
                    value={siteConfig.animation.beam.heightPx}
                    onChange={(next) =>
                      updateBeamCursor('heightPx', toSafeNumberInRange(next, siteConfig.animation.beam.heightPx, 6, 120))
                    }
                  />
                  <Input
                    label="Blur (px)"
                    type="number"
                    min={0}
                    max={80}
                    step={1}
                    value={siteConfig.animation.beam.blurPx}
                    onChange={(next) =>
                      updateBeamCursor('blurPx', toSafeNumberInRange(next, siteConfig.animation.beam.blurPx, 0, 80))
                    }
                  />
                  <Input
                    label="Opacity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.beam.opacity}
                    onChange={(next) =>
                      updateBeamCursor('opacity', toSafeNumberInRange(next, siteConfig.animation.beam.opacity, 0.05, 1))
                    }
                  />
                  <Input
                    label="Lag"
                    type="number"
                    min={0.02}
                    max={0.6}
                    step={0.01}
                    value={siteConfig.animation.beam.lag}
                    onChange={(next) =>
                      updateBeamCursor('lag', toSafeNumberInRange(next, siteConfig.animation.beam.lag, 0.02, 0.6))
                    }
                  />
                </div>
              ) : null}

              {siteConfig.animation.activeCursorAnimation === 'plasma' ? (
                <div className="grid gap-3">
                  <Input
                    label="Color A"
                    value={siteConfig.animation.plasma.colorA}
                    onChange={(next) => updatePlasmaCursor('colorA', next)}
                  />
                  <Input
                    label="Color B"
                    value={siteConfig.animation.plasma.colorB}
                    onChange={(next) => updatePlasmaCursor('colorB', next)}
                  />
                  <Input
                    label="Size (px)"
                    type="number"
                    min={60}
                    max={420}
                    step={2}
                    value={siteConfig.animation.plasma.sizePx}
                    onChange={(next) =>
                      updatePlasmaCursor('sizePx', toSafeNumberInRange(next, siteConfig.animation.plasma.sizePx, 60, 420))
                    }
                  />
                  <Input
                    label="Blur (px)"
                    type="number"
                    min={0}
                    max={160}
                    step={1}
                    value={siteConfig.animation.plasma.blurPx}
                    onChange={(next) =>
                      updatePlasmaCursor('blurPx', toSafeNumberInRange(next, siteConfig.animation.plasma.blurPx, 0, 160))
                    }
                  />
                  <Input
                    label="Opacity"
                    type="number"
                    min={0.05}
                    max={1}
                    step={0.01}
                    value={siteConfig.animation.plasma.opacity}
                    onChange={(next) =>
                      updatePlasmaCursor('opacity', toSafeNumberInRange(next, siteConfig.animation.plasma.opacity, 0.05, 1))
                    }
                  />
                  <Input
                    label="Smoothing"
                    type="number"
                    min={0.02}
                    max={0.45}
                    step={0.01}
                    value={siteConfig.animation.plasma.smoothing}
                    onChange={(next) =>
                      updatePlasmaCursor(
                        'smoothing',
                        toSafeNumberInRange(next, siteConfig.animation.plasma.smoothing, 0.02, 0.45),
                      )
                    }
                  />
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  updateConfig((prev) => ({
                    ...prev,
                    animation: { ...DEFAULT_SITE_CONFIG.animation },
                  }));
                }}
                className="rounded-[10px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
                  >
                    Reset All Animation Presets
                  </button>
                </Card>

            <Card title="Section Motion" subtitle="Toggle cinematic text + card reveals by surface">
              <div className="space-y-4">
                <div className="rounded-[12px] border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">About Overlay</p>
                      <p className="text-xs text-white/55">Sequential hero text, skills rain, rotating certificates</p>
                    </div>
                    <Toggle
                      label="Enable"
                      checked={siteConfig.animation.sections.about.enabled}
                      onChange={(next) => updateSectionAnimation('about', { enabled: next })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Text Sequence</span>
                      <select
                        value={siteConfig.animation.sections.about.textSequenceStyle}
                        onChange={(e) =>
                          updateSectionAnimation('about', {
                            textSequenceStyle: e.target.value as SiteConfig['animation']['sections']['about']['textSequenceStyle'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="beam">Beam reveal</option>
                        <option value="typewriter">Typewriter</option>
                        <option value="slice">Slice</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Card Entrance</span>
                      <select
                        value={siteConfig.animation.sections.about.cardEntranceStyle}
                        onChange={(e) =>
                          updateSectionAnimation('about', {
                            cardEntranceStyle: e.target.value as SiteConfig['animation']['sections']['about']['cardEntranceStyle'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="stack">Stacked</option>
                        <option value="orbit">Orbital</option>
                        <option value="slide">Slide</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Text Rhythm</span>
                      <select
                        value={siteConfig.animation.sections.about.textRhythm}
                        onChange={(e) =>
                          updateSectionAnimation('about', {
                            textRhythm: e.target.value as SiteConfig['animation']['sections']['about']['textRhythm'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="tight">Tight</option>
                        <option value="balanced">Balanced</option>
                        <option value="linger">Linger</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Certificate Rhythm</span>
                      <select
                        value={siteConfig.animation.sections.about.certificationRhythm}
                        onChange={(e) =>
                          updateSectionAnimation('about', {
                            certificationRhythm: e.target.value as SiteConfig['animation']['sections']['about']['certificationRhythm'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="tight">Tight</option>
                        <option value="balanced">Balanced</option>
                        <option value="linger">Linger</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Skill Motion</span>
                      <select
                        value={siteConfig.animation.sections.about.skillMode}
                        onChange={(e) =>
                          updateSectionAnimation('about', {
                            skillMode: e.target.value as SiteConfig['animation']['sections']['about']['skillMode'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="rain">Rain</option>
                        <option value="tiles">Tiles</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-[12px] border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">Projects Grid</p>
                      <p className="text-xs text-white/55">Staggered cards and parallax hover</p>
                    </div>
                    <Toggle
                      label="Enable"
                      checked={siteConfig.animation.sections.projects.enabled}
                      onChange={(next) => updateSectionAnimation('projects', { enabled: next })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Entrance</span>
                      <select
                        value={siteConfig.animation.sections.projects.cardEntranceStyle}
                        onChange={(e) =>
                          updateSectionAnimation('projects', {
                            cardEntranceStyle: e.target.value as SiteConfig['animation']['sections']['projects']['cardEntranceStyle'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="tilt">Tilt</option>
                        <option value="drift">Drift</option>
                        <option value="rise">Rise</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Depth</span>
                      <select
                        value={siteConfig.animation.sections.projects.gridDepth}
                        onChange={(e) =>
                          updateSectionAnimation('projects', {
                            gridDepth: e.target.value as SiteConfig['animation']['sections']['projects']['gridDepth'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="tight">Tight</option>
                        <option value="balanced">Balanced</option>
                        <option value="linger">Linger</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-xs text-white/70">Enable parallax hover</p>
                    <Toggle
                      label="Parallax"
                      checked={siteConfig.animation.sections.projects.hoverParallax}
                      onChange={(next) => updateSectionAnimation('projects', { hoverParallax: next })}
                    />
                  </div>
                </div>

                <div className="rounded-[12px] border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">Testimonials</p>
                      <p className="text-xs text-white/55">Slider motion and timing</p>
                    </div>
                    <Toggle
                      label="Enable"
                      checked={siteConfig.animation.sections.testimonials.enabled}
                      onChange={(next) => updateSectionAnimation('testimonials', { enabled: next })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-white/80">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">Transition</span>
                      <select
                        value={siteConfig.animation.sections.testimonials.transitionStyle}
                        onChange={(e) =>
                          updateSectionAnimation('testimonials', {
                            transitionStyle: e.target.value as SiteConfig['animation']['sections']['testimonials']['transitionStyle'],
                          })
                        }
                        className="rounded-[10px] border border-white/14 bg-black/25 px-3 py-2 text-[13px] text-white outline-none transition-all focus:border-white/36 focus:ring-2 focus:ring-white/12"
                      >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="flip">Flip</option>
                      </select>
                    </label>

                    <Input
                      label="Autoplay (ms)"
                      type="number"
                      min={1500}
                      max={15000}
                      step={100}
                      value={siteConfig.animation.sections.testimonials.autoPlayMs}
                      onChange={(next) =>
                        updateSectionAnimation('testimonials', {
                          autoPlayMs: toSafeNumberInRange(
                            next,
                            siteConfig.animation.sections.testimonials.autoPlayMs,
                            1500,
                            15000,
                          ),
                        })
                      }
                    />

                    <Input
                      label="Float Intensity"
                      type="number"
                      min={0}
                      max={1.2}
                      step={0.05}
                      value={siteConfig.animation.sections.testimonials.floatIntensity}
                      onChange={(next) =>
                        updateSectionAnimation('testimonials', {
                          floatIntensity: toSafeNumberInRange(
                            next,
                            siteConfig.animation.sections.testimonials.floatIntensity,
                            0,
                            1.2,
                          ),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Live Animation Preview" subtitle="Hover this area and test the selected cursor animation">
              <div
                ref={previewAnimationAreaRef}
                className="relative h-[420px] overflow-hidden rounded-[14px] border border-white/12 bg-black/50"
              >
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="bg-[#090909]" />
                  <div className="bg-[#f2f2f2]" />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.1),transparent_44%),radial-gradient(circle_at_82%_82%,rgba(0,0,0,0.2),transparent_46%)]" />

                <CursorAnimationLayer
                  animation={siteConfig.animation}
                  positionMode="absolute"
                  className="absolute inset-0"
                  containerStyle={{ zIndex: 5 }}
                  trackingTargetRef={previewAnimationAreaRef}
                />

                <div className="absolute left-3 top-3 rounded-[8px] border border-white/20 bg-black/30 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                  Dark Surface
                </div>
                <div className="absolute right-3 top-3 rounded-[8px] border border-black/20 bg-white/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black/70">
                  Light Surface
                </div>

                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-[10px] border border-white/20 bg-black/35 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">
                  Active: {siteConfig.animation.activeCursorAnimation}
                </div>
              </div>

              <p className="text-xs text-white/55">
                Every animation has isolated settings. Switch between modes anytime and each one preserves its own
                values.
              </p>
            </Card>

            <Card
              className="xl:col-span-2"
              title="Motion System"
              subtitle="Global durations, easing, and hover response applied to all design system components"
            >
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  label="Fast duration (ms)"
                  type="number"
                  min={60}
                  max={600}
                  step={10}
                  value={siteConfig.animation.motion.durationFastMs}
                  onChange={(next) =>
                    updateMotionSystem(
                      'durationFastMs',
                      toSafeNumberInRange(next, siteConfig.animation.motion.durationFastMs, 60, 600),
                    )
                  }
                />
                <Input
                  label="Base duration (ms)"
                  type="number"
                  min={120}
                  max={900}
                  step={10}
                  value={siteConfig.animation.motion.durationBaseMs}
                  onChange={(next) =>
                    updateMotionSystem(
                      'durationBaseMs',
                      toSafeNumberInRange(next, siteConfig.animation.motion.durationBaseMs, 120, 900),
                    )
                  }
                />
                <Input
                  label="Slow duration (ms)"
                  type="number"
                  min={180}
                  max={1600}
                  step={10}
                  value={siteConfig.animation.motion.durationSlowMs}
                  onChange={(next) =>
                    updateMotionSystem(
                      'durationSlowMs',
                      toSafeNumberInRange(next, siteConfig.animation.motion.durationSlowMs, 180, 1600),
                    )
                  }
                />
                <Input
                  label="Ease curve (CSS timing function)"
                  value={siteConfig.animation.motion.ease}
                  onChange={(next) => updateMotionSystem('ease', next || DEFAULT_SITE_CONFIG.animation.motion.ease)}
                />
                <Input
                  label="Stagger (ms)"
                  type="number"
                  min={0}
                  max={420}
                  step={5}
                  value={siteConfig.animation.motion.staggerMs}
                  onChange={(next) =>
                    updateMotionSystem(
                      'staggerMs',
                      toSafeNumberInRange(next, siteConfig.animation.motion.staggerMs, 0, 420),
                    )
                  }
                />
                <Input
                  label="Hover lift (px)"
                  type="number"
                  min={0}
                  max={18}
                  step={0.5}
                  value={siteConfig.animation.motion.hoverLiftPx}
                  onChange={(next) =>
                    updateMotionSystem(
                      'hoverLiftPx',
                      toSafeNumberInRange(next, siteConfig.animation.motion.hoverLiftPx, 0, 18),
                    )
                  }
                />
                <Input
                  label="Hover scale"
                  type="number"
                  min={0.9}
                  max={1.2}
                  step={0.01}
                  value={siteConfig.animation.motion.hoverScale}
                  onChange={(next) =>
                    updateMotionSystem(
                      'hoverScale',
                      toSafeNumberInRange(next, siteConfig.animation.motion.hoverScale, 0.9, 1.2),
                    )
                  }
                />
              </div>

              <p className="text-xs text-white/60">
                Buttons, cards, and glass surfaces now read these motion tokens so hover lift, easing, and rhythm stay aligned across every page.
              </p>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderWritingStudio = () => {
    const contentStatusOptions: Array<{ value: SiteContentStatus; label: string }> = [
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'published', label: 'Published' },
    ];

    return (
      <div className="grid gap-4">
        <Card title="Writing Studio" subtitle="Write, stage, and publish articles + videos from one place">
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setWritingPanel('articles')}
              className={`rounded-[12px] border px-3 py-3 text-left transition-all ${
                writingPanel === 'articles'
                  ? 'border-white/32 bg-white/14 text-white'
                  : 'border-white/12 bg-black/20 text-white/72 hover:bg-white/8'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]">Articles</p>
              <p className="mt-1 text-[12px] text-white/55">{stats.publishedArticles} published</p>
            </button>
            <button
              type="button"
              onClick={() => setWritingPanel('videos')}
              className={`rounded-[12px] border px-3 py-3 text-left transition-all ${
                writingPanel === 'videos'
                  ? 'border-white/32 bg-white/14 text-white'
                  : 'border-white/12 bg-black/20 text-white/72 hover:bg-white/8'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]">Videos</p>
              <p className="mt-1 text-[12px] text-white/55">{stats.publishedVideos} published</p>
            </button>
          </div>

          <p className="rounded-[10px] border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/58">
            Workflow: write in Draft, move to Scheduled, then mark as Published to show it on the public Articles page.
          </p>
        </Card>

        {writingPanel === 'articles' ? (
          <Card title="Article Manager" subtitle="Create long-form posts with full metadata and publishing status">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-white/10 bg-black/20 px-3 py-3">
              <p className="text-xs text-white/62">
                Total: {stats.articles} • Published: {stats.publishedArticles}
              </p>
              <button
                type="button"
                onClick={() => {
                  const now = new Date().toISOString();
                  const nextArticle: SiteArticle = {
                    id: `article-${Date.now()}`,
                    title: 'New Article',
                    slug: `new-article-${Date.now()}`,
                    excerpt: 'Write a short summary for this article.',
                    content: 'Write your article body here.',
                    coverImage: '/frames/scene-03-screen-entry/ezgif-frame-001.jpg',
                    author: 'Your Name',
                    category: 'Insights',
                    tags: ['insight'],
                    readingMinutes: 6,
                    status: 'draft',
                    featured: false,
                    visible: true,
                    publishedAt: now,
                    videoUrl: '',
                  };

                  updateConfig((prev) => ({
                    ...prev,
                    articles: [nextArticle, ...prev.articles],
                  }));
                }}
                className="rounded-[8px] border border-white/22 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Article
              </button>
            </div>

            {siteConfig.articles.map((article) => (
              <div key={article.id} className={listItemClass}>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    label="Title"
                    value={article.title}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, title: next }))}
                  />
                  <Input
                    label="Slug"
                    value={article.slug}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, slug: slugify(next) }))}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateArticle(article.id, (item) => ({ ...item, slug: slugify(item.title) }))}
                    className="rounded-[8px] border border-white/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/85 hover:bg-white/10"
                  >
                    Regenerate Slug
                  </button>
                  <span className="rounded-[999px] border border-white/15 bg-black/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/62">
                    URL: #/articles/{article.slug}
                  </span>
                </div>

                <Textarea
                  label="Excerpt"
                  value={article.excerpt}
                  rows={3}
                  onChange={(next) => updateArticle(article.id, (item) => ({ ...item, excerpt: next }))}
                />
                <Textarea
                  label="Content"
                  value={article.content}
                  rows={10}
                  onChange={(next) => updateArticle(article.id, (item) => ({ ...item, content: next }))}
                />

                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    label="Cover image URL"
                    value={article.coverImage}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, coverImage: next }))}
                  />
                  <Input
                    label="Related video URL"
                    value={article.videoUrl}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, videoUrl: next }))}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
                  <Input
                    label="Author"
                    value={article.author}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, author: next }))}
                  />
                  <Input
                    label="Category"
                    value={article.category}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, category: next }))}
                  />
                  <Input
                    label="Tags (comma separated)"
                    value={article.tags.join(', ')}
                    onChange={(next) =>
                      updateArticle(article.id, (item) => ({
                        ...item,
                        tags: next
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                  <Input
                    label="Reading time (minutes)"
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                    value={article.readingMinutes}
                    onChange={(next) =>
                      updateArticle(article.id, (item) => ({
                        ...item,
                        readingMinutes: toSafeNumberInRange(next, item.readingMinutes, 1, 120),
                      }))
                    }
                  />
                  <Input
                    label="Published at (ISO)"
                    value={article.publishedAt}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, publishedAt: next }))}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <SelectInput
                    label="Status"
                    value={article.status}
                    options={contentStatusOptions}
                    onChange={(next) =>
                      updateArticle(article.id, (item) => ({
                        ...item,
                        status: next as SiteContentStatus,
                      }))
                    }
                  />
                  <Toggle
                    label="Visible"
                    checked={article.visible}
                    onChange={(next) => updateArticle(article.id, (item) => ({ ...item, visible: next }))}
                  />
                  <Toggle
                    label="Featured"
                    checked={article.featured}
                    onChange={(next) => {
                      updateConfig((prev) => ({
                        ...prev,
                        articles: prev.articles.map((item) =>
                          item.id === article.id
                            ? { ...item, featured: next }
                            : next
                              ? { ...item, featured: false }
                              : item,
                        ),
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const duplicate: SiteArticle = {
                        ...article,
                        id: `article-${Date.now()}`,
                        title: `${article.title} (Copy)`,
                        slug: `${article.slug}-copy-${Date.now()}`,
                        status: 'draft',
                        featured: false,
                      };

                      updateConfig((prev) => ({
                        ...prev,
                        articles: [duplicate, ...prev.articles],
                      }));
                    }}
                    className="rounded-[8px] border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
                  >
                    Duplicate
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        articles: prev.articles.filter((item) => item.id !== article.id),
                      }));
                    }}
                    className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                  >
                    Remove Article
                  </button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}

        {writingPanel === 'videos' ? (
          <Card title="Video Manager" subtitle="Publish supporting videos for the Articles page and linked content">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-white/10 bg-black/20 px-3 py-3">
              <p className="text-xs text-white/62">
                Total: {stats.videos} • Published: {stats.publishedVideos}
              </p>
              <button
                type="button"
                onClick={() => {
                  const now = new Date().toISOString();
                  const nextVideo: SiteVideoItem = {
                    id: `video-${Date.now()}`,
                    title: 'New Video',
                    description: 'Add a short context for this video.',
                    platform: 'youtube',
                    videoUrl: 'https://www.youtube.com/watch?v=',
                    thumbnail: '/frames/scene-04/ezgif-frame-001.jpg',
                    durationLabel: '06:00',
                    status: 'draft',
                    featured: false,
                    visible: true,
                    publishedAt: now,
                  };

                  updateConfig((prev) => ({
                    ...prev,
                    videos: [nextVideo, ...prev.videos],
                  }));
                }}
                className="rounded-[8px] border border-white/22 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10"
              >
                Add Video
              </button>
            </div>

            {siteConfig.videos.map((video) => (
              <div key={video.id} className={listItemClass}>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    label="Title"
                    value={video.title}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, title: next }))}
                  />
                  <SelectInput
                    label="Platform"
                    value={video.platform}
                    options={[
                      { value: 'youtube', label: 'YouTube' },
                      { value: 'vimeo', label: 'Vimeo' },
                      { value: 'other', label: 'Other' },
                    ]}
                    onChange={(next) =>
                      updateVideo(video.id, (item) => ({
                        ...item,
                        platform: next as SiteVideoItem['platform'],
                      }))
                    }
                  />
                </div>

                <Textarea
                  label="Description"
                  value={video.description}
                  rows={3}
                  onChange={(next) => updateVideo(video.id, (item) => ({ ...item, description: next }))}
                />

                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    label="Video URL"
                    value={video.videoUrl}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, videoUrl: next }))}
                  />
                  <Input
                    label="Thumbnail URL"
                    value={video.thumbnail}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, thumbnail: next }))}
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    label="Duration label"
                    value={video.durationLabel}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, durationLabel: next }))}
                  />
                  <Input
                    label="Published at (ISO)"
                    value={video.publishedAt}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, publishedAt: next }))}
                  />
                  <SelectInput
                    label="Status"
                    value={video.status}
                    options={contentStatusOptions}
                    onChange={(next) =>
                      updateVideo(video.id, (item) => ({
                        ...item,
                        status: next as SiteContentStatus,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <Toggle
                    label="Visible"
                    checked={video.visible}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, visible: next }))}
                  />
                  <Toggle
                    label="Featured"
                    checked={video.featured}
                    onChange={(next) => updateVideo(video.id, (item) => ({ ...item, featured: next }))}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateConfig((prev) => ({
                        ...prev,
                        videos: prev.videos.filter((item) => item.id !== video.id),
                      }));
                    }}
                    className="rounded-[8px] border border-red-400/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-200 hover:bg-red-500/10"
                  >
                    Remove Video
                  </button>
                </div>
              </div>
            ))}
          </Card>
        ) : null}
      </div>
    );
  };

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[440px] rounded-[16px] border border-white/12 bg-[rgba(15,15,18,0.82)] p-6 backdrop-blur-xl"
        >
          <h1 className="font-mono text-[12px] uppercase tracking-[0.28em] text-white/90">Dashboard Access</h1>
          <p className="mt-3 text-sm text-white/65">Hidden control panel. Enter password to continue.</p>

          <label className="mt-5 flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-[10px] border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/40"
              autoFocus
            />
          </label>

          {authError ? <p className="mt-3 text-sm text-red-300">{authError}</p> : null}

          <button
            type="submit"
            className="mt-5 inline-flex items-center justify-center rounded-[10px] border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
          >
            Unlock
          </button>

          <p className="mt-4 text-xs text-white/40">Open this page with the hidden route: #/dashboard</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(76,114,255,0.12),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(110,255,218,0.08),transparent_35%),#060608] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(8,8,10,0.82)] backdrop-blur-xl">
        <div
          className="mx-auto flex w-full flex-col gap-4 px-4 py-4 md:px-6 xl:flex-row xl:items-center xl:justify-between"
          style={{ maxWidth: 'var(--ds-layout-max-width)' }}
        >
          <div>
            <h1 className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/95">Cinematic Site Dashboard</h1>
            <p className="mt-1 text-sm text-white/58">A cleaner control center for content, design system, and motion.</p>

            <div className="mt-3 grid max-w-[440px] gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveWorkspace('settings')}
                className={`rounded-[11px] border px-3 py-2 text-left transition-all ${
                  activeWorkspace === 'settings'
                    ? 'border-white/35 bg-white/15 text-white'
                    : 'border-white/14 bg-black/25 text-white/72 hover:bg-white/10'
                }`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em]">Site Settings</p>
                <p className="mt-1 text-[12px] text-white/58">Design, scenes, motion, and visibility</p>
              </button>
              <button
                type="button"
              onClick={() => setActiveWorkspace('writing')}
              className={`rounded-[11px] border px-3 py-2 text-left transition-all ${
                activeWorkspace === 'writing'
                  ? 'border-white/35 bg-white/15 text-white'
                  : 'border-white/14 bg-black/25 text-white/72 hover:bg-white/10'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]">Writing Studio</p>
              <p className="mt-1 text-[12px] text-white/58">Write and publish articles and videos</p>
            </button>
          </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-[999px] border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/72">
                Projects: {stats.projects}
              </span>
              <span className="rounded-[999px] border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/72">
                Testimonials: {stats.testimonials}
              </span>
              <span className="rounded-[999px] border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/72">
                Nav items: {stats.navItems}
              </span>
              <span className="rounded-[999px] border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/72">
                Articles: {stats.articles}
              </span>
              <span className="rounded-[999px] border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white/72">
                Videos: {stats.videos}
              </span>
              <span
                className={`rounded-[999px] border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                  hasUnsavedChanges
                    ? 'border-amber-300/35 bg-amber-500/10 text-amber-200'
                    : 'border-emerald-300/35 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={handleSaveChanges}
              className={`${getButtonClass('button-1', 'dark', 'sm')} ${
                hasUnsavedChanges
                  ? 'border-amber-300/45 text-amber-100 shadow-[0_10px_24px_rgba(245,158,11,0.16)]'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              Save Changes
            </button>
            <button type="button" onClick={handleOpenSite} className={getButtonClass('button-2', 'dark', 'sm')}>
              Open Site
            </button>
            <button
              type="button"
              onClick={() => {
                resetSiteConfig();
                clearUploadFeedback();
                setHasUnsavedChanges(false);
              }}
              className={getButtonClass('button-3', 'dark', 'sm')}
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`${getButtonClass('button-2', 'dark', 'sm')} border-red-300/45 text-red-200 hover:bg-red-500/10`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div
        className="mx-auto w-full px-4 pb-8 pt-5 md:px-6"
        style={{ maxWidth: 'var(--ds-layout-max-width)' }}
      >
        {activeWorkspace === 'settings' ? (
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="xl:sticky xl:top-[122px] xl:self-start">
              <div className="rounded-[16px] border border-white/10 bg-[rgba(10,10,13,0.75)] p-3 backdrop-blur-xl">
                <p className="px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62">
                  Dashboard Sections
                </p>
                <div className="mt-3 space-y-3">
                  {DASHBOARD_SECTION_GROUPS.map((group) => (
                    <div key={group.id} className="space-y-2">
                      <p className="px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/48">
                        {group.label}
                      </p>

                      {group.sectionIds.map((sectionId) => {
                        const section = DASHBOARD_SECTIONS.find((entry) => entry.id === sectionId);
                        if (!section) return null;

                        return (
                          <SectionButton
                            key={section.id}
                            label={section.label}
                            hint={section.hint}
                            isActive={activeSection === section.id}
                            onClick={() => {
                              setActiveSection(section.id);
                              clearUploadFeedback();
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-[12px] border border-white/10 bg-black/30 px-3 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">Current Section</p>
                  <p className="mt-1 text-sm text-white/90">{activeSectionInfo.label}</p>
                  <p className="mt-1 text-xs text-white/58">{activeSectionInfo.hint}</p>
                </div>
              </div>
            </aside>

            <section className="min-w-0 space-y-4">
              {uploadError ? (
                <div className="rounded-[12px] border border-red-300/35 bg-red-900/15 px-4 py-3 text-sm text-red-200">
                  {uploadError}
                </div>
              ) : null}
              {uploadMessage ? (
                <div className="rounded-[12px] border border-emerald-300/35 bg-emerald-900/15 px-4 py-3 text-sm text-emerald-200">
                  {uploadMessage}
                </div>
              ) : null}

              {renderSectionContent()}
            </section>
          </div>
        ) : (
          <section className="min-w-0 space-y-4">
            {uploadError ? (
              <div className="rounded-[12px] border border-red-300/35 bg-red-900/15 px-4 py-3 text-sm text-red-200">
                {uploadError}
              </div>
            ) : null}
            {uploadMessage ? (
              <div className="rounded-[12px] border border-emerald-300/35 bg-emerald-900/15 px-4 py-3 text-sm text-emerald-200">
                {uploadMessage}
              </div>
            ) : null}

            {renderWritingStudio()}
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
