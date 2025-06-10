import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import OverviewCards from "@/components/OverviewCards";
import TransactionsTable from "@/components/TransactionsTable";
import { MonthlyChart } from "@/components/MonthlyChart";
import { MonthlyRadioChart } from "@/components/MonthlyRadioChart";
import { ResponsiveContainer } from "recharts";

type IndexProps = {
    transactions: any; 
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
};

function Index({ transactions, isLoading, isError, refetch }: IndexProps) {
    useEffect(() => {
        document.title = "sAIve - AI Powered Budgeting Application"
    }, []);



    return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader pageName="/" />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
            <OverviewCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <MonthlyChart  />
                    </ResponsiveContainer>  
            </div>
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Expense Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                    <MonthlyRadioChart />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                  {TransactionsTable(
                    { pageSize: 5 },
                    transactions,
                    isLoading,
                    isError,
                    refetch
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    );
}
export default Index