
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/TransactionsTable";
import { RecurringTable } from "@/components/RecurringTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <>
            <DashboardHeader pageName="Transactions" />
            <main className="flex-1 p-6 overflow-auto">
                <Tabs defaultValue="history" className="w-full max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex w-full items-center justify-center mb-6">
                        <TabsList className="grid w-full max-w-[400px] grid-cols-2 p-1 bg-background/50 border border-border/50 rounded-full">
                            <TabsTrigger value="history" className="rounded-full">History</TabsTrigger>
                            <TabsTrigger value="recurring" className="rounded-full">Subscriptions</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="history" className="mt-0 outline-none w-full animate-fade-in">
                        <Card className="glass-card border-border/50 w-full shadow-xl">
                            <CardHeader className="pb-0 border-b border-border/30 mb-4 bg-background/20 rounded-t-xl">
                                <CardTitle className="text-xl mb-4">Transaction History</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <TransactionsTable
                                    pageSize={17}
                                    transactions={transactions}
                                    isLoading={isLoading}
                                    isError={isError}
                                    refetch={refetch}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recurring" className="mt-0 outline-none w-full animate-fade-in">
                        <RecurringTable />
                    </TabsContent>
                </Tabs>
            </main>
        </>
    );
}