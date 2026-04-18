interface FadeOverlayPlaceholderProps {
  opacity?: number;
}

export default function FadeOverlayPlaceholder({ opacity = 0 }: FadeOverlayPlaceholderProps) {
  return (
    <div 
      className="absolute inset-0 bg-black pointer-events-none z-20"
      style={{ opacity }}
    />
  );
}
