
import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function LeadCard({ name, location, status, value, date }) {
  const statusColors = {
    Prospect: 'bg-blue-100 text-blue-700',
    Qualified: 'bg-purple-100 text-purple-700',
    Proposal: 'bg-amber-100 text-amber-700',
    Closed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-4 rounded-xl border border-border hover:shadow-md transition-all duration-200 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
        </div>
        <Badge className={statusColors[status] || 'bg-muted'}>
          {status}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          <span className="font-medium">{value}</span>
        </div>
        <span className="text-muted-foreground">{date}</span>
      </div>
    </div>
  );
}

export default LeadCard;
