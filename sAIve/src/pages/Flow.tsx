
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "@/components/Chart";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Flow = () => {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1); // 1-indexed
    const [year, setYear] = useState(now.getFullYear());

    const goBack = () => {
        if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    };

    const goForward = () => {
        // Don't allow going past the current month
        if (year === now.getFullYear() && month === now.getMonth() + 1) return;
        if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    };

    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

    return (
        <>
            <DashboardHeader pageName="Financial Flow" />
            <main className="flex-1 p-6 overflow-auto flex items-center justify-center">
                <div className="w-full">
                    <Card className="glass-card border-border/50 ">
                        <CardHeader className="pb-0 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">Financial Flow</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={goBack}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium min-w-[140px] text-center">
                                    {MONTH_NAMES[month - 1]} {year}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={goForward}
                                    disabled={isCurrentMonth}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Chart month={month} year={year} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
};
export default Flow;
