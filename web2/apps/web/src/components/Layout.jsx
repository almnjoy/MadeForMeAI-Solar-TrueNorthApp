
import React from 'react';
import Sidebar from '@/components/Sidebar.jsx';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground md:flex-row flex-col">
      <Sidebar />
      <main className="flex-1 md:pt-0 pt-16 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
