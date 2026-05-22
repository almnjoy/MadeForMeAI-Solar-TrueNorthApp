
import React from 'react';
import { cn } from '@/lib/utils.js';
import { Star } from 'lucide-react';

export default function ReviewCard({ quote, author, location, className }) {
  return (
    <div className={cn("p-6 rounded-2xl bg-card border border-border flex flex-col h-full hover:shadow-md transition-shadow", className)}>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>
      <blockquote className="flex-1 mb-6">
        <p className="text-foreground leading-relaxed text-base md:text-lg font-medium italic">
          "{quote}"
        </p>
      </blockquote>
      <div className="mt-auto border-t border-border pt-4">
        <div className="font-semibold text-foreground">{author}</div>
        {location && (
          <div className="text-sm text-muted-foreground mt-0.5">{location}</div>
        )}
      </div>
    </div>
  );
}
