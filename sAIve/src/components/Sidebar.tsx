import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  PiggyBank,
  Calendar,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'w-full justify-start gap-2 px-3 h-12',
        active ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Button>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

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
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={CreditCard} label="Transactions" />
            <SidebarItem icon={PiggyBank} label="Budgets" />
            <SidebarItem icon={BarChart3} label="Reports" />

            <div className="text-xs text-sidebar-foreground/70 mb-1 ml-3 mt-4">Planning</div>
            <SidebarItem icon={Calendar} label="Calendar" />
            <SidebarItem icon={Users} label="Shared" />
            
            <div className="mt-auto">
              <SidebarItem icon={Settings} label="Settings" />
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12', 'bg-sidebar-accent text-primary')}>
              <LayoutDashboard size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
              <CreditCard size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
              <PiggyBank size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
              <BarChart3 size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
              <Calendar size={20} />
            </Button>
            <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
              <Users size={20} />
            </Button>
            
            <div className="mt-auto">
              <Button variant="ghost" size="icon" className={cn('w-full justify-center h-12')}>
                <Settings size={20} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;