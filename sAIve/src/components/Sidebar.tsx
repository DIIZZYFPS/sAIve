import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import AiChat from '@/components/AiChat';
import { useSettings } from '@/context/SettingsContext';
import {
  ChevronLeft,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  PiggyBank,
  Calendar,
  Users,
  Bot
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, to, active, onClick }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      asChild
      onClick={onClick}
      className={cn(
        'w-full justify-start gap-2 px-3 h-12',
        active ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Link to={to}>
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    </Button>

  );
};

const Sidebar = () => {
  const location = useLocation();
  const { aiEnabled } = useSettings();
  const [collapsed, setCollapsed] = useState(() => {
    // Get initial state from localStorage or default to false
    const stored = localStorage.getItem('sidebar-collapsed');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div
      className={cn(
        'h-screen bg-sidebar flex flex-col border-r border-r-sidebar-border transition-all duration-300',
        collapsed ? 'w-[80px]' : 'w-[240px]'
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h2 className="text-xl font-bold ">
            S<span className="text-primary">AI</span>VE
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-sidebar-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            size={20}
            className={cn('transition-transform', collapsed && 'rotate-180')}
          />
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1">
        {!collapsed ? (
          <>
            <div className="text-xs text-sidebar-foreground/70 mb-1 ml-3 mt-2">Overview</div>
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              to='/'
              active={location.pathname === '/'}
            />
            <SidebarItem
              icon={CreditCard}
              label="Transactions"
              to='/transactions'
              active={location.pathname === '/transactions'}
            />
            <SidebarItem
              icon={PiggyBank}
              label="Flow"
              to='/flow'
              active={location.pathname === '/flow'}
            />
            <SidebarItem
              icon={BarChart3}
              label="Reports"
              to='/reports'
              active={location.pathname === '/reports'}
            />
            {aiEnabled && (
              <AiChat trigger={
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 px-3 h-12',
                    'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Bot size={20} />
                  <span>AI Assistant</span>
                </Button>
              } />
            )}

            <div className="text-xs text-sidebar-foreground/70 mb-1 ml-3 mt-4">Planning</div>
            <SidebarItem
              icon={Calendar}
              label="Calendar"
              to='/calendar'
              active={location.pathname === '/calendar'}
            />
            <SidebarItem
              icon={Users}
              label="Shared"
              to='/shared'
              active={location.pathname === '/shared'}
            />

            <div className="mt-auto">
              <SidebarItem
                icon={Settings}
                label="Settings"
                to='/settings'
                active={location.pathname === '/settings'}
              />
            </div>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/"><LayoutDashboard size={20} /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/transactions' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/transactions"><CreditCard size={20} /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/flow' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/flow"><PiggyBank size={20} /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/reports' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/reports"><BarChart3 size={20} /></Link>
            </Button>
            {aiEnabled && (
              <AiChat trigger={
                <Button variant="ghost" size="icon" className="w-full justify-center h-12 text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <Bot size={20} />
                </Button>
              } />
            )}
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/calendar' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/calendar"><Calendar size={20} /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/shared' ? 'bg-sidebar-accent text-primary' : '')}>
              <Link to="/shared"><Users size={20} /></Link>
            </Button>

            <div className="mt-auto">
              <Button asChild variant="ghost" size="icon" className={cn('w-full justify-center h-12', location.pathname === '/settings' ? 'bg-sidebar-accent text-primary' : '')}>
                <Link to="/settings"><Settings size={20} /></Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;