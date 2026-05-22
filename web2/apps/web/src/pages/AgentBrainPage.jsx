
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Database, FileCode2, TerminalSquare, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export default function AgentBrainPage() {
  const now = new Date();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-3">
          <BrainCircuit className="w-8 h-8" />
          Agent Brain Control
        </h1>
        <p className="text-muted-foreground">Admin access for AI core systems and memory banks.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel: OpenClaw Brain */}
        <Card className="border-border shadow-md border-t-4 border-t-primary">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                OpenClaw Brain
              </span>
              <div className="flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent">Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Core Sync</p>
              <p className="text-lg font-mono">{format(now, 'yyyy-MM-dd HH:mm:ss')}</p>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <FileCode2 className="w-4 h-4 mr-3 text-muted-foreground" />
                Workspace Files
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Database className="w-4 h-4 mr-3 text-muted-foreground" />
                Memory Viewer
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <TerminalSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Hermes Brain */}
        <Card className="border-border shadow-md border-t-4 border-t-accent">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-accent" />
              Hermes Routing Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {['Solar Doc', 'Solar Support', 'Solar Sales'].map(agent => (
                <div key={agent} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      <span className="font-semibold text-foreground">{agent} Node</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">Ping: 14ms | Last active: Just now</p>
                  </div>
                  <Button size="sm" variant="secondary" className="text-xs">
                    View Logs
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart Gateway
        </Button>
      </div>
    </div>
  );
}
