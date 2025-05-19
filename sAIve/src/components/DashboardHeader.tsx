import { Button } from '@/components/ui/button';
import { 
  Bell,
  User,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import {ModeToggle} from '@/components/ModeToggle';

const DashboardHeader = () => {
  
  const handleAddTransaction = () => {
    toast("Feature coming soon", {
      description: "Add transaction functionality will be available soon."
    });
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between py-4 px-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial summary</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative hidden md:flex items-center">
          <ModeToggle/>
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
        
        <Button onClick={handleAddTransaction} className="hidden sm:flex">
          <Plus className="mr-1 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;