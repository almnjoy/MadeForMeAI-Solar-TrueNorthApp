
import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import TrueNorthLogo from '@/components/TrueNorthLogo.jsx';
import { Zap, BarChart2, Users, Bot, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const features = [
    { icon: BarChart2, label: 'Live Pipeline Dashboard' },
    { icon: Bot, label: 'AI-Powered Lead Agents' },
    { icon: Users, label: 'Team Performance Tracking' },
    { icon: Zap, label: 'Automated Follow-Ups' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left — sign in panel */}
      <div className="flex flex-col justify-center w-full max-w-md px-8 py-12 bg-background">
        <div className="mb-10">
          <TrueNorthLogo variant="full" theme="light" className="h-9 w-auto mb-8" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to your TrueNorth dashboard</p>
        </div>

        <Button
          onClick={login}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          You'll be redirected to your organization's sign-in page.
        </p>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-[#111827] relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <Zap className="w-3 h-3" />
            AI-Powered Platform
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Your solar business,<br />running on autopilot.
          </h2>

          <p className="text-white/50 text-sm leading-relaxed mb-10">
            TrueNorth Solar's AI platform handles lead follow-up, qualification, and pipeline management — so your team closes more deals with less manual work.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-white/70 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs">
              Powered by MadeForMeAI · Enterprise AI Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
