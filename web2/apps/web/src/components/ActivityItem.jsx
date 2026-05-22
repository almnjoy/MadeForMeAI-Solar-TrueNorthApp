
import React from 'react';
import { Clock } from 'lucide-react';

function ActivityItem({ icon: Icon, title, description, time, iconColor }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
      <div className={`w-10 h-10 rounded-xl ${iconColor || 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor ? 'text-white' : 'text-primary'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;
