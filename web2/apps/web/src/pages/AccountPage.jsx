
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { User, Mail, Shield, MessageSquare, Bell } from 'lucide-react';

export default function AccountPage() {
  const { currentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifyEmail: true,
    notifySms: false,
    notifyApp: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call for saving preferences
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Preferences updated", {
        description: "Your notification settings have been saved."
      });
    }, 800);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4 ring-4 ring-background border border-primary/20">
              {getInitials(currentUser?.name)}
            </div>
            <h2 className="text-xl font-bold mb-1">{currentUser?.name || 'User'}</h2>
            <div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm border border-border">
              {currentUser?.role || 'User'}
            </div>
            
            <div className="w-full space-y-3 mt-4 text-sm text-left">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-foreground/70" />
                <span className="truncate">{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="w-4 h-4 text-foreground/70" />
                <span>ID: {currentUser?.id.substring(0,8)}...</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {/* Notifications */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Choose how you want to be alerted about new leads and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and urgent alerts.</p>
                </div>
                <Switch 
                  checked={settings.notifyEmail} 
                  onCheckedChange={(v) => setSettings({...settings, notifyEmail: v})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get text messages for new hot leads.</p>
                </div>
                <Switch 
                  checked={settings.notifySms} 
                  onCheckedChange={(v) => setSettings({...settings, notifySms: v})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show badges and toasts while using the app.</p>
                </div>
                <Switch 
                  checked={settings.notifyApp} 
                  onCheckedChange={(v) => setSettings({...settings, notifyApp: v})} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Connected Channels */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Connected Channels
              </CardTitle>
              <CardDescription>Manage integrations with communication platforms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                    <span className="font-bold text-[#5865F2]">D</span>
                  </div>
                  <div>
                    <p className="font-medium">Discord</p>
                    <p className="text-xs text-muted-foreground">Community & Agent Chat</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <span className="font-bold text-[#25D366]">W</span>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">Client Communications</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-wider">
                  Connected
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
