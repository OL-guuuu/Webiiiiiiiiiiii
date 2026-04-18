import { ReactNode } from 'react';

interface SectionShellProps {
  children: ReactNode;
  height?: string; // e.g., '300vh'
  className?: string;
  id?: string;
}

export default function SectionShell({ 
  children, 
  height = '100vh', 
  className = '',
  id
}: SectionShellProps) {
  return (
    <section 
      id={id}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      {children}
    </section>
  );
}
