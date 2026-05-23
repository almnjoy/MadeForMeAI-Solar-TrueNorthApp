
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ExternalLink, MessageCircle, Github, Mail, Smartphone } from 'lucide-react';

const RESOURCES = [
  {
    title: 'Discord Community',
    description: 'Connect with the team, get support, and interact with TrueNorth AI agents directly in Discord.',
    url: 'https://discord.gg/truenorth',
    icon: MessageCircle,
    accent: 'border-t-[#5865F2]',
    iconColor: 'text-[#5865F2]',
    badge: 'Community',
    active: true,
  },
  {
    title: 'Documentation',
    description: 'Full platform docs — agent setup, CRM integration, onboarding guides, and API reference.',
    url: 'https://docs-truenorth.madeformeai.com',
    icon: BookOpen,
    accent: 'border-t-primary',
    iconColor: 'text-primary',
    badge: 'Docs',
    active: true,
  },
  {
    title: 'GitHub',
    description: 'Source repos for the TrueNorth platform — frontend, K8s configs, and agent definitions.',
    url: 'https://github.com/almnjoy',
    icon: Github,
    accent: 'border-t-foreground',
    iconColor: 'text-foreground',
    badge: 'Code',
    active: true,
  },
  {
    title: 'Email Support',
    description: 'Reach the TrueNorth team directly for billing, account, or technical support inquiries.',
    url: 'mailto:support@truenorthsolar.ca',
    icon: Mail,
    accent: 'border-t-accent',
    iconColor: 'text-accent',
    badge: 'Support',
    active: true,
  },
  {
    title: 'WhatsApp',
    description: 'Mobile support channel — coming soon. Direct messaging with your account rep.',
    url: null,
    icon: Smartphone,
    accent: 'border-t-[#25D366]',
    iconColor: 'text-[#25D366]',
    badge: 'Coming Soon',
    active: false,
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Resources
        </h1>
        <p className="text-muted-foreground mt-1">Docs, community, and support links for your TrueNorth platform.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {RESOURCES.map(({ title, description, url, icon: Icon, accent, iconColor, badge, active }) => {
          const cardContent = (
            <Card className={`border-border shadow-md border-t-4 ${accent} ${active ? 'hover:shadow-lg transition-all duration-200 group-hover:-translate-y-0.5' : 'opacity-60'}`}>
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
                    {active && <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{description}</p>
                {url && (
                  <p className="text-xs text-muted-foreground/60 font-mono mt-3 truncate">{url}</p>
                )}
              </CardContent>
            </Card>
          );

          if (!active) {
            return (
              <div key={title} className="group block cursor-not-allowed">
                {cardContent}
              </div>
            );
          }

          return (
            <a
              key={title}
              href={url}
              target={url.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group block"
            >
              {cardContent}
            </a>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Hostinger Email: </span>
        Your team email accounts are managed through Hostinger. Log in at{' '}
        <a
          href="https://www.hostinger.com/cpanel-login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          hostinger.com/cpanel-login
        </a>{' '}
        to manage mailboxes, forwarding, and DNS.
      </div>
    </div>
  );
}
