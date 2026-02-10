import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/TransactionsTable";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    return response.data;
};

export default function Transactions() {
    // Use the query hook again. It will read from the cache on first load.
    const { data: transactions = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    });

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <DashboardHeader pageName="Transactions" />
                <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
                    <div className="w-full">
                        <Card className="glass-card border-border/50 ">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Transactions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                               <TransactionsTable
                                   // pageSize prop is part of the component's own logic
                                   pageSize={17}
                                   // Pass the query results to the table
                                   transactions={transactions}
                                   isLoading={isLoading}
                                   isError={isError}
                                   refetch={refetch}
                                 />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}