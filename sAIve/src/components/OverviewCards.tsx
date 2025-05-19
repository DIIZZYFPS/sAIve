import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconColor: string;
}

const StatCard = ({ title, value, change, isPositive = true, icon, iconColor }: StatCardProps) => {
  return (
    <Card className="glass-card border-border/50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-1">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-income mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-expense mr-1" />
              )}
              <span className={isPositive ? "text-income text-xs" : "text-expense text-xs"}>
                {change}
              </span>
            </div>
          </div>
          <div 
            className={`p-3 rounded-lg opacity-90`}
            style={{ backgroundColor: `${iconColor}25` }}
          >
            <div className="flex items-center justify-center h-6 w-6">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard 
        title="Total Income"
        value="$8,240"
        change="+12.5% from last month"
        isPositive={true}
        icon={<DollarSign className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />
      
      <StatCard 
        title="Total Expenses"
        value="$5,320"
        change="+4.3% from last month"
        isPositive={false}
        icon={<TrendingDown className="h-5 w-5 text-expense" />}
        iconColor="#f43f5e"
      />
      
      <StatCard 
        title="Total Savings"
        value="$2,920"
        change="+23.1% from last month"
        isPositive={true}
        icon={<PiggyBank className="h-5 w-5 text-saving" />}
        iconColor="#6366f1"
      />
      
      <StatCard 
        title="Net Worth"
        value="$32,500"
        change="+5.2% from last month"
        isPositive={true}
        icon={<TrendingUp className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />
    </div>
  );
};

export default OverviewCards;
