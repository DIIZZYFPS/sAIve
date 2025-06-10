import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionsTable from "@/components/TransactionsTable";


type TransactionProps = {
    transactions: any; 
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
};

export default function Transactions({ transactions, isLoading, isError, refetch }: TransactionProps) {


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
                               {TransactionsTable(
                                                   { pageSize: 17 },
                                                   transactions,
                                                   isLoading,
                                                   isError,
                                                   refetch
                                                 )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
    }