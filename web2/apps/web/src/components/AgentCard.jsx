
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AgentCard({ emoji, name, description, discordLink, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="h-full border-border hover:shadow-lg transition-shadow duration-300 bg-card overflow-hidden flex flex-col">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="text-5xl mb-4 select-none">
            {emoji}
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground tracking-tight">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
            {description}
          </p>
          
          {discordLink && (
            <a 
              href={discordLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-auto"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on Discord
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
