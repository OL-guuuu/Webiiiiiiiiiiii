import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import type { SplashCursorProps } from './SplashCursor';

export type SplashCursorTuning = Required<
  Pick<
    SplashCursorProps,
    | 'DENSITY_DISSIPATION'
    | 'VELOCITY_DISSIPATION'
    | 'PRESSURE'
    | 'CURL'
    | 'SPLAT_RADIUS'
    | 'SPLAT_FORCE'
    | 'COLOR_UPDATE_SPEED'
    | 'SHADING'
    | 'RAINBOW_MODE'
    | 'COLOR'
    | 'AUTO_CONTRAST'
  >
>;

interface SplashCursorCustomizerProps {
  value: SplashCursorTuning;
  onChange: (next: SplashCursorTuning) => void;
  onReset: () => void;
  isLightMode?: boolean;
}

interface NumberControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const NumberControl: React.FC<NumberControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <label className="flex flex-col gap-2" data-surface="form">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] tracking-[0.16em] uppercase opacity-80">{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-[8px] border border-black/15 bg-white/75 px-2 py-1 text-[11px] font-mono tracking-[0.06em] text-black focus:outline-none focus:ring-1 focus:ring-black/40"
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-black"
      />
    </label>
  );
};

const ToggleControl: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] uppercase" data-surface="form">
      <span className="opacity-80">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-black"
      />
    </label>
  );
};

export const SplashCursorCustomizer: React.FC<SplashCursorCustomizerProps> = ({
  value,
  onChange,
  onReset,
  isLightMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const update = <K extends keyof SplashCursorTuning>(key: K, nextValue: SplashCursorTuning[K]) => {
    onChange({
      ...value,
      [key]: nextValue,
    });
  };

  const shellClass = isLightMode
    ? 'bg-white/92 border-black/10 text-black shadow-[0_14px_35px_rgba(0,0,0,0.14)]'
    : 'bg-[rgba(18,18,20,0.92)] border-white/12 text-white shadow-[0_14px_35px_rgba(0,0,0,0.35)]';

  const iconButtonClass = isLightMode
    ? 'bg-white/95 border-black/10 text-black hover:bg-white'
    : 'bg-[rgba(18,18,20,0.9)] border-white/14 text-white hover:bg-[rgba(28,28,30,0.95)]';

  return (
    <>
      <button
        type="button"
        aria-label="Splash Cursor Controls"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed right-5 bottom-5 z-[360] pointer-events-auto flex h-11 w-11 items-center justify-center rounded-[10px] border backdrop-blur-xl transition-all duration-300 hover:scale-[1.05] ${iconButtonClass}`}
        data-surface="form"
      >
        {isOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
      </button>

      {isOpen && (
        <section
          className={`fixed right-5 bottom-20 z-[355] w-[min(92vw,380px)] pointer-events-auto rounded-[12px] border p-4 backdrop-blur-xl ${shellClass}`}
          onWheel={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          data-surface="form"
        >
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em]">Cursor Lab</h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">Live tuning panel</p>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-[8px] border border-current/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] opacity-85 transition-opacity hover:opacity-100"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </header>

          <div className="max-h-[68vh] space-y-4 overflow-y-auto pr-1 font-mono">
            <NumberControl
              label="Splat Radius"
              value={value.SPLAT_RADIUS}
              min={0.02}
              max={0.3}
              step={0.01}
              onChange={(next) => update('SPLAT_RADIUS', next)}
            />

            <NumberControl
              label="Splat Force"
              value={value.SPLAT_FORCE}
              min={300}
              max={7000}
              step={50}
              onChange={(next) => update('SPLAT_FORCE', next)}
            />

            <NumberControl
              label="Density Dissipation"
              value={value.DENSITY_DISSIPATION}
              min={0.5}
              max={8}
              step={0.1}
              onChange={(next) => update('DENSITY_DISSIPATION', next)}
            />

            <NumberControl
              label="Velocity Dissipation"
              value={value.VELOCITY_DISSIPATION}
              min={0.5}
              max={12}
              step={0.1}
              onChange={(next) => update('VELOCITY_DISSIPATION', next)}
            />

            <NumberControl
              label="Pressure"
              value={value.PRESSURE}
              min={0.01}
              max={0.6}
              step={0.01}
              onChange={(next) => update('PRESSURE', next)}
            />

            <NumberControl
              label="Curl"
              value={value.CURL}
              min={0}
              max={8}
              step={0.1}
              onChange={(next) => update('CURL', next)}
            />

            <NumberControl
              label="Color Speed"
              value={value.COLOR_UPDATE_SPEED}
              min={0}
              max={12}
              step={0.1}
              onChange={(next) => update('COLOR_UPDATE_SPEED', next)}
            />

            <label className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.16em]" data-surface="form">
              <span className="opacity-80">Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value.COLOR}
                  onChange={(e) => update('COLOR', e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-[8px] border border-current/20 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={value.COLOR}
                  onChange={(e) => update('COLOR', e.target.value)}
                  className="w-full rounded-[8px] border border-current/20 bg-transparent px-2 py-2 text-[11px] tracking-[0.1em] focus:outline-none focus:ring-1 focus:ring-current/35"
                />
              </div>
            </label>

            <ToggleControl
              label="Auto Contrast"
              checked={value.AUTO_CONTRAST}
              onChange={(next) => update('AUTO_CONTRAST', next)}
            />

            <ToggleControl
              label="Shading"
              checked={value.SHADING}
              onChange={(next) => update('SHADING', next)}
            />

            <ToggleControl
              label="Rainbow Mode"
              checked={value.RAINBOW_MODE}
              onChange={(next) => update('RAINBOW_MODE', next)}
            />
          </div>
        </section>
      )}
    </>
  );
};
