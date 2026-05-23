
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Settings,
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import TrueNorthLogo from '@/components/TrueNorthLogo.jsx';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pipeline', path: '/pipeline', icon: KanbanSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Account', path: '/account', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Agent Brain', path: '/agent-brain', icon: Lock, adminOnly: true });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))] w-64 flex-shrink-0">
      <div className="p-5 flex items-center border-b border-white/10">
        <TrueNorthLogo variant="full" theme="dark" className="h-8 w-auto" />
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-white/50")} />
              {item.name}
              {item.adminOnly && (
                <span className="ml-auto text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-white/70">Admin</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-white/50" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[hsl(var(--sidebar-bg))] z-50 flex items-center justify-between px-4 border-b border-white/10">
        <TrueNorthLogo variant="full" theme="dark" className="h-7 w-auto" />
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-white hover:bg-white/10">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-64 bg-[hsl(var(--sidebar-bg))]"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
