import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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

    const {
    data: asset = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["asset"],
    queryFn: async () => {
      const response = await api.get("/user_asset/1");
      return response.data;
    },
    refetchInterval: 1000
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard 
        title="Total Income"
        value= {isLoading ? "Loading..." : `$${asset.asset.TIncome}`}
        change={asset.previous_asset == null ? "No Change" : `${((asset.asset.TIncome - asset.previous_asset.TIncome) / asset.previous_asset.TIncome * 100).toFixed(2)}% from last month`}
        isPositive={asset.previous_asset == null ? true : asset.asset.TIncome > asset.previous_asset.TIncome}
        icon={<DollarSign className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />
      
      <StatCard 
        title="Total Expenses"
        value= {isLoading ? "Loading..." : `$${asset.asset.TExpense}`}
        change={asset.previous_asset == null ? "No Change" : `${((asset.asset.TExpense - asset.previous_asset.TExpense) / asset.previous_asset.TExpense * 100).toFixed(2)}% from last month`}
        isPositive={asset.previous_asset == null ? true : asset.asset.TExpense > asset.previous_asset.TExpense}
        icon={<TrendingDown className="h-5 w-5 text-expense" />}
        iconColor="#f43f5e"
      />
      
      <StatCard 
        title="Total Savings"
        value= {isLoading ? "Loading..." : `$${asset.asset.TSavings}`}
        change={asset.previous_asset == null ? "No Change" : `${((asset.asset.TSavings - asset.previous_asset.TSavings) / asset.previous_asset.TSavings * 100).toFixed(2)}% from last month`}
        isPositive={asset.previous_asset == null ? true : asset.asset.TSavings > asset.previous_asset.TSavings}
        icon={<PiggyBank className="h-5 w-5 text-saving" />}
        iconColor="#6366f1"
      />
      
      <StatCard 
        title="Net Worth"
        value={
          isLoading
            ? "Loading..."
            : isError || !asset.user
              ? "Error"
              : `$${asset.user.net_worth}`
        }
        change={
          asset.previous_asset == null || !asset.previous_asset.user
            ? "No Change"
            : asset.previous_asset.user.net_worth === 0
              ? "No Change"
              : `${(
                  ((asset.user?.net_worth ?? 0) - (asset.previous_asset.user?.net_worth ?? 0)) /
                  (asset.previous_asset.user?.net_worth ?? 1) * 100
                ).toFixed(2)}% from last month`
        }
        isPositive={
          asset.previous_asset == null || !asset.previous_asset.user
            ? true
            : (asset.user?.net_worth ?? 0) > (asset.previous_asset.user?.net_worth ?? 0)
        }
        icon={<TrendingUp className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />
    </div>
  );
};

export default OverviewCards;


