
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, ExternalLink, MessageSquare, LayoutDashboard } from 'lucide-react';

const ADMIN_LINKS = [
  {
    title: 'OpenClaw',
    description: 'AI chat gateway — manage agents, sessions, and channels.',
    url: 'https://truenorth-openclaw.madeformeai.com',
    icon: MessageSquare,
    accent: 'border-t-primary',
    iconColor: 'text-primary',
    badge: 'Chat Gateway',
  },
  {
    title: 'Hermes Dashboard',
    description: 'Agent runtime — model config, gateway status, and logs.',
    url: 'https://hermes-truenorth.madeformeai.com',
    icon: LayoutDashboard,
    accent: 'border-t-accent',
    iconColor: 'text-accent',
    badge: 'Agent Runtime',
  },
];

export default function AgentBrainPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-primary" />
          Agent Brain
        </h1>
        <p className="text-muted-foreground mt-1">Admin access to AI infrastructure. Links open in a new tab.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {ADMIN_LINKS.map(({ title, description, url, icon: Icon, accent, iconColor, badge }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className={`border-border shadow-md border-t-4 ${accent} hover:shadow-lg transition-all duration-200 group-hover:-translate-y-0.5`}>
              <CardHeader className="bg-muted/30 border-b border-border pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                    {title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      {badge}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-xs text-muted-foreground/60 font-mono mt-3 truncate">{url}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Note: </span>
        Both tools are protected by Authentik SSO — you must be logged in with an admin account to access them.
      </div>
    </div>
  );
}
