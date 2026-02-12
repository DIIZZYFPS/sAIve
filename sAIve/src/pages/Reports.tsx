import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { ReportCard } from "@/components/ReportCard";
import { SavingsRateChart } from "@/components/charts/SavingsRateChart";
import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { AllTimeCategoryChart } from "@/components/charts/AllTimeCategoryChart";
import { NetWorthChart } from "@/components/charts/NetWorthChart";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CumulativeSavingsChart } from "@/components/charts/CumulativeSavingsChart";
import { BigThreeChart } from "@/components/charts/BigThreeChart";
import { ExpenseVolatilityChart } from "@/components/charts/ExpenseVolatilityChart";
import { DailySpendingHeatmap } from "@/components/charts/DailySpendingHeatmap";

const Reports = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <DashboardHeader pageName="Reports" />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReportCard
                            title="Savings Rate"
                            description="% of income saved each month — your financial efficiency"
                        >
                            {(expanded) => <SavingsRateChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="This Month's Spending"
                            description="Where your money goes — expense composition this month"
                        >
                            {(expanded) => <CategoryDonutChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="All-Time Spending"
                            description="Where you've spent the most money overall"
                        >
                            {(expanded) => <AllTimeCategoryChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="Net Worth"
                            description="Your total wealth progression over time"
                        >
                            {(expanded) => <NetWorthChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="Income vs. Expenses"
                            description="Monthly comparison of money in vs. money out"
                        >
                            {(expanded) => <IncomeExpenseChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="Cumulative Savings"
                            description="Your total savings pile growing over time"
                        >
                            {(expanded) => <CumulativeSavingsChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="The Big 3"
                            description="Housing, Food & Transport — the categories that matter most"
                        >
                            {(expanded) => <BigThreeChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="Expense Volatility"
                            description="Spending spikes vs. your average — how stable is your budget?"
                        >
                            {(expanded) => <ExpenseVolatilityChart expanded={expanded} />}
                        </ReportCard>

                        <ReportCard
                            title="Daily Spending"
                            description="When you spend — a heatmap of your daily expenses"
                        >
                            {(expanded) => <DailySpendingHeatmap expanded={expanded} />}
                        </ReportCard>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reports;
