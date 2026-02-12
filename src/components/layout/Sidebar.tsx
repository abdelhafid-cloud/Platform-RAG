import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Bot,
  BookOpen,
  MessageSquare,
  Bell,
  Receipt,
  Ticket,
  Settings,
  LogOut,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [conversationCount, setConversationCount] = useState(0);
  const [notificationCount] = useState(12);
  const [ticketCount] = useState(3);

  useEffect(() => {
    fetch('/data/conversations/data.json')
      .then(res => res.json())
      .then(data => {
        setConversationCount(data.conversations?.length || 0);
      })
      .catch(error => {
        console.error('Error loading conversations count:', error);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen border-r bg-white transition-all duration-300 ease-in-out z-40 flex flex-col",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 border-b shrink-0 transition-all duration-300",
        collapsed ? "px-4 justify-center" : "px-6 gap-3"
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 shrink-0">
          <span className="text-xs font-bold text-white">DG</span>
        </div>
        <div className={cn(
          "flex flex-col min-w-0 transition-all duration-300 overflow-hidden",
          collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}>
          <span className="text-sm font-semibold leading-none text-gray-900 truncate whitespace-nowrap">DigitGrow Admin</span>
          <span className="text-[10px] text-gray-500 leading-none mt-1 truncate whitespace-nowrap">Yae + DigitGrow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto py-6 space-y-1",
        collapsed ? "px-3" : "px-4"
      )}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/filiale"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Filiale" : undefined}
        >
          <Building2 className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Filiale</span>
        </NavLink>

        <NavLink
          to="/utilisateurs"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Utilisateur" : undefined}
        >
          <Users className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Utilisateur</span>
        </NavLink>

        <a
          href="/acceder-assistant"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center rounded-lg text-[13px] font-medium transition-all text-gray-700 hover:bg-green-50 hover:text-green-700",
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          )}
          title={collapsed ? "Accéder à l'assistant" : undefined}
        >
          <Zap className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Accéder à l'assistant</span>
          {!collapsed && <ExternalLink className="h-[14px] w-[14px] opacity-50" strokeWidth={2} />}
        </a>

        <NavLink
          to="/assistant"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Assistant" : undefined}
        >
          <Bot className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Assistant</span>
        </NavLink>

        <NavLink
          to="/base-documentaire"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Base documentaire" : undefined}
        >
          <BookOpen className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Base documentaire</span>
        </NavLink>

        <NavLink
          to="/conversations"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all relative',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? `Conversation (${conversationCount})` : undefined}
        >
          <MessageSquare className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Conversation</span>
          {conversationCount > 0 && !collapsed && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[11px] font-semibold">
              {conversationCount}
            </Badge>
          )}
          {conversationCount > 0 && collapsed && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
              {conversationCount}
            </div>
          )}
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all relative',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? `Notification (${notificationCount})` : undefined}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Notification</span>
          {notificationCount > 0 && !collapsed && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[11px] font-semibold">
              {notificationCount}
            </Badge>
          )}
          {notificationCount > 0 && collapsed && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
              {notificationCount}
            </div>
          )}
        </NavLink>

        <NavLink
          to="/facturation"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Facturation" : undefined}
        >
          <Receipt className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Facturation</span>
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all relative',
              collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? `Ticket (${ticketCount})` : undefined}
        >
          <Ticket className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Ticket</span>
          {ticketCount > 0 && !collapsed && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[11px] font-semibold">
              {ticketCount}
            </Badge>
          )}
          {ticketCount > 0 && collapsed && (
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
              {ticketCount}
            </div>
          )}
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="border-t shrink-0">
        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg text-[13px] font-medium transition-all my-4',
              collapsed ? 'justify-center p-3 mx-3' : 'gap-3 px-3 py-2.5 mx-4',
              isActive 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
          title={collapsed ? "Paramètres" : undefined}
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>Paramètres</span>
        </NavLink>

        {/* User Profile */}
        {!collapsed ? (
          <div className="pb-4 px-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 shrink-0">
                <span className="text-[11px] font-bold text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">Admin User</p>
                <p className="text-[11px] text-gray-500 truncate leading-tight">admin@digitgrow.com</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 shrink-0 hover:bg-red-50 hover:text-red-600"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="pb-4 px-3">
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-10 w-10 hover:bg-red-50 hover:text-red-600 rounded-lg"
                title="Déconnexion - Admin User"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
