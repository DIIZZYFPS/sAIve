import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { MiniLoader } from '@/components/MiniLoader';
import { useSettings } from '@/context/SettingsContext';
import {
  ChevronLeft,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  PiggyBank,
  Calendar,
  Target,
  Bot
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, active, collapsed, onClick }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      asChild
      onClick={onClick}
      className={cn(
        'w-full h-12',
        collapsed ? 'justify-center px-0' : 'justify-start gap-2 px-3',
        active ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Link to={to}>
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
};

interface SidebarProps {
  aiChatOpen?: boolean;
  onAiChatToggle?: () => void;
}

const Sidebar = ({ aiChatOpen = false, onAiChatToggle }: SidebarProps) => {
  const location = useLocation();
  const { aiEnabled } = useSettings();

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === 'true';
  });

  // Remember the user's manual collapse preference
  const [manualCollapsed, setManualCollapsed] = useState(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === 'true';
  });

  // Auto-collapse when AI chat opens; restore when it closes
  useEffect(() => {
    if (aiChatOpen) {
      setCollapsed(true);
    } else {
      setCollapsed(manualCollapsed);
    }
  }, [aiChatOpen, manualCollapsed]);

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (!aiChatOpen) {
      setManualCollapsed(next);
      localStorage.setItem('sidebar-collapsed', String(next));
    }
  };

  return (
    <div
      className={cn(
        'h-screen bg-sidebar flex flex-col border-r border-r-sidebar-border transition-all duration-300 shrink-0',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      {/* Top brand + collapse toggle */}
      <div className="flex items-center justify-between p-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <MiniLoader size={32} />
            <h2 className="text-xl font-bold tracking-tight">
              s<span className="text-primary">AI</span>ve
            </h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('text-sidebar-foreground shrink-0', collapsed && 'mx-auto')}
          onClick={handleToggleCollapse}
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform', collapsed && 'rotate-180')}
          />
        </Button>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 p-2 flex-1">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70 mb-1 ml-3 mt-1">Overview</div>
        )}

        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} collapsed={collapsed} />
        <SidebarItem icon={CreditCard} label="Transactions" to="/transactions" active={location.pathname === '/transactions'} collapsed={collapsed} />
        <SidebarItem icon={PiggyBank} label="Flow" to="/flow" active={location.pathname === '/flow'} collapsed={collapsed} />
        <SidebarItem icon={BarChart3} label="Reports" to="/reports" active={location.pathname === '/reports'} collapsed={collapsed} />

        {/* AI Chat toggle button */}
        {aiEnabled && (
          <Button
            variant="ghost"
            onClick={onAiChatToggle}
            className={cn(
              'w-full h-12',
              collapsed ? 'justify-center px-0' : 'justify-start gap-2 px-3',
              aiChatOpen
                ? 'bg-sidebar-accent text-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <Bot size={20} />
            {!collapsed && <span>AI Assistant</span>}
          </Button>
        )}

        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70 mb-1 ml-3 mt-3">Planning</div>
        )}

        <SidebarItem icon={Calendar} label="Calendar" to="/calendar" active={location.pathname === '/calendar'} collapsed={collapsed} />
        <SidebarItem icon={Target} label="Budget" to="/budget" active={location.pathname === '/budget'} collapsed={collapsed} />

        <div className="mt-auto">
          <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;