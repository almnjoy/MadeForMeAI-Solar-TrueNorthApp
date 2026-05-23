import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Phone, FileText, CheckCircle, Activity, Circle, Zap, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { getOpportunities, getNotes, microsToDollars, fullName, isConfigured } from '@/lib/twentyClient.js';

// ── Stage groupings ───────────────────────────────────────────────────────────
const NEW_STAGES      = ['NEW'];
const CONTACT_STAGES  = ['SCREENING'];
const PROPOSAL_STAGES = ['MEETING', 'PROPOSAL'];
const WON_STAGES      = ['CUSTOMER'];

export default function DashboardPage() {
  const [opps, setOpps]           = useState([]);
  const [notes, setNotes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isConfigured()) {
        setUsingMock(true);
        setOpps(MOCK_OPPS);
        setNotes(MOCK_NOTES);
        setLoading(false);
        return;
      }
      try {
        const [oppsData, notesData] = await Promise.all([
          getOpportunities(),
          getNotes(10),
        ]);
        setOpps(oppsData);
        setNotes(notesData);
      } catch (err) {
        console.error('Twenty API error:', err);
        setError(err.message);
        setOpps(MOCK_OPPS);
        setNotes(MOCK_NOTES);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = {
    new:      opps.filter(o => NEW_STAGES.includes(o.stage)).length,
    contacted:opps.filter(o => CONTACT_STAGES.includes(o.stage)).length,
    proposal: opps.filter(o => PROPOSAL_STAGES.includes(o.stage)).length,
    won:      opps.filter(o => WON_STAGES.includes(o.stage)).length,
  };

  const totalRevenue = opps
    .filter(o => WON_STAGES.includes(o.stage))
    .reduce((sum, o) => sum + microsToDollars(o.amount?.amountMicros), 0);

  const funnelData = [
    { name: 'New Lead',  value: stats.new,       color: '#94a3b8' },
    { name: 'Contacted', value: stats.contacted,  color: '#3b82f6' },
    { name: 'Proposal',  value: stats.proposal,   color: '#f59e0b' },
    { name: 'Won',       value: stats.won,         color: '#10b981' },
  ];

  const statCards = [
    { title: 'Active Leads',   value: stats.new + stats.contacted, icon: Users,       color: 'text-blue-500',   bg: 'bg-blue-500/10' },
    { title: 'Contacted',      value: stats.contacted,             icon: Phone,       color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Proposals Out',  value: stats.proposal,              icon: FileText,    color: 'text-primary',    bg: 'bg-primary/10' },
    { title: 'Closed Won',     value: stats.won,                   icon: CheckCircle, color: 'text-emerald-500',bg: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your solar pipeline and AI agents.</p>
        </div>
        {usingMock && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error ? 'Twenty API error — showing sample data' : 'Set VITE_TWENTY_API_KEY to load live data'}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                </div>
                <div className={"p-3 rounded-xl " + card.bg}>
                  <card.icon className={"w-6 h-6 " + card.color} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Won revenue banner */}
      {totalRevenue > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Total won pipeline value: ${totalRevenue.toLocaleString()}
            </span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-7">
        {/* Funnel chart */}
        <Card className="md:col-span-4 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <RechartsTooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {funnelData.map((entry, index) => (
                      <Cell key={"cell-" + index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity feed — from Twenty notes */}
        <Card className="md:col-span-3 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notes.slice(0, 5).map((note, i) => (
                <div key={note.id} className="flex gap-4 relative">
                  {i !== Math.min(notes.length, 5) - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-border" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 ring-4 ring-card z-10">
                    <Circle className="w-2 h-2 fill-primary text-primary" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm font-medium text-foreground">{note.title || 'Note'}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.body ? note.body.replace(/<[^>]*>/g, '').slice(0, 80) : ''}
                      {note.author ? ` — ${fullName(note.author.name)}` : ''}
                    </p>
                    <span className="text-xs text-muted-foreground/70 block mt-1">
                      {format(new Date(note.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents status */}
      <Card className="border-border shadow-sm bg-gradient-to-r from-card to-muted/30">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-6">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active AI Agents</span>
          <div className="flex flex-wrap gap-4">
            {['Solar Doc', 'Solar Support', 'Solar Sales'].map(agent => (
              <div key={agent} className="flex items-center gap-2 bg-white dark:bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium">{agent}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Mock data (used when API key not set) ─────────────────────────────────────
const MOCK_OPPS = [
  { id: '1', name: 'James Okafor',   stage: 'NEW',       amount: { amountMicros: 12000_000000 }, createdAt: new Date().toISOString() },
  { id: '2', name: 'Maria Santos',   stage: 'SCREENING', amount: { amountMicros: 15000_000000 }, createdAt: new Date().toISOString() },
  { id: '3', name: 'David Chen',     stage: 'SCREENING', amount: { amountMicros: 9000_000000  }, createdAt: new Date().toISOString() },
  { id: '4', name: 'Rachel Kim',     stage: 'PROPOSAL',  amount: { amountMicros: 18000_000000 }, createdAt: new Date().toISOString() },
  { id: '5', name: 'Tom Bergman',    stage: 'CUSTOMER',  amount: { amountMicros: 22000_000000 }, createdAt: new Date().toISOString() },
  { id: '6', name: 'Aisha Patel',    stage: 'NEW',       amount: { amountMicros: 11000_000000 }, createdAt: new Date().toISOString() },
  { id: '7', name: 'Luis Fernandez', stage: 'CUSTOMER',  amount: { amountMicros: 19000_000000 }, createdAt: new Date().toISOString() },
];

const now = Date.now();
const MOCK_NOTES = [
  { id: '1', title: 'Lead Qualified',  body: 'AI agent qualified Rachel Kim — $420/mo bill',     createdAt: new Date(now - 1000*60*18).toISOString(),    author: { name: { firstName: 'Solar', lastName: 'AI' } } },
  { id: '2', title: 'Follow-Up Sent', body: 'Automated follow-up sent to Maria Santos',           createdAt: new Date(now - 1000*60*45).toISOString(),    author: { name: { firstName: 'Solar', lastName: 'AI' } } },
  { id: '3', title: 'Deal Won',       body: 'Tom Bergman moved to Won — system size 8.4 kW',     createdAt: new Date(now - 1000*60*60*2).toISOString(),  author: { name: { firstName: 'Sarah', lastName: 'M.' } } },
  { id: '4', title: 'New Lead',       body: 'Aisha Patel submitted quote request via web form',  createdAt: new Date(now - 1000*60*60*4).toISOString(),  author: { name: { firstName: 'Solar', lastName: 'AI' } } },
  { id: '5', title: 'Deal Won',       body: 'Luis Fernandez signed — financing approved',        createdAt: new Date(now - 1000*60*60*6).toISOString(),  author: { name: { firstName: 'Carlos', lastName: 'D.' } } },
];
