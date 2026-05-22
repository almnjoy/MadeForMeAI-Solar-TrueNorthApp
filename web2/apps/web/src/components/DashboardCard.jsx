
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={`text-xs mt-2 font-medium ${trend.positive ? 'text-secondary' : 'text-destructive'}`}>
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
