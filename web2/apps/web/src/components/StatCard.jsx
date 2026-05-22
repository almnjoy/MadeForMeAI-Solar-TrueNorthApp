
import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ number, label, icon: Icon, color = 'text-primary', bg = 'bg-primary/10', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
    >
      {Icon && (
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      )}
      <div className="text-4xl font-extrabold text-foreground mb-1 tabular-nums tracking-tight">
        {number}
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}
