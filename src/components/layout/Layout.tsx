import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={sidebarCollapsed} />
      <div 
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        {/* Ajouter un padding-top pour ne pas que le contenu passe sous la navbar fixe */}
        <main className="flex-1 overflow-y-auto bg-background pt-16">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
