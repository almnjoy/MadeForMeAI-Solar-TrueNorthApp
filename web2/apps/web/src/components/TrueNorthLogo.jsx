
import React from 'react';
import { cn } from '@/lib/utils.js';

export default function TrueNorthLogo({ theme = 'light', className }) {
  return (
    <img
      src="/truenorth-logo.svg"
      alt="TrueNorth Solar"
      className={cn("w-auto", className)}
      style={theme === 'dark' ? { filter: 'brightness(0) invert(1)' } : undefined}
    />
  );
}
