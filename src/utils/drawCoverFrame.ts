export interface FrameEngineConfig {
  zoomFactor?: number;
  objectFit?: 'cover' | 'contain';
}

export function drawCoverFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  config: FrameEngineConfig = {}
) {
  const { zoomFactor = 1, objectFit = 'cover' } = config;

  const canvasObj = ctx.canvas;
  const cw = canvasObj.width;
  const ch = canvasObj.height;
  const iw = image.width;
  const ih = image.height;

  let scale = 1;
  if (objectFit === 'contain') {
    scale = Math.min(cw / iw, ch / ih);
  } else {
    scale = Math.max(cw / iw, ch / ih);
  }
  scale *= zoomFactor;

  const scaledW = iw * scale;
  const scaledH = ih * scale;

  // Center horizontally and vertically
  const dx = (cw - scaledW) / 2;
  const dy = (ch - scaledH) / 2;

  // Clear context and draw image
  ctx.clearRect(0, 0, cw, ch);
  
  // Smoothing optimizations
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(image, dx, dy, scaledW, scaledH);
}
