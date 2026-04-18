import { ReactNode } from 'react';

interface ScenePlaceholderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function ScenePlaceholder({ title, subtitle, children }: ScenePlaceholderProps) {
  return (
    <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* This is where the FrameSequenceCanvas will go */}
      <div className="absolute inset-0 z-0 flex items-center justify-center border border-white/10 m-8 rounded-[8px]">
        {children}
      </div>
      
      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-white text-xl md:text-2xl font-light tracking-wide mb-3">
          {title}
        </h2>
        <p className="text-white/60 text-sm tracking-wider uppercase">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
