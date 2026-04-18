import React from 'react';
import { DEFAULT_SITE_CONFIG, type SiteGlobalFrameConfig } from '../config/siteConfig';

export interface GlobalFrameOverlayProps {
  /** 
   * Ratio of the inner inset shadow's strength.
   * 0 = no shadow over images, 1 = full shadow over images 
   */
  innerShadowIntensity?: number; 
  frameConfig?: SiteGlobalFrameConfig;
}

/**
 * Rebuilt Antique Portal - Structural Viewport Matte
 * Uses a massive box-shadow to carve a physical "hole" into a solid wall.
 * This explicitly separates the top header UI zone from the cinematic window.
 */
export const GlobalFrameOverlay: React.FC<GlobalFrameOverlayProps> = ({
  innerShadowIntensity = 0.5,
  frameConfig = DEFAULT_SITE_CONFIG.globalFrame,
}) => {
  const frameVars = {
    '--frame-top-mobile': `${frameConfig.topOffsetMobilePx}px`,
    '--frame-top-desktop': `${frameConfig.topOffsetDesktopPx}px`,
    '--frame-bottom-mobile': `${frameConfig.bottomOffsetMobilePx}px`,
    '--frame-bottom-desktop': `${frameConfig.bottomOffsetDesktopPx}px`,
    '--frame-side-mobile': `${frameConfig.sideOffsetMobilePx}px`,
    '--frame-side-desktop': `${frameConfig.sideOffsetDesktopPx}px`,
    '--frame-top-radius-mobile': `${frameConfig.topRadiusMobilePx}px`,
    '--frame-top-radius-desktop': `${frameConfig.topRadiusDesktopPx}px`,
    '--frame-bottom-radius': `${frameConfig.bottomRadiusPx}px`,
  } as React.CSSProperties;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 45, ...frameVars }}
      aria-hidden="true"
    >
      <style>
        {`
          .global-frame-hole {
            top: var(--frame-top-mobile);
            bottom: var(--frame-bottom-mobile);
            left: var(--frame-side-mobile);
            right: var(--frame-side-mobile);
            border-radius: var(--frame-top-radius-mobile) var(--frame-top-radius-mobile) var(--frame-bottom-radius) var(--frame-bottom-radius);
          }

          @media (min-width: 768px) {
            .global-frame-hole {
              top: var(--frame-top-desktop);
              bottom: var(--frame-bottom-desktop);
              left: var(--frame-side-desktop);
              right: var(--frame-side-desktop);
              border-radius: var(--frame-top-radius-desktop) var(--frame-top-radius-desktop) var(--frame-bottom-radius) var(--frame-bottom-radius);
            }
          }
        `}
      </style>

      {/* Box shadow matte technique:
          Creates a literal physical "hole" in a solid wall.
          The wall color is a premium dark charcoal-umber (#0c0a08). */}
      <div 
        className="global-frame-hole absolute transition-shadow duration-700"
        style={{
          boxShadow: `
            0 0 0 100vmax ${frameConfig.matteColor}, 
            inset 0 16px 40px -8px rgba(0,0,0,${0.85 * innerShadowIntensity}),
            inset 0 2px 4px rgba(255, 240, 220, ${0.08 * innerShadowIntensity}),
            inset 0 -2px 12px rgba(0,0,0,${0.3 * innerShadowIntensity})
          `,
        }}
      >
        {/* Subtle glass texture scoped ONLY to the hole opening. */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-screen transition-opacity duration-1000 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            backgroundImage: 'var(--glass-smudges-img, radial-gradient(ellipse at 70% 30%, rgba(255,245,230,0.5), transparent 50%))',
            backgroundSize: 'cover'
          }}
        />
        
        {/* Directional rim light hitting the inner edge of the portal */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            borderTop: '1px solid rgba(255, 240, 225, 0.06)',
            borderLeft: '1px solid rgba(255, 235, 215, 0.03)',
            borderRight: '1px solid rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
          }}
        />
      </div>
    </div>
  );
};

