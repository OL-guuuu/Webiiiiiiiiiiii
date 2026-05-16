import React, { useMemo } from 'react';
import { AdvancedNavbar } from '../components/AdvancedNavbar';
import { Footer } from '../components/Footer';
import { getCardClass, getScaledRem } from '../components/designSystem';
import { useSiteConfig } from '../context/SiteConfigContext';

type LegalDocumentKind = 'terms' | 'privacy';

interface LegalDocumentPageProps {
  kind: LegalDocumentKind;
}

const splitParagraphs = (content: string) => {
  return content
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({ kind }) => {
  const { siteConfig } = useSiteConfig();
  const { legalPages, designSystem } = siteConfig;

  const isTerms = kind === 'terms';
  const title = isTerms ? legalPages.termsTitle : legalPages.privacyTitle;
  const lastUpdated = isTerms ? legalPages.termsLastUpdated : legalPages.privacyLastUpdated;
  const content = isTerms ? legalPages.termsContent : legalPages.privacyContent;

  const paragraphs = useMemo(() => splitParagraphs(content), [content]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fc_0%,#eef1f7_46%,#f6f8fd_100%)] text-[#111217]" data-surface="base">
      <AdvancedNavbar isLightMode={true} />

      <main className="site-shell pb-12 pt-28 md:pb-16 md:pt-32">
        <section className={`${getCardClass(designSystem.components.featuredProjectCardVariant, 'light', 'p-6 md:p-8')} mx-auto max-w-4xl`}>
          <h1
            className="fw-header-text text-[#111217]"
            style={{
              fontSize: `clamp(${getScaledRem(designSystem.theme.sectionTitleSizeRem * 0.9, designSystem.theme.headingScale)}, 4vw, ${getScaledRem(
                designSystem.theme.displayTitleSizeRem * 0.82,
                designSystem.theme.headingScale,
              )})`,
              letterSpacing: `${designSystem.theme.headingLetterSpacingEm}em`,
              fontWeight: designSystem.theme.headingWeight,
            }}
          >
            {title}
          </h1>

          {lastUpdated ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/60">
              {legalPages.lastUpdatedLabel}: {lastUpdated}
            </p>
          ) : null}

          <div className="mt-6 space-y-4 text-[1rem] leading-8 text-[#111217]/75 md:text-[1.04rem] md:leading-9">
            {paragraphs.map((paragraph, index) => (
              <p key={`${kind}-paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>

          <a
            href="#home"
            className="mt-8 inline-flex items-center rounded-[12px] border border-[#111217]/20 bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217] transition-colors hover:bg-[#111217]/6"
          >
            {legalPages.backToHomeLabel}
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalDocumentPage;
