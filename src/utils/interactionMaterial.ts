export type SurfaceType =
  | 'hero'
  | 'media'
  | 'frame'
  | 'base'
  | 'ambient'
  | 'glass'
  | 'text'
  | 'form';

export type MaterialProfile = 'media' | 'site';

export interface InteractionSnapshot {
  clientX: number;
  clientY: number;
  hasPointer: boolean;
  surface: SurfaceType;
}

type SnapshotListener = (snapshot: InteractionSnapshot) => void;

const VALID_SURFACES = new Set<SurfaceType>([
  'hero',
  'media',
  'frame',
  'base',
  'ambient',
  'glass',
  'text',
  'form',
]);

const TEXT_SELECTOR =
  'p, h1, h2, h3, h4, h5, h6, li, blockquote, article, figcaption, small, code, pre';

const FORM_SELECTOR = 'form, input, textarea, select, button, [contenteditable="true"]';

const MEDIA_SELECTOR = 'img, video, canvas, picture, figure, svg';

const listeners = new Set<SnapshotListener>();

const snapshot: InteractionSnapshot = {
  clientX: 0,
  clientY: 0,
  hasPointer: false,
  surface: 'base',
};

let isListening = false;

const MEDIA_INTENSITY_BY_SURFACE: Record<SurfaceType, number> = {
  hero: 1.0,
  media: 0.95,
  frame: 1.0,
  base: 0.46,
  ambient: 0.36,
  glass: 0.24,
  text: 0.04,
  form: 0.0,
};

const SITE_INTENSITY_BY_SURFACE: Record<SurfaceType, number> = {
  hero: 0.7,
  media: 0.62,
  frame: 0.72,
  base: 0.34,
  ambient: 0.26,
  glass: 0.2,
  text: 0.05,
  form: 0.0,
};

const clampToViewport = (value: number, maxExclusive: number) => {
  if (maxExclusive <= 1) return 0;
  return Math.min(Math.max(value, 0), maxExclusive - 1);
};

const toSurfaceType = (value: string | null | undefined): SurfaceType | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!VALID_SURFACES.has(normalized as SurfaceType)) {
    return null;
  }
  return normalized as SurfaceType;
};

const inferSurfaceFromElement = (element: Element | null): SurfaceType => {
  if (!element) return 'base';

  const explicitSurface = toSurfaceType(
    element.closest('[data-surface]')?.getAttribute('data-surface'),
  );
  if (explicitSurface) {
    return explicitSurface;
  }

  if (element.closest(FORM_SELECTOR)) {
    return 'form';
  }

  if (element.closest(TEXT_SELECTOR)) {
    return 'text';
  }

  if (element.closest(MEDIA_SELECTOR)) {
    return 'media';
  }

  return 'base';
};

const resolveSurfaceAtPoint = (clientX: number, clientY: number): SurfaceType => {
  const x = clampToViewport(clientX, window.innerWidth);
  const y = clampToViewport(clientY, window.innerHeight);
  const element = document.elementFromPoint(x, y);
  return inferSurfaceFromElement(element);
};

const emitSnapshot = () => {
  const payload: InteractionSnapshot = { ...snapshot };
  listeners.forEach((listener) => listener(payload));
};

const refreshSurface = () => {
  if (!snapshot.hasPointer) return;
  snapshot.surface = resolveSurfaceAtPoint(snapshot.clientX, snapshot.clientY);
  emitSnapshot();
};

const updatePointerState = (clientX: number, clientY: number, hasPointer: boolean) => {
  snapshot.clientX = clientX;
  snapshot.clientY = clientY;
  snapshot.hasPointer = hasPointer;
  snapshot.surface = hasPointer ? resolveSurfaceAtPoint(clientX, clientY) : 'base';
  emitSnapshot();
};

const handlePointerMove = (event: PointerEvent) => {
  updatePointerState(event.clientX, event.clientY, true);
};

const handleTouchMove = (event: TouchEvent) => {
  const touch = event.touches[0];
  if (!touch) return;
  updatePointerState(touch.clientX, touch.clientY, true);
};

const handlePointerLeave = () => {
  if (!snapshot.hasPointer) return;
  snapshot.hasPointer = false;
  snapshot.surface = 'base';
  emitSnapshot();
};

const startGlobalListeners = () => {
  if (isListening || typeof window === 'undefined') return;
  isListening = true;

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: true });
  window.addEventListener('resize', refreshSurface, { passive: true });
  window.addEventListener('scroll', refreshSurface, { passive: true, capture: true });
  window.addEventListener('blur', handlePointerLeave);
  document.addEventListener('mouseleave', handlePointerLeave);
};

const stopGlobalListeners = () => {
  if (!isListening || listeners.size > 0 || typeof window === 'undefined') return;
  isListening = false;

  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('resize', refreshSurface);
  window.removeEventListener('scroll', refreshSurface, true);
  window.removeEventListener('blur', handlePointerLeave);
  document.removeEventListener('mouseleave', handlePointerLeave);
};

export const subscribeInteractionSnapshot = (listener: SnapshotListener) => {
  listeners.add(listener);
  startGlobalListeners();
  listener({ ...snapshot });

  return () => {
    listeners.delete(listener);
    stopGlobalListeners();
  };
};

export const getSurfaceIntensity = (surface: SurfaceType, profile: MaterialProfile) => {
  return profile === 'media'
    ? MEDIA_INTENSITY_BY_SURFACE[surface]
    : SITE_INTENSITY_BY_SURFACE[surface];
};
