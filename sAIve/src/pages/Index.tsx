import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/DashboardHeader';

import OverviewCards from "@/components/OverviewCards";
import { RecentActivityFeed } from "@/components/RecentActivityFeed";
import { MonthlyChart } from "@/components/MonthlyChart";
import { MonthlyRadioChart } from "@/components/MonthlyRadioChart";
import { ResponsiveContainer } from "recharts";


// No longer needs to accept props for data, as it fetches its own.
function Index() {
    useEffect(() => {
        document.title = "sAIve - AI Powered Budgeting Application";
    }, []);

    // Transactions data is fetched by RecentActivityFeed directly from the shared query cache.

    return (
        <>
            <DashboardHeader pageName="/" />

            <main className="flex-1 p-6 space-y-6 overflow-auto">
                <OverviewCards />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <MonthlyChart />
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
                            <RecentActivityFeed />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
}
export default Index;