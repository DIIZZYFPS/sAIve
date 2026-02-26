import { useState, useMemo, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/context/SettingsContext";
import api from "@/lib/api";
import {
    Home,
    Utensils,
    Car,
    Tv,
    Zap,
    MoreHorizontal,
    Pencil,
    Check,
    X,
    TrendingDown,
    TrendingUp,
    Wallet,
    Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
    { name: "Housing", icon: Home, color: "#6366f1" },
    { name: "Food", icon: Utensils, color: "#f59e0b" },
    { name: "Transportation", icon: Car, color: "#2dd4bf" },
    { name: "Subscriptions", icon: Tv, color: "#ec4899" },
    { name: "Bills", icon: Zap, color: "#f97316" },
    { name: "Other", icon: MoreHorizontal, color: "#8b5cf6" },
];

interface BudgetType {
    category: string;
    amount: number;
}

interface BudgetCardProps {
    category: { name: string; icon: React.ElementType; color: string };
    spent: number;
    limit: number;
    onSaveLimit: (name: string, value: number) => void;
    formatCurrency: (amount: number) => string;
}

const BudgetCard = ({ category, spent, limit, onSaveLimit, formatCurrency }: BudgetCardProps) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(limit || ""));
    const Icon = category.icon;

    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const isOver = limit > 0 && spent > limit;
    const remaining = limit - spent;

    const handleSave = () => {
        const parsed = parseFloat(inputValue);
        if (!isNaN(parsed) && parsed >= 0) {
            onSaveLimit(category.name, parsed);
        }
        setEditing(false);
    };

    const handleCancel = () => {
        setInputValue(String(limit || ""));
        setEditing(false);
    };

    useEffect(() => {
        setInputValue(String(limit || ""));
    }, [limit]);

    return (
        <Card className="glass-card border-border/50">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${category.color}25` }}
                        >
                            <Icon className="h-4 w-4" style={{ color: category.color }} />
                        </div>
                        <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    {!editing ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            aria-label={`Edit budget limit for ${category.name}`}
                            onClick={() => setEditing(true)}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                    ) : (
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-income" onClick={handleSave}>
                                <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-expense" onClick={handleCancel}>
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>

                {editing ? (
                    <div className="mb-3">
                        <Input
                            type="number"
                            min="0"
                            step="1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") handleCancel();
                            }}
                            className="h-8 text-sm"
                            placeholder="Set budget limit"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Spent: <span className={cn("font-semibold", isOver ? "text-expense" : "text-foreground")}>{formatCurrency(spent)}</span></span>
                        <span>Limit: <span className="font-semibold text-foreground">{limit > 0 ? formatCurrency(limit) : "—"}</span></span>
                    </div>
                )}

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: isOver ? "#f43f5e" : percentage > 80 ? "#f59e0b" : category.color,
                        }}
                    />
                </div>

                {limit > 0 && !editing && (
                    <div className="mt-2 text-xs">
                        {isOver ? (
                            <span className="text-expense flex items-center gap-1">
                                <TrendingDown className="h-3 w-3" />
                                Over by {formatCurrency(Math.abs(remaining))}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">
                                {formatCurrency(remaining)} remaining ({(100 - percentage).toFixed(0)}%)
                            </span>
                        )}
                    </div>
                )}

                {limit === 0 && !editing && (
                    <p className="mt-2 text-xs text-muted-foreground italic">No limit set — click the edit button to add one</p>
                )}
            </CardContent>
        </Card>
    );
};

const fetchTransactions = async () => {
    const response = await api.get("/transactions/");
    return response.data;
};

const fetchUserAsset = async () => {
    const response = await api.get("/user_asset/1");
    return response.data;
};

const fetchBudgets = async () => {
    const response = await api.get("/budgets/1");
    return response.data;
};

const Budget = () => {
    const { formatCurrency } = useSettings();
    const queryClient = useQueryClient();

    const { data: transactions = [] } = useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransactions,
    });

    const { data: asset } = useQuery({
        queryKey: ["asset"],
        queryFn: fetchUserAsset,
    });

    const { data: budgets = [] } = useQuery({
        queryKey: ["budgets"],
        queryFn: fetchBudgets,
    });

    // Convert array of budgets to a dictionary for easier lookup
    const budgetLimits = useMemo(() => {
        const limits: Record<string, number> = {};
        budgets.forEach((b: BudgetType) => {
            limits[b.category] = b.amount;
        });
        return limits;
    }, [budgets]);

    const currentMonthIncome: number = asset?.asset?.TIncome ?? 0;

    const updateBudgetMutation = useMutation({
        mutationFn: async ({ category, amount }: { category: string; amount: number }) => {
            await api.put("/budgets/1", {
                user_id: 1,
                category,
                amount
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
        }
    });

    const handleSaveLimit = (category: string, value: number) => {
        updateBudgetMutation.mutate({ category, amount: value });
    };

    // Calculate this month's spending per category
    const thisMonthSpending = useMemo(() => {
        const now = new Date();
        const spending: Record<string, number> = {};
        EXPENSE_CATEGORIES.forEach(c => { spending[c.name] = 0; });

        transactions.forEach((tx: any) => {
            if (!tx.date || !tx.category || tx.category === "Income") return;
            const txDate = new Date(tx.date);
            if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
                spending[tx.category] = (spending[tx.category] || 0) + Math.abs(tx.amount);
            }
        });
        return spending;
    }, [transactions]);

    // Summary stats
    const totalBudgeted = useMemo(() =>
        EXPENSE_CATEGORIES.reduce((sum, c) => sum + (budgetLimits[c.name] || 0), 0),
        [budgetLimits]
    );
    const totalSpent = useMemo(() =>
        EXPENSE_CATEGORIES.reduce((sum, c) => sum + (thisMonthSpending[c.name] || 0), 0),
        [thisMonthSpending]
    );
    const overBudgetCount = useMemo(() =>
        EXPENSE_CATEGORIES.filter(c => (budgetLimits[c.name] || 0) > 0 && (thisMonthSpending[c.name] || 0) > (budgetLimits[c.name] || 0)).length,
        [budgetLimits, thisMonthSpending]
    );
    const budgetUtilization = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

    // 50/30/20 rule reference based on current month's income from transactions
    const needs = currentMonthIncome * 0.5;
    const wants = currentMonthIncome * 0.3;
    const savings = currentMonthIncome * 0.2;

    return (
        <>
            <DashboardHeader pageName="Budget" />
            <main className="flex-1 p-6 overflow-auto space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Budgeted</p>
                                    <p className="text-xl font-bold">{totalBudgeted > 0 ? formatCurrency(totalBudgeted) : "—"}</p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-primary/10">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Spent This Month</p>
                                    <p className="text-xl font-bold text-expense">{formatCurrency(totalSpent)}</p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-expense/10">
                                    <TrendingDown className="h-5 w-5 text-expense" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Remaining Budget</p>
                                    <p className={cn("text-xl font-bold", totalBudgeted > 0 ? (totalBudgeted - totalSpent >= 0 ? "text-income" : "text-expense") : "")}>
                                        {totalBudgeted > 0 ? formatCurrency(totalBudgeted - totalSpent) : "—"}
                                    </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-income/10">
                                    <Wallet className="h-5 w-5 text-income" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Budget Utilization</p>
                                    <p className={cn("text-xl font-bold", budgetUtilization > 90 ? "text-expense" : budgetUtilization > 70 ? "text-yellow-500" : "text-income")}>
                                        {totalBudgeted > 0 ? `${budgetUtilization.toFixed(0)}%` : "—"}
                                    </p>
                                    {overBudgetCount > 0 && (
                                        <p className="text-xs text-expense mt-0.5">{overBudgetCount} over limit</p>
                                    )}
                                </div>
                                <div className="p-2.5 rounded-lg bg-saving/10">
                                    <TrendingUp className="h-5 w-5 text-saving" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Category Budget Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-semibold">Category Budgets</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {EXPENSE_CATEGORIES.map((category) => (
                                <BudgetCard
                                    key={category.name}
                                    category={category}
                                    spent={thisMonthSpending[category.name] || 0}
                                    limit={budgetLimits[category.name] || 0}
                                    onSaveLimit={handleSaveLimit}
                                    formatCurrency={formatCurrency}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 50/30/20 Income Allocation Guide */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Income Allocation</h2>
                        <Card className="glass-card border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">50/30/20 Rule</CardTitle>
                                <CardDescription className="text-xs">
                                    Based on this month's income: {currentMonthIncome > 0 ? formatCurrency(currentMonthIncome) : "no income recorded yet"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: "Needs (50%)", value: needs, color: "#6366f1", description: "Housing, Food, Bills, Transportation" },
                                    { label: "Wants (30%)", value: wants, color: "#f59e0b", description: "Subscriptions, Entertainment, Dining out" },
                                    { label: "Savings (20%)", value: savings, color: "#2dd4bf", description: "Emergency fund, Investments, Goals" },
                                ].map(({ label, value, color, description }) => (
                                    <div key={label}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium">{label}</span>
                                            <span className="text-sm font-semibold">
                                                {currentMonthIncome > 0 ? formatCurrency(value) : "—"}
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: "100%", backgroundColor: color, opacity: 0.7 }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{description}</p>
                                    </div>
                                ))}
                                {currentMonthIncome === 0 && (
                                    <p className="text-xs text-muted-foreground italic text-center pt-1">
                                        No income recorded for this month yet
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Spending vs Budget bar */}
                        {totalBudgeted > 0 && (
                            <Card className="glass-card border-border/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold">Overall Progress</CardTitle>
                                    <CardDescription className="text-xs">
                                        Total spending vs. total budget this month
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                        <span>{formatCurrency(totalSpent)} spent</span>
                                        <span>{formatCurrency(totalBudgeted)} budget</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${budgetUtilization}%`,
                                                backgroundColor: budgetUtilization > 90 ? "#f43f5e" : budgetUtilization > 70 ? "#f59e0b" : "#2dd4bf",
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1.5 text-right">
                                        {budgetUtilization.toFixed(1)}% used
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Budget;
