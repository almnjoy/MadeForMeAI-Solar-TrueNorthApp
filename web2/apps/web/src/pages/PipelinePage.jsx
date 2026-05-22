
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const COLUMNS = ['New Lead', 'Contacted', 'Site Survey Booked', 'Proposal Sent', 'Won', 'Lost'];

const STATUS_COLORS = {
  'New Lead':           'bg-slate-100 text-slate-700 border-slate-200',
  'Contacted':          'bg-blue-100 text-blue-700 border-blue-200',
  'Site Survey Booked': 'bg-purple-100 text-purple-700 border-purple-200',
  'Proposal Sent':      'bg-orange-100 text-orange-700 border-orange-200',
  'Won':                'bg-green-100 text-green-700 border-green-200',
  'Lost':               'bg-red-100 text-red-700 border-red-200',
};

const INITIAL_LEADS = [
  { id: '1',  name: 'James Okafor',   status: 'New Lead',           province: 'ON', monthly_bill: 280, assigned_to: 'Sarah' },
  { id: '2',  name: 'Maria Santos',   status: 'Contacted',          province: 'BC', monthly_bill: 310, assigned_to: 'Mike' },
  { id: '3',  name: 'David Chen',     status: 'Contacted',          province: 'AB', monthly_bill: 195, assigned_to: 'Sarah' },
  { id: '4',  name: 'Rachel Kim',     status: 'Proposal Sent',      province: 'ON', monthly_bill: 420, assigned_to: 'Mike' },
  { id: '5',  name: 'Tom Bergman',    status: 'Won',                province: 'BC', monthly_bill: 350, assigned_to: 'Sarah' },
  { id: '6',  name: 'Aisha Patel',    status: 'New Lead',           province: 'QC', monthly_bill: 240, assigned_to: 'Carlos' },
  { id: '7',  name: 'Luis Fernandez', status: 'Won',                province: 'ON', monthly_bill: 380, assigned_to: 'Carlos' },
  { id: '8',  name: 'Jenny Larsen',   status: 'Proposal Sent',      province: 'MB', monthly_bill: 210, assigned_to: 'Mike' },
  { id: '9',  name: 'Preet Johal',    status: 'Site Survey Booked', province: 'BC', monthly_bill: 330, assigned_to: 'Carlos' },
  { id: '10', name: 'Tyler Moss',     status: 'New Lead',           province: 'AB', monthly_bill: 175, assigned_to: 'Sarah' },
  { id: '11', name: 'Sandra Ho',      status: 'Lost',               province: 'ON', monthly_bill: 220, assigned_to: 'Mike' },
  { id: '12', name: 'Raj Mehta',      status: 'Site Survey Booked', province: 'AB', monthly_bill: 295, assigned_to: 'Sarah' },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [loading, setLoading] = useState(false);
  const [draggedLead, setDraggedLead] = useState(null);

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedLead(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.status === columnStatus) return;
    setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, status: columnStatus } : l));
  };

  const getLeadsByStatus = (status) => leads.filter(l => l.status === status);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Drag and drop leads to update their status.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map((column) => (
          <div
            key={column}
            className="flex-shrink-0 w-80 bg-muted/50 rounded-xl p-4 flex flex-col snap-start border border-border"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-foreground">{column}</h3>
              <span className="bg-white text-muted-foreground text-xs px-2 py-1 rounded-full shadow-sm">
                {getLeadsByStatus(column).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
              {getLeadsByStatus(column).map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  className="bg-card p-4 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors group relative"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className={"inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border mb-2 " + (STATUS_COLORS[lead.status] || '')}>
                    {lead.province}
                  </div>

                  <h4 className="font-semibold text-foreground mb-1">{lead.name}</h4>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                    <span className="font-medium text-foreground">${lead.monthly_bill}/mo</span>
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[8px] font-bold">
                        {lead.assigned_to.charAt(0)}
                      </div>
                      {lead.assigned_to}
                    </span>
                  </div>
                </div>
              ))}

              {draggedLead && draggedLead.status !== column && (
                <div className="h-24 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 transition-colors" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
