import React, { useState } from 'react';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onRefresh }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Listen for focus events to refresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      if (onRefresh) {
        onRefresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [onRefresh]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar setSidebarOpen={setSidebarOpen} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};