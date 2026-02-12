"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useMemo } from "react"

interface DailySpendingHeatmapProps {
    expanded?: boolean;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getColor(amount: number, maxAmount: number): string {
    if (amount === 0) return "var(--muted)";
    const intensity = Math.min(amount / maxAmount, 1);
    // From light teal to deep rose based on spend intensity
    if (intensity < 0.25) return "#99f6e4";  // light teal
    if (intensity < 0.5) return "#fbbf24";   // amber
    if (intensity < 0.75) return "#fb923c";  // orange
    return "#f43f5e";                        // rose (high spend)
}

export function DailySpendingHeatmap({ expanded = false }: DailySpendingHeatmapProps) {
    const { data: dailyData = [], isLoading } = useQuery({
        queryKey: ["dailySpending"],
        queryFn: async () => {
            const response = await api.get("/stats/daily-spending/1");
            return response.data;
        },
    });

    const { grid, maxAmount } = useMemo(() => {
        if (dailyData.length === 0) return { grid: [], maxAmount: 0 };

        const max = Math.max(...dailyData.map((d: any) => d.amount), 1);

        // Build weeks (columns of 7 rows each)
        const weeks: any[][] = [];
        let currentWeek: any[] = [];

        // Pad start of month
        const firstWeekday = dailyData[0]?.weekday ?? 0;
        for (let i = 0; i < firstWeekday; i++) {
            currentWeek.push(null);
        }

        for (const day of dailyData) {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) currentWeek.push(null);
            weeks.push(currentWeek);
        }

        return { grid: weeks, maxAmount: max };
    }, [dailyData]);

    if (isLoading || dailyData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {isLoading ? "Loading..." : "No spending data this month"}
            </div>
        );
    }

    const cellSize = expanded ? 36 : 20;
    const gap = expanded ? 4 : 2;

    return (
        <div className={`flex flex-col items-center ${expanded ? "gap-4" : "gap-2"}`}>
            <div className="flex gap-1">
                {/* Weekday labels */}
                <div className="flex flex-col" style={{ gap, marginRight: expanded ? 8 : 4 }}>
                    {WEEKDAY_LABELS.map((label) => (
                        <div
                            key={label}
                            className="text-muted-foreground flex items-center justify-end"
                            style={{ height: cellSize, fontSize: expanded ? 11 : 9 }}
                        >
                            {expanded ? label : label[0]}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                {grid.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col" style={{ gap }}>
                        {week.map((day: any, dayIdx: number) => (
                            <div
                                key={dayIdx}
                                className="rounded-sm transition-colors relative group"
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor: day ? getColor(day.amount, maxAmount) : "transparent",
                                    opacity: day ? 1 : 0,
                                }}
                            >
                                {day && expanded && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                        Day {day.day}: ${day.amount.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            {expanded && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "var(--muted)" }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#99f6e4" }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#fbbf24" }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#fb923c" }} />
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#f43f5e" }} />
                    <span>More</span>
                </div>
            )}
        </div>
    );
}
