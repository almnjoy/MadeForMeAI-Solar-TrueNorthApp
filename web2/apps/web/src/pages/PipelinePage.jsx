import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, GripVertical, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getOpportunities, updateOpportunityStage,
  microsToDollars, fullName, isConfigured,
  STAGE_MAP, STAGE_REVERSE,
} from '@/lib/twentyClient.js';

const COLUMNS = ['New Lead', 'Contacted', 'Site Survey Booked', 'Proposal Sent', 'Won', 'Lost'];

const STATUS_COLORS = {
  'New Lead':           'bg-slate-100 text-slate-700 border-slate-200',
  'Contacted':          'bg-blue-100 text-blue-700 border-blue-200',
  'Site Survey Booked': 'bg-purple-100 text-purple-700 border-purple-200',
  'Proposal Sent':      'bg-orange-100 text-orange-700 border-orange-200',
  'Won':                'bg-green-100 text-green-700 border-green-200',
  'Lost':               'bg-red-100 text-red-700 border-red-200',
};

// Map Twenty opportunity to our card shape
function oppToCard(opp) {
  const contact = opp.pointOfContact;
  const amount  = microsToDollars(opp.amount?.amountMicros);
  return {
    id:          opp.id,
    name:        opp.name || (contact ? fullName(contact.name) : 'Untitled'),
    status:      STAGE_MAP[opp.stage] || 'New Lead',
    company:     opp.company?.name || '',
    amount,
    email:       contact?.emails?.primaryEmail || '',
    updatedAt:   opp.updatedAt,
  };
}

export default function PipelinePage() {
  const [leads, setLeads]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null); // id of card being saved
  const [usingMock, setUsingMock] = useState(false);
  const [error, setError]         = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!isConfigured()) {
      setUsingMock(true);
      setLeads(MOCK_LEADS);
      setLoading(false);
      return;
    }
    try {
      const opps = await getOpportunities();
      setLeads(opps.map(oppToCard));
    } catch (err) {
      setError(err.message);
      setUsingMock(true);
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedLead(null);
  };

  const handleDrop = async (e, columnStatus) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.status === columnStatus) return;

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, status: columnStatus } : l));

    // Persist to Twenty if configured
    if (isConfigured() && !usingMock) {
      const twentyStage = STAGE_REVERSE[columnStatus];
      if (twentyStage) {
        setSaving(draggedLead.id);
        try {
          await updateOpportunityStage(draggedLead.id, twentyStage);
        } catch (err) {
          console.error('Failed to update stage:', err);
          // Revert on failure
          setLeads(prev => prev.map(l => l.id === draggedLead.id ? { ...l, status: draggedLead.status } : l));
        } finally {
          setSaving(null);
        }
      }
    }
  };

  const getLeadsByStatus = (status) => leads.filter(l => l.status === status);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Drag and drop to move deals between stages.</p>
        </div>
        <div className="flex items-center gap-3">
          {usingMock && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" />
              {error ? 'API error — sample data' : 'Sample data — configure API key'}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Refresh
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => window.open(`${import.meta.env.VITE_TWENTY_API_URL}/objects/opportunities/new`, '_blank')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x min-h-0">
        {COLUMNS.map((column) => (
          <div
            key={column}
            className="flex-shrink-0 w-72 bg-muted/50 rounded-xl p-3 flex flex-col snap-start border border-border"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onDrop={(e) => handleDrop(e, column)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">{column}</h3>
              <span className="bg-white dark:bg-card text-muted-foreground text-xs px-2 py-0.5 rounded-full shadow-sm border border-border">
                {getLeadsByStatus(column).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-hide min-h-[120px]">
              {getLeadsByStatus(column).map(lead => (
                <motion.div
                  key={lead.id}
                  layout
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  className={"bg-card p-3.5 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors group relative " + (saving === lead.id ? 'opacity-60 pointer-events-none' : 'border-border')}
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                 