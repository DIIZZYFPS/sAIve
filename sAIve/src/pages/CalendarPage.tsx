import { useState, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/context/SettingsContext";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    Clock,
    DollarSign,
} from "lucide-react";
import { format, parseISO, addDays, addWeeks, addMonths, addYears, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth, differenceInCalendarDays } from "date-fns";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface RecurringTransaction {
    id: number;
    recipient: string;
    amount: number;
    category: string;
    type: "income" | "expense";
    interval: "daily" | "weekly" | "monthly" | "yearly";
    start_date: string;
    next_date: string;
}

interface CalendarEvent {
    date: Date;
    rt: RecurringTransaction;
}

/**
 * Generate all occurrences of a recurring transaction within [rangeStart, rangeEnd].
 */
function getOccurrencesInRange(rt: RecurringTransaction, rangeStart: Date, rangeEnd: Date): Date[] {
    const occurrences: Date[] = [];
    let current = parseISO(rt.next_date);

    // Walk backward if next_date is after rangeEnd (shouldn't happen often, but be safe)
    // Walk forward from next_date until we pass rangeEnd
    // Also walk backward from next_date to cover dates within the range that already passed
    // Strategy: find the earliest occurrence >= rangeStart
    const startDate = parseISO(rt.start_date);

    // Move current back to the first occurrence at or before rangeStart
    // to ensure we catch dates that fall within the range
    while (current > rangeEnd) {
        switch (rt.interval) {
            case "daily": current = addDays(current, -1); break;
            case "weekly": current = addWeeks(current, -1); break;
            case "monthly": current = addMonths(current, -1); break;
            case "yearly": current = addYears(current, -1); break;
        }
    }

    // Move further back so we start before or at rangeStart
    let prev = current;
    while (prev >= rangeStart) {
        switch (rt.interval) {
            case "daily": prev = addDays(prev, -1); break;
            case "weekly": prev = addWeeks(prev, -1); break;
            case "monthly": prev = addMonths(prev, -1); break;
            case "yearly": prev = addYears(prev, -1); break;
        }
    }
    current = prev;

    // Now walk forward and collect occurrences in range
    // Advance to next step
    switch (rt.interval) {
        case "daily": current = addDays(current, 1); break;
        case "weekly": current = addWeeks(current, 1); break;
        case "monthly": current = addMonths(current, 1); break;
        case "yearly": current = addYears(current, 1); break;
    }

    while (current <= rangeEnd) {
        if (current >= rangeStart && current >= startDate) {
            occurrences.push(current);
        }
        switch (rt.interval) {
            case "daily": current = addDays(current, 1); break;
            case "weekly": current = addWeeks(current, 1); break;
            case "monthly": current = addMonths(current, 1); break;
            case "yearly": current = addYears(current, 1); break;
        }
    }

    return occurrences;
}

const CalendarPage = () => {
    const { formatCurrency } = useSettings();
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
    const [selectedDate, setSelectedDate] = useState<Date | null>(now);

    const { data: recurringTxns = [] } = useQuery<RecurringTransaction[]>({
        queryKey: ["recurring_transactions"],
        queryFn: async () => {
            const res = await api.get("/recurring_transactions/1");
            return res.data;
        },
    });

    const viewDate = useMemo(() => new Date(viewYear, viewMonth, 1), [viewYear, viewMonth]);
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);

    // Build the calendar grid (fill weeks)
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Compute all events for the visible calendar range
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        const events: CalendarEvent[] = [];
        for (const rt of recurringTxns) {
            const dates = getOccurrencesInRange(rt, calendarStart, calendarEnd);
            for (const d of dates) {
                events.push({ date: d, rt });
            }
        }
        return events;
    }, [recurringTxns, calendarStart, calendarEnd]);

    // Events for a given date
    const eventsForDate = (day: Date) =>
        calendarEvents.filter(e => isSameDay(e.date, day));

    // Events for selected date
    const selectedEvents = useMemo(() =>
        selectedDate ? eventsForDate(selectedDate) : [],
        [selectedDate, calendarEvents]
    );

    // Monthly totals
    const { monthlyExpenses, monthlyIncome } = useMemo(() => {
        let expenses = 0;
        let income = 0;
        for (const e of calendarEvents) {
            if (isSameMonth(e.date, viewDate)) {
                if (e.rt.type === "expense") expenses += e.rt.amount;
                else income += e.rt.amount;
            }
        }
        return { monthlyExpenses: expenses, monthlyIncome: income };
    }, [calendarEvents, viewDate]);

    // Upcoming events in the next 30 days
    const upcomingEvents: CalendarEvent[] = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const until = addDays(today, 30);
        const events: CalendarEvent[] = [];
        for (const rt of recurringTxns) {
            const dates = getOccurrencesInRange(rt, today, until);
            for (const d of dates) {
                events.push({ date: d, rt });
            }
        }
        return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [recurringTxns]);

    const goBack = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const goForward = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const goToToday = () => {
        setViewYear(now.getFullYear());
        setViewMonth(now.getMonth());
        setSelectedDate(now);
    };

    return (
        <>
            <DashboardHeader pageName="Calendar" />
            <main className="flex-1 p-6 overflow-auto space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Recurring Expenses This Month</p>
                                <p className="text-xl font-bold text-expense">{formatCurrency(monthlyExpenses)}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-expense/10">
                                <TrendingDown className="h-5 w-5 text-expense" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Recurring Income This Month</p>
                                <p className="text-xl font-bold text-income">{formatCurrency(monthlyIncome)}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-income/10">
                                <TrendingUp className="h-5 w-5 text-income" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Net Recurring This Month</p>
                                <p className={cn("text-xl font-bold", monthlyIncome - monthlyExpenses >= 0 ? "text-income" : "text-expense")}>
                                    {formatCurrency(monthlyIncome - monthlyExpenses)}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-primary/10">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="glass-card border-border/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                        {MONTH_NAMES[viewMonth]} {viewYear}
                                    </CardTitle>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs h-8 px-3">
                                            Today
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={goForward} className="h-8 w-8">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Day names header */}
                                <div className="grid grid-cols-7 mb-1">
                                    {DAY_NAMES.map(d => (
                                        <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                {/* Calendar days */}
                                <div className="grid grid-cols-7 gap-px bg-border/20 rounded-lg overflow-hidden">
                                    {calendarDays.map((day, i) => {
                                        const dayEvents = eventsForDate(day);
                                        const isCurrentMonth = isSameMonth(day, viewDate);
                                        const isDayToday = isToday(day);
                                        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                                        const hasExpense = dayEvents.some(e => e.rt.type === "expense");
                                        const hasIncome = dayEvents.some(e => e.rt.type === "income");

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(day)}
                                                className={cn(
                                                    "relative min-h-[72px] p-1.5 text-left bg-background/50 transition-colors hover:bg-muted/50",
                                                    !isCurrentMonth && "opacity-40",
                                                    isSelected && "bg-primary/10 ring-1 ring-inset ring-primary",
                                                    isDayToday && !isSelected && "bg-primary/5",
                                                )}
                                            >
                                                <span className={cn(
                                                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                                                    isDayToday && "bg-primary text-primary-foreground",
                                                    !isDayToday && isSelected && "text-primary font-bold",
                                                    !isDayToday && !isSelected && "text-foreground"
                                                )}>
                                                    {format(day, "d")}
                                                </span>

                                                {/* Event dots */}
                                                {dayEvents.length > 0 && (
                                                    <div className="mt-1 space-y-0.5">
                                                        {dayEvents.slice(0, 2).map((e, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "text-[10px] leading-tight truncate rounded px-1 font-medium",
                                                                    e.rt.type === "expense"
                                                                        ? "bg-expense/15 text-expense"
                                                                        : "bg-income/15 text-income"
                                                                )}
                                                            >
                                                                {e.rt.recipient}
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-[10px] text-muted-foreground pl-1">
                                                                +{dayEvents.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Bottom color bar */}
                                                {(hasExpense || hasIncome) && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
                                                        {hasExpense && <div className="flex-1 bg-expense" />}
                                                        {hasIncome && <div className="flex-1 bg-income" />}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-sm bg-expense/20 border border-expense/50" />
                                        <span>Expense</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-2.5 w-2.5 rounded-sm bg-income/20 border border-income/50" />
                                        <span>Income</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected day detail */}
                        {selectedDate && (
                            <Card className="glass-card border-border/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        {isToday(selectedDate) ? "Today — " : ""}{format(selectedDate, "EEEE, MMMM d, yyyy")}
                                    </CardTitle>
                                    {selectedEvents.length === 0 && (
                                        <CardDescription>No recurring transactions on this day.</CardDescription>
                                    )}
                                </CardHeader>
                                {selectedEvents.length > 0 && (
                                    <CardContent className="space-y-2">
                                        {selectedEvents.map((e, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-2 rounded-lg",
                                                        e.rt.type === "expense" ? "bg-expense/10" : "bg-income/10"
                                                    )}>
                                                        <RefreshCw className={cn("h-4 w-4", e.rt.type === "expense" ? "text-expense" : "text-income")} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{e.rt.recipient}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{e.rt.category} · {e.rt.interval}</p>
                                                    </div>
                                                </div>
                                                <span className={cn("text-sm font-semibold", e.rt.type === "expense" ? "text-expense" : "text-income")}>
                                                    {e.rt.type === "expense" ? "-" : "+"}{formatCurrency(e.rt.amount)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-1 text-sm">
                                            <span className="text-muted-foreground">Day total</span>
                                            <span className={cn("font-semibold",
                                                selectedEvents.reduce((s, e) => s + (e.rt.type === "income" ? e.rt.amount : -e.rt.amount), 0) >= 0
                                                    ? "text-income" : "text-expense"
                                            )}>
                                                {formatCurrency(Math.abs(selectedEvents.reduce((s, e) => s + (e.rt.type === "income" ? e.rt.amount : -e.rt.amount), 0)))}
                                                {" "}
                                                ({selectedEvents.reduce((s, e) => s + (e.rt.type === "income" ? e.rt.amount : -e.rt.amount), 0) >= 0 ? "net income" : "net expense"})
                                            </span>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-4">
                        {/* Upcoming in the next 30 days */}
                        <Card className="glass-card border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" /> Upcoming (30 days)
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Next scheduled recurring transactions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                                {upcomingEvents.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                                        <RefreshCw className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No upcoming subscriptions.</p>
                                    </div>
                                ) : (
                                    upcomingEvents.map((e, idx) => {
                                        const daysUntil = differenceInCalendarDays(e.date, new Date());
                                        return (
                                            <div
                                                key={idx}
                                                className={cn(
                                                    "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors",
                                                    "border border-border/30 bg-background/40 hover:bg-muted/40"
                                                )}
                                                onClick={() => {
                                                    setSelectedDate(e.date);
                                                    setViewYear(e.date.getFullYear());
                                                    setViewMonth(e.date.getMonth());
                                                }}
                                            >
                                                <div className={cn(
                                                    "flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold",
                                                    e.rt.type === "expense" ? "bg-expense/10 text-expense" : "bg-income/10 text-income"
                                                )}>
                                                    <span className="text-[11px] leading-none">{format(e.date, "MMM").toUpperCase()}</span>
                                                    <span className="text-base leading-none">{format(e.date, "d")}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{e.rt.recipient}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                                                        {" · "}<span className="capitalize">{e.rt.interval}</span>
                                                    </p>
                                                </div>
                                                <span className={cn("text-sm font-semibold flex-shrink-0", e.rt.type === "expense" ? "text-expense" : "text-income")}>
                                                    {e.rt.type === "expense" ? "-" : "+"}{formatCurrency(e.rt.amount)}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* Active subscriptions count */}
                        <Card className="glass-card border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-primary" /> Active Subscriptions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {recurringTxns.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4">No active subscriptions.</p>
                                    ) : (
                                        recurringTxns.map((rt) => (
                                            <div key={rt.id} className="flex items-center justify-between py-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full flex-shrink-0",
                                                        rt.type === "expense" ? "bg-expense" : "bg-income"
                                                    )} />
                                                    <span className="text-sm truncate">{rt.recipient}</span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                                                        {rt.interval}
                                                    </Badge>
                                                    <span className={cn("text-xs font-semibold", rt.type === "expense" ? "text-expense" : "text-income")}>
                                                        {rt.type === "expense" ? "-" : "+"}{formatCurrency(rt.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CalendarPage;
