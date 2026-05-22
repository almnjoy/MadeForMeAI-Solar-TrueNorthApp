
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function PipelineStage({ stage, count, value }) {
  const stageColors = {
    Prospect: 'bg-blue-100 text-blue-700 border-blue-200',
    Qualified: 'bg-purple-100 text-purple-700 border-purple-200',
    Proposal: 'bg-amber-100 text-amber-700 border-amber-200',
    Closed: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <Card className={`border-2 ${stageColors[stage] || 'bg-muted'} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{stage}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{count}</div>
        <p className="text-xs opacity-80">{value}</p>
      </CardContent>
    </Card>
  );
}

export default PipelineStage;
