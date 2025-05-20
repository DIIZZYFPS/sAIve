import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import OverviewCards from "@/components/OverviewCards";
import TransactionsTable from "@/components/TransactionsTable";
import { MonthlyChart } from "@/components/MonthlyChart";
import { MonthlyRadioChart } from "@/components/MonthlyRadioChart";
import { ResponsiveContainer } from "recharts";

const Index = () => {
    useEffect(() => {
        document.title = "sAIve - AI Powered Budgeting Application"
    }, []);

    return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader />
        
        <main className="flex-1 p-6 space-y-6 overflow-auto">
            <OverviewCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card border-border/50 lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Monthly Expense Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <MonthlyChart />
                    </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Monthly Expense Overview</CardTitle>
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
                    <TransactionsTable />
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