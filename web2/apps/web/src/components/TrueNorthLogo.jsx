
import React from 'react';
import { Sun } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function TrueNorthLogo({ variant = 'full', theme = 'light', className }) {
  const isDark = theme === 'dark';
  
  const iconMarkup = (
    <div className={cn(
      "w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm",
      isDark && "shadow-none"
    )}>
      <Sun className="w-6 h-6 text-white" />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={cn("inline-flex group", className)}>
        {iconMarkup}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 group", className)}>
      {iconMarkup}
      <span className={cn(
        "text-xl font-bold tracking-tight",
        isDark ? "text-white" : "text-foreground"
      )}>
        TrueNorth Solar
      </span>
    </div>
  );
}
