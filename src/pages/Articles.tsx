import React, { useEffect, useMemo, useState } from 'react';
import CursorAnimationLayer from '../components/CursorAnimationLayer';
import { Footer } from '../components/Footer';
import { PersistentUI } from '../components/PersistentUI';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getButtonClass, getCardClass, getGlassClass, getScaledRem } from '../components/designSystem';

interface ArticlesPageProps {
  slug?: string;
}

type PaginationItem = number | 'left-ellipsis' | 'right-ellipsis';

const ALL_TOPICS_TOKEN = '__all';
const ARTICLES_PER_PAGE = 9;

const parseDateLabel = (value: string) => {
  if (!value) return 'Undated';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const splitContentParagraphs = (content: string) => {
  return content
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
  );
  if (youtubeMatch?.[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
};

const normalizeTopic = (value: string) => {
  return value.toLowerCase().trim().replace(/\s+/g, '-');
};

const matchesQuery = (haystack: string, query: string) => {
  return haystack.toLowerCase().includes(query.toLowerCase());
};

const buildPagination = (currentPage: number, totalPages: number): PaginationItem[] => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const items: PaginationItem[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) items.push('left-ellipsis');

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) items.push('right-ellipsis');

  items.push(totalPages);

  return items;
};

export const Articles: React.FC<ArticlesPageProps> = ({ slug }) => {
  const { siteConfig } = useSiteConfig();
  const { articlesPage, articles, designSystem, visibility, animation } = siteConfig;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS_TOKEN);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const publishedArticles = useMemo(() => {
    return [...articles]
      .filter((item) => item.visible && item.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles]);

  const currentArticle = useMemo(() => {
    if (!slug) return null;
    return publishedArticles.find((item) => item.slug === slug) ?? null;
  }, [slug, publishedArticles]);

  const relatedArticles = useMemo(() => {
    if (!currentArticle) return [];
    return publishedArticles.filter((item) => item.id !== currentArticle.id).slice(0, 3);
  }, [currentArticle, publishedArticles]);

  const topics = useMemo(() => {
    const topicMap = new Map<string, string>();

    publishedArticles.forEach((article) => {
      const sourceTopics = [article.category, ...article.tags].filter(Boolean);
      sourceTopics.forEach((topic) => {
        const token = normalizeTopic(topic);
        if (!token || topicMap.has(token)) return;
        topicMap.set(token, topic);
      });
    });

    const sortedTopics = Array.from(topicMap.entries())
      .map(([token, label]) => ({ token, label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [{ token: ALL_TOPICS_TOKEN, label: articlesPage.allTopicsLabel }, ...sortedTopics];
  }, [articlesPage.allTopicsLabel, publishedArticles]);

  useEffect(() => {
    if (topics.some((topic) => topic.token === activeTopic)) return;
    setActiveTopic(ALL_TOPICS_TOKEN);
  }, [activeTopic, topics]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      const topicMatch =
        activeTopic === ALL_TOPICS_TOKEN
          ? true
          : [article.category, ...article.tags].some((topic) => normalizeTopic(topic) === activeTopic);

      if (!topicMatch) return false;
      if (!searchQuery.trim()) return true;

      const searchable = [
        article.title,
        article.excerpt,
        article.content,
        article.author,
        article.category,
        article.tags.join(' '),
      ].join(' ');

      return matchesQuery(searchable, searchQuery);
    });
  }, [activeTopic, publishedArticles, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));
  }, [filteredArticles.length]);

  const paginationItems = useMemo(() => {
    return buildPagination(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [currentPage, filteredArticles]);

  const featuredPageArticle = paginatedArticles[0] ?? null;
  const remainingPageArticles = featuredPageArticle ? paginatedArticles.slice(1) : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTopic, searchQuery]);

  useEffect(() => {
    if (currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const {
    headingScale,
    displayTitleSizeRem,
    sectionTitleSizeRem,
    bodyTextSizeRem,
    headingWeight,
    headingLetterSpacingEm,
    bodyLineHeight,
  } = designSystem.theme;

  const dsComponents = designSystem.components;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fc_0%,#eef1f7_46%,#f6f8fd_100%)] text-[#111217] selection:bg-[#111217]/10" data-surface="base">
      {visibility.cursorAnimation ? <CursorAnimationLayer animation={animation} /> : null}
      <PersistentUI isLightMode />

      <main className="mx-auto w-full max-w-[1600px] overflow-x-clip px-4 pb-20 pt-32 sm:px-6 md:px-12 lg:px-20">
        {slug && !currentArticle ? (
          <section className="mt-10">
            <div
              className={`${getCardClass(dsComponents.featuredProjectCardVariant, 'light', 'p-6')} ${getGlassClass(
                dsComponents.globalGlassVariant,
                'light',
              )}`}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/60">
                {articlesPage.articleNotFoundTitle}
              </p>
              <p className="mt-3 text-[#111217]/75">{articlesPage.articleNotFoundDescription}</p>
              <a
                href="#/articles"
                className={`${getButtonClass(dsComponents.featuredViewAllButtonVariant, 'light', 'md')} mt-5 inline-flex`}
              >
                {articlesPage.backToArticlesLabel}
              </a>
            </div>
          </section>
        ) : null}

        {currentArticle ? (
          <article className="mx-auto mt-10 max-w-[760px]">
            <a
              href="#/articles"
              className="inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/60 transition-colors hover:text-[#111217]"
            >
              <span aria-hidden>←</span>
              {articlesPage.backToArticlesLabel}
            </a>

            <header className="mt-6 border-b border-[#111217]/12 pb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/55">{currentArticle.category}</p>
              <h1
                className="mt-3 text-[#111217]"
                style={{
                  fontSize: `clamp(${getScaledRem(sectionTitleSizeRem, headingScale)}, 5.8vw, ${getScaledRem(
                    sectionTitleSizeRem * 2.15,
                    headingScale,
                  )})`,
                  fontWeight: headingWeight,
                  letterSpacing: `${headingLetterSpacingEm}em`,
                  lineHeight: 1.08,
                }}
              >
                {currentArticle.title}
              </h1>
              {currentArticle.excerpt ? (
                <p
                  className="mt-4 max-w-[65ch] text-[#111217]/72"
                  style={{ fontSize: `${Math.max(1.01, bodyTextSizeRem)}rem`, lineHeight: Math.max(1.6, bodyLineHeight) }}
                >
                  {currentArticle.excerpt}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[#111217]/65">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/65">
                  {articlesPage.byAuthorPrefix} {currentArticle.author}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#111217]/35" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/65">
                  {parseDateLabel(currentArticle.publishedAt)}
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[#111217]/35" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/65">
                  {currentArticle.readingMinutes} {articlesPage.minReadLabel}
                </span>
              </div>
            </header>

            {currentArticle.coverImage ? (
              <div className="mt-8 overflow-hidden rounded-[14px] border border-[#111217]/12 bg-[#111217]/5">
                <img
                  src={currentArticle.coverImage}
                  alt={currentArticle.title}
                  className="max-h-[500px] w-full object-cover"
                />
              </div>
            ) : null}

            <section className="mt-10 space-y-7">
              {splitContentParagraphs(currentArticle.content).map((paragraph, index) => (
                <p
                  key={`${currentArticle.id}-paragraph-${index}`}
                  className="text-[#111217]/88"
                  style={{
                    fontSize: `${Math.max(1.06, bodyTextSizeRem)}rem`,
                    lineHeight: Math.max(1.72, bodyLineHeight + 0.14),
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </section>

            {currentArticle.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-[#111217]/10 pt-6">
                {currentArticle.tags.map((tag) => (
                  <span
                    key={`${currentArticle.id}-${tag}`}
                    className="rounded-[999px] border border-[#111217]/15 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {currentArticle.videoUrl ? (
              <div
                className="mt-12 rounded-[16px] border border-[#111217]/12 bg-white px-5 py-6 shadow-sys-soft-light md:px-6"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/60">
                  {articlesPage.relatedVideoLabel}
                </p>
                {getVideoEmbedUrl(currentArticle.videoUrl) ? (
                  <div className="mt-4 aspect-video overflow-hidden rounded-[14px] border border-[#111217]/12 bg-[#111217]">
                    <iframe
                      src={getVideoEmbedUrl(currentArticle.videoUrl) ?? undefined}
                      title={`${currentArticle.title} video`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={currentArticle.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${getButtonClass(dsComponents.featuredProjectButtonVariant, 'light', 'md')} mt-4 inline-flex`}
                  >
                    {articlesPage.openVideoLabel}
                  </a>
                )}
              </div>
            ) : null}

            {relatedArticles.length > 0 ? (
              <section className="mt-12 border-t border-[#111217]/12 pt-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/58">
                  {articlesPage.latestArticlesLabel}
                </p>
                <div className="mt-4 divide-y divide-[#111217]/10 overflow-hidden rounded-[14px] border border-[#111217]/12 bg-white">
                  {relatedArticles.map((article) => (
                    <a
                      key={article.id}
                      href={`#/articles/${article.slug}`}
                      className="block px-5 py-5 transition-colors hover:bg-[#f7f9fd]"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/55">
                        {parseDateLabel(article.publishedAt)} • {article.readingMinutes} {articlesPage.minReadLabel}
                      </p>
                      <p className="mt-2 text-[19px] font-medium leading-[1.2] text-[#111217]">{article.title}</p>
                      <p
                        className="mt-2 text-[14px] text-[#111217]/66"
                        style={{
                          lineHeight: 1.56,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {article.excerpt}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        ) : (
          <>
            <section className="relative overflow-hidden border-b border-[#111217]/10 pb-10">
              <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-[#d7e4ff] blur-[70px]" />
              <div className="pointer-events-none absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-[#dce9f4] blur-[70px]" />

              <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111217]/42">{articlesPage.subtitle}</p>
                  <h1
                    className="mt-3 text-[#111217]"
                    style={{
                      fontSize: `clamp(${getScaledRem(displayTitleSizeRem * 0.34, headingScale)}, 6vw, ${getScaledRem(
                        displayTitleSizeRem * 0.62,
                        headingScale,
                      )})`,
                      fontWeight: headingWeight,
                      letterSpacing: `${headingLetterSpacingEm}em`,
                      lineHeight: 1.05,
                    }}
                  >
                    {articlesPage.title}
                  </h1>
                </div>

                <p
                  className="max-w-[60ch] text-[#111217]/72 lg:justify-self-end"
                  style={{
                    fontSize: `${Math.max(0.95, bodyTextSizeRem)}rem`,
                    lineHeight: bodyLineHeight,
                  }}
                >
                  {articlesPage.description}
                </p>
              </div>
            </section>

            <section className="mt-8 border-b border-[#111217]/10 pb-6">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative">
                  <svg
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#111217]/35"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" />
                  </svg>
                  <input
                    id="articles-search"
                    type="search"
                    aria-label={articlesPage.searchPlaceholder}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={articlesPage.searchPlaceholder}
                    className="h-12 w-full rounded-[12px] border border-[#111217]/12 bg-white/72 pl-11 pr-4 font-mono text-[12px] tracking-[0.12em] text-[#111217] outline-none transition-all placeholder:text-[#111217]/35 focus:border-[#111217]/28"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {topics.map((topic) => {
                    const isActive = activeTopic === topic.token;
                    return (
                      <button
                        key={topic.token}
                        type="button"
                        onClick={() => setActiveTopic(topic.token)}
                        className={`rounded-[999px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                          isActive
                            ? 'border-[#111217]/35 bg-[#111217] text-white'
                            : 'border-[#111217]/12 bg-white text-[#111217]/65 hover:border-[#111217]/24 hover:text-[#111217]'
                        }`}
                      >
                        {topic.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="mt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111217]/58">
                {articlesPage.latestArticlesLabel}
              </p>

              {paginatedArticles.length > 0 ? (
                <div className="mt-4 space-y-8">
                  {featuredPageArticle ? (
                    <a
                      href={`#/articles/${featuredPageArticle.slug}`}
                      className="group grid gap-5 overflow-hidden rounded-[20px] border border-[#111217]/10 bg-[linear-gradient(152deg,#ffffff,#eef3fb)] p-4 transition-colors hover:border-[#111217]/22 md:grid-cols-[1.05fr_0.95fr] md:p-5"
                    >
                      <div className="relative overflow-hidden rounded-[14px] border border-[#111217]/12 bg-[#111217]/7">
                        {featuredPageArticle.coverImage ? (
                          <img
                            src={featuredPageArticle.coverImage}
                            alt={featuredPageArticle.title}
                            className="h-full min-h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full min-h-[220px] items-center justify-center bg-[#e5eaf5]">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111217]/58">
                              {articlesPage.noThumbnailLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col justify-between gap-4 py-1">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#111217]/56">
                            {articlesPage.featuredArticleLabel}
                          </p>
                          <h3 className="mt-2 text-[26px] font-semibold leading-[1.12] tracking-[-0.01em] text-[#111217] sm:text-[30px]">
                            {featuredPageArticle.title}
                          </h3>
                          <p
                            className="mt-3 max-w-[58ch] text-[15px] text-[#111217]/68"
                            style={{
                              lineHeight: 1.62,
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {featuredPageArticle.excerpt}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#111217]/62">
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/62">
                            {parseDateLabel(featuredPageArticle.publishedAt)}
                          </span>
                          <span className="h-[3px] w-[3px] rounded-full bg-[#111217]/28" aria-hidden />
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/62">
                            {featuredPageArticle.readingMinutes} {articlesPage.minReadLabel}
                          </span>
                          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/72">
                            {articlesPage.continueReadingLabel}
                          </span>
                        </div>
                      </div>
                    </a>
                  ) : null}

                  {remainingPageArticles.length > 0 ? (
                    <div className="divide-y divide-[#111217]/10 border-y border-[#111217]/10">
                      {remainingPageArticles.map((article) => (
                        <a
                          key={article.id}
                          href={`#/articles/${article.slug}`}
                          className="group grid gap-4 py-5 transition-colors hover:bg-white/62 sm:grid-cols-[1fr_auto]"
                        >
                          <div className="min-w-0 px-1">
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/56">
                              {article.category}
                            </p>
                            <h3
                              className="mt-2 text-[24px] font-semibold leading-[1.14] tracking-[-0.01em] text-[#111217]"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {article.title}
                            </h3>
                            <p
                              className="mt-2 max-w-[64ch] text-[14px] text-[#111217]/67"
                              style={{
                                lineHeight: 1.58,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {article.excerpt}
                            </p>
                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#111217]/55">
                              {parseDateLabel(article.publishedAt)} • {article.readingMinutes} {articlesPage.minReadLabel}
                            </p>
                          </div>

                          {article.coverImage ? (
                            <div className="hidden overflow-hidden rounded-[12px] border border-[#111217]/12 bg-[#111217]/6 sm:block sm:h-[92px] sm:w-[146px]">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            </div>
                          ) : null}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 rounded-[14px] border border-[#111217]/12 bg-white/74 px-5 py-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111217]/60">
                    {articlesPage.noResultsTitle}
                  </p>
                  <p className="mt-2 text-[#111217]/68">{articlesPage.noResultsDescription}</p>
                </div>
              )}

              {totalPages > 1 ? (
                <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`${getButtonClass(dsComponents.featuredProjectButtonVariant, 'light', 'sm')} ${
                      currentPage === 1 ? 'pointer-events-none opacity-45' : ''
                    }`}
                  >
                    {articlesPage.previousPageLabel}
                  </button>

                  {paginationItems.map((item, index) =>
                    typeof item === 'number' ? (
                      <button
                        key={`articles-page-${item}`}
                        type="button"
                        onClick={() => setCurrentPage(item)}
                        className={`h-9 min-w-9 rounded-[10px] border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                          item === currentPage
                            ? 'border-[#111217]/35 bg-[#111217] text-white'
                            : 'border-[#111217]/15 bg-white text-[#111217]/62 hover:border-[#111217]/28 hover:text-[#111217]'
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span
                        key={`articles-ellipsis-${index}`}
                        className="inline-flex h-9 min-w-9 items-center justify-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#111217]/45"
                      >
                        ...
                      </span>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`${getButtonClass(dsComponents.featuredProjectButtonVariant, 'light', 'sm')} ${
                      currentPage === totalPages ? 'pointer-events-none opacity-45' : ''
                    }`}
                  >
                    {articlesPage.nextPageLabel}
                  </button>
                </div>
              ) : null}
            </section>

            <section className="mt-14 border-t border-[#111217]/10 pt-8">
              <div className="mx-auto max-w-[760px] text-center">
                <h3
                  className="text-[#111217]"
                  style={{
                    fontSize: `clamp(${getScaledRem(sectionTitleSizeRem * 0.74, headingScale)}, 3.2vw, ${getScaledRem(
                      sectionTitleSizeRem,
                      headingScale,
                    )})`,
                    fontWeight: headingWeight,
                    letterSpacing: `${headingLetterSpacingEm}em`,
                  }}
                >
                  {articlesPage.newsletterTitle}
                </h3>
                <p className="mt-2 text-[#111217]/66" style={{ lineHeight: bodyLineHeight }}>
                  {articlesPage.newsletterDescription}
                </p>
                <form
                  className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setNewsletterEmail('');
                  }}
                >
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder={articlesPage.newsletterInputPlaceholder}
                    className="h-11 w-full max-w-[390px] rounded-[12px] border border-[#111217]/14 bg-white px-4 font-mono text-[12px] tracking-[0.12em] text-[#111217] outline-none transition-all placeholder:text-[#111217]/35 focus:border-[#111217]/28"
                  />
                  <button
                    type="submit"
                    className={getButtonClass(dsComponents.featuredProjectButtonVariant, 'light', 'md')}
                  >
                    {articlesPage.newsletterButtonLabel}
                  </button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Articles;
