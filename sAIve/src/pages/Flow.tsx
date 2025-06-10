import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "@/components/Chart";

const Flow = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <DashboardHeader pageName="Financial Flow" />
                <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
                    <div className="w-full">
                        <Card className="glass-card border-border/50 ">
                            <CardHeader className="pb-0">
                                <CardTitle className="text-xl">Financial Flow</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                
                                    <Chart/>
                                
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default Flow;
