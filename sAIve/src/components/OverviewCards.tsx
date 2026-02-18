import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/context/SettingsContext";
import { calculatePercentageChange } from "@/lib/finance";
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
  const { formatCurrency } = useSettings();

  const {
    data: asset = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["asset"],
    queryFn: async () => {
      const response = await api.get("/user_asset/1");
      return response.data;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard
        title="Total Income"
        value={isLoading ? "Loading..." : formatCurrency(asset.asset.TIncome)}
        change={calculatePercentageChange(asset?.asset?.TIncome, asset?.previous_asset?.TIncome)}
        isPositive={
          asset?.previous_asset == null
            ? true
            : asset?.asset?.TIncome > asset?.previous_asset?.TIncome
        }
        icon={<DollarSign className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />

      <StatCard
        title="Total Expenses"
        value={isLoading ? "Loading..." : formatCurrency(asset?.asset?.TExpense)}
        change={calculatePercentageChange(asset?.asset?.TExpense, asset?.previous_asset?.TExpense)}
        isPositive={
          asset?.previous_asset == null
            ? true
            : asset?.asset?.TExpense < asset?.previous_asset?.TExpense
        }
        icon={<TrendingDown className="h-5 w-5 text-expense" />}
        iconColor="#f43f5e"
      />

      <StatCard
        title="Total Savings"
        value={isLoading ? "Loading..." : formatCurrency(asset?.asset?.TSavings)}
        change={calculatePercentageChange(asset?.asset?.TSavings, asset?.previous_asset?.TSavings)}
        isPositive={asset?.previous_asset == null ? true : asset?.asset?.TSavings > asset?.previous_asset?.TSavings}
        icon={<PiggyBank className="h-5 w-5 text-saving" />}
        iconColor="#6366f1"
      />

      <StatCard
        title="Net Worth"
        value={
          isLoading
            ? "Loading..."
            : isError || !asset?.user
              ? "Error"
              : formatCurrency(asset?.user?.net_worth)
        }
        change={calculatePercentageChange(asset?.user?.net_worth, asset?.previous_asset?.net_worth)}
        isPositive={
          asset.previous_asset == null || !asset.previous_asset.net_worth
            ? true
            : (asset.user?.net_worth ?? 0) > (asset.previous_asset?.net_worth ?? 0)
        }
        icon={<TrendingUp className="h-5 w-5 text-income" />}
        iconColor="#2dd4bf"
      />
    </div>
  );
};

export default OverviewCards;


