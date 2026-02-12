"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useMemo } from "react"
import { useSettings } from "@/context/SettingsContext"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    expense: {
        label: "Expenses",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

interface ExpenseVolatilityChartProps {
    expanded?: boolean;
}

export function ExpenseVolatilityChart({ expanded = false }: ExpenseVolatilityChartProps) {
    const { formatCurrency } = useSettings();
    const { data: history = [], isLoading } = useQuery({
        queryKey: ["statsHistory"],
        queryFn: async () => {
            const response = await api.get("/stats/history/1");
            return response.data;
        },
    });

    const { chartData, avgExpense } = useMemo(() => {
        if (history.length === 0) return { chartData: [], avgExpense: 0 };
        const avg = history.reduce((sum: number, h: any) => sum + h.expense, 0) / history.length;
        const data = history.map((item: any) => ({
            label: `${item.month} ${item.year}`,
            expense: item.expense,
            fill: item.expense > avg * 1.15 ? "#f43f5e" : item.expense < avg * 0.85 ? "#2dd4bf" : "var(--chart-5)",
        }));
        return { chartData: data, avgExpense: Math.round(avg) };
    }, [history]);

    if (isLoading || history.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {isLoading ? "Loading..." : "No data yet"}
            </div>
        );
    }

    return (
        <ChartContainer
            config={chartConfig}
            className={expanded ? "mx-auto w-full h-[400px]" : "mx-auto w-full h-[200px]"}
        >
            <BarChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={expanded ? 12 : 10} />
                {expanded && (
                    <YAxis tickFormatter={(v) => formatCurrency(v)} tickLine={false} axisLine={false} fontSize={12} />
                )}
                <ReferenceLine
                    y={avgExpense}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    label={expanded ? { value: `Avg: ${formatCurrency(avgExpense)}`, position: "insideTopRight", fontSize: 11, fill: "#f59e0b" } : undefined}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                            indicator="dot"
                        />
                    }
                />
                <Bar
                    dataKey="expense"
                    radius={[4, 4, 0, 0]}
                    barSize={expanded ? 24 : 14}
                />
            </BarChart>
        </ChartContainer>
    );
}
