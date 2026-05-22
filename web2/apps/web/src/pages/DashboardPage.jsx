
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Phone, FileText, CheckCircle, Activity, Circle, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MOCK_LEADS = [
  { id: '1',  name: 'James Okafor',   status: 'New Lead',      province: 'ON', monthly_bill: 280, assigned_to: 'Sarah' },
  { id: '2',  name: 'Maria Santos',   status: 'Contacted',     province: 'BC', monthly_bill: 310, assigned_to: 'Mike' },
  { id: '3',  name: 'David Chen',     status: 'Contacted',     province: 'AB', monthly_bill: 195, assigned_to: 'Sarah' },
  { id: '4',  name: 'Rachel Kim',     status: 'Proposal Sent', province: 'ON', monthly_bill: 420, assigned_to: 'Mike' },
  { id: '5',  name: 'Tom Bergman',    status: 'Won',           province: 'BC', monthly_bill: 350, assigned_to: 'Sarah' },
  { id: '6',  name: 'Aisha Patel',    status: 'New Lead',      province: 'QC', monthly_bill: 240, assigned_to: 'Carlos' },
  { id: '7',  name: 'Luis Fernandez', status: 'Won',           province: 'ON', monthly_bill: 380, assigned_to: 'Carlos' },
  { id: '8',  name: 'Jenny Larsen',   status: 'Proposal Sent', province: 'MB', monthly_bill: 210, assigned_to: 'Mike' },
  { id: '9',  name: 'Preet Johal',    status: 'Contacted',     province: 'BC', monthly_bill: 330, assigned_to: 'Carlos' },
  { id: '10', name: 'Tyler Moss',     status: 'New Lead',      province: 'AB', monthly_bill: 175, assigned_to: 'Sarah' },
];

const now = Date.now();
const MOCK_ACTIVITY = [
  { id: '1', action: 'Lead Qualified', description: 'AI agent qualified Rachel Kim — $420/mo bill',     created: new Date(now - 1000 * 60 * 18) },
  { id: '2', action: 'Follow-Up Sent', description: 'Automated follow-up sent to Maria Santos',         created: new Date(now - 1000 * 60 * 45) },
  { id: '3', action: 'Deal Won',       description: 'Tom Bergman moved to Won — system size 8.4 kW',    created: new Date(now - 1000 * 60 * 60 * 2) },
  { id: '4', action: 'New Lead',       description: 'Aisha Patel submitted quote request via web form', created: new Date(now - 1000 * 60 * 60 * 4) },
  { id: '5', action: 'Deal Won',       description: 'Luis Fernandez signed — financing approved',       created: new Date(now - 1000 * 60 * 60 * 6) },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ new: 0, contacted: 0, proposal: 0, won: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const counts = {
      new:       MOCK_LEADS.filter(l => l.status === 'New Lead').length,
      contacted: MOCK_LEADS.filter(l => l.status === 'Contacted').length,
      proposal:  MOCK_LEADS.filter(l => l.status === 'Proposal Sent').length,
      won:       MOCK_LEADS.filter(l => l.status === 'Won').length,
    };
    setStats(counts);
    setActivities(MOCK_ACTIVITY);
    setLoading(false);
  }, []);

  const funnelData = [
    { name: 'New Lead',  value: stats.new,      color: '#94a3b8' },
    { name: 'Contacted', value: stats.contacted, color: '#3b82f6' },
    { name: 'Proposal',  value: stats.proposal,  color: '#f59e0b' },
    { name: 'Won',       value: stats.won,        color: '#10b981' },
  ];

  const statCards = [
    { title: 'Leads This Week', value: stats.new + stats.contacted, icon: Users,       color: 'text-blue-500',   bg: 'bg-blue-500/10' },
    { title: 'Contacted',       value: stats.contacted,             icon: Phone,       color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Proposals Out',   value: stats.proposal,              icon: FileText,    color: 'text-primary',    bg: 'bg-primary/10' },
    { title: 'Closed Won',      value: stats.won,                   icon: CheckCircle, color: 'text-accent',     bg: 'bg-accent/10' },
  ];

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your solar pipeline and AI agents.</p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-7">
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

        <Card className="md:col-span-3 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== activities.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-border" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 ring-4 ring-card z-10">
                    <Circle className="w-2 h-2 fill-primary text-primary" />
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <span className="text-xs text-muted-foreground/70 block mt-1">
                      {format(activity.created, 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm bg-gradient-to-r from-card to-muted/30">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-6">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active AI Agents</span>
          <div className="flex flex-wrap gap-4">
            {['Solar Doc', 'Solar Support', 'Solar Sales'].map(agent => (
              <div key={agent} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-border shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
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
