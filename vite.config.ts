import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

const FRAME_FILE_PATTERN = /^ezgif-frame-(\d{3})\.jpg$/i;

function getFrameManifest() {
  try {
    const framesDir = path.resolve(__dirname, 'public/frames');
    if (!fs.existsSync(framesDir)) return {} as Record<string, string[]>;
    
    const folders = fs.readdirSync(framesDir).filter(f => fs.statSync(path.join(framesDir, f)).isDirectory());
    const manifest: Record<string, string[]> = {};
    
    for (const folder of folders) {
      const files = fs
        .readdirSync(path.join(framesDir, folder))
        .filter(f => FRAME_FILE_PATTERN.test(f))
        .sort((a, b) => {
          const aMatch = a.match(FRAME_FILE_PATTERN);
          const bMatch = b.match(FRAME_FILE_PATTERN);
          return Number(aMatch?.[1] ?? 0) - Number(bMatch?.[1] ?? 0);
        });

      manifest[folder] = files;
    }

    const counts = Object.fromEntries(Object.entries(manifest).map(([scene, files]) => [scene, files.length]));
    console.log(`[Vite] Detected frame counts (refreshed):`, counts);
    return manifest;
  } catch (error) {
    console.error("Failed to read frame manifest", error);
    return {} as Record<string, string[]>;
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const frameManifest = getFrameManifest();
  const frameCounts = Object.fromEntries(
    Object.entries(frameManifest).map(([scene, files]) => [scene, files.length])
  );

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__FRAME_COUNTS__': JSON.stringify(frameCounts),
      '__FRAME_MANIFEST__': JSON.stringify(frameManifest),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
