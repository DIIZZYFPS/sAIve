import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import {
    TrendingUp,
    TrendingDown,
    Inbox,
    ArrowRight,
    UtensilsCrossed,
    Car,
    Repeat,
    Zap,
    Home,
    MoreHorizontal,
    CircleDollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
    id: number;
    date: string;
    type: string;
    amount: number;
    recipient: string;
    category?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
    Income: { icon: CircleDollarSign, color: "text-income", badge: "bg-income/15 text-income border-income/30" },
    Food: { icon: UtensilsCrossed, color: "text-orange-400", badge: "bg-orange-500/15 text-orange-400 border-orange-400/30" },
    Transportation: { icon: Car, color: "text-blue-400", badge: "bg-blue-500/15 text-blue-400 border-blue-400/30" },
    Subscriptions: { icon: Repeat, color: "text-purple-400", badge: "bg-purple-500/15 text-purple-400 border-purple-400/30" },
    Bills: { icon: Zap, color: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30" },
    Housing: { icon: Home, color: "text-cyan-400", badge: "bg-cyan-500/15 text-cyan-400 border-cyan-400/30" },
    Other: { icon: MoreHorizontal, color: "text-muted-foreground", badge: "bg-muted text-muted-foreground border-border" },
};

const DEFAULT_CONFIG = CATEGORY_CONFIG["Other"];

function relativeDate(dateStr: string): string {
    const d = parseISO(dateStr);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d");
}

export function RecentActivityFeed() {
    const { formatCurrency } = useSettings();

    const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
        queryKey: ["transactions"],
        queryFn: async () => {
            const res = await api.get("/transactions/");
            return res.data;
        },
    });

    // Show the 8 most recent transactions (memoized to avoid re-sorting on every render)
    const recent = useMemo(
        () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
        [transactions]
    );

    if (isLoading) {
        return (
            <div className="space-y-3 py-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-1">
                        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3 w-2/5" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground text-sm">
                <p className="text-destructive font-medium">Failed to load transactions.</p>
            </div>
        );
    }

    if (recent.length === 0) {
        return (
            <div className="flex flex-col items-center py-10 gap-3 text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-20" />
                <p className="text-sm">No transactions yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Feed list */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {recent.map((tx) => {
                    const cfg = (tx.category && CATEGORY_CONFIG[tx.category]) ? CATEGORY_CONFIG[tx.category] : DEFAULT_CONFIG;
                    const Icon = cfg.icon;
                    const isIncome = tx.type === "income";

                    return (
                        <div
                            key={tx.id}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/30 transition-colors group"
                        >
                            {/* Category icon bubble */}
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 bg-muted/50 ${cfg.color}`}>
                                <Icon className="h-4 w-4" />
                            </div>

                            {/* Recipient + category */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-tight truncate">{tx.recipient}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {tx.category && (
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] px-1.5 py-0 leading-4 border ${cfg.badge}`}
                                        >
                                            {tx.category}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Amount + date */}
                            <div className="text-right shrink-0">
                                <p className={`text-sm font-semibold ${isIncome ? "text-income" : "text-expense"}`}>
                                    {isIncome ? "+" : "−"}{formatCurrency(Number(tx.amount.toFixed(2)))}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-end gap-1">
                                    {isIncome
                                        ? <TrendingUp className="h-3 w-3" />
                                        : <TrendingDown className="h-3 w-3" />
                                    }
                                    {relativeDate(tx.date)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer link */}
            <div className="pt-3 mt-1 border-t border-border/30">
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5" asChild>
                    <Link to="/transactions">
                        View all transactions
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
