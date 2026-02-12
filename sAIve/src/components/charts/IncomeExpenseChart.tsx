"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const chartConfig = {
    income: {
        label: "Income",
        color: "#2dd4bf",
    },
    expense: {
        label: "Expenses",
        color: "#f43f5e",
    },
} satisfies ChartConfig

interface IncomeExpenseChartProps {
    expanded?: boolean;
}

export function IncomeExpenseChart({ expanded = false }: IncomeExpenseChartProps) {
    const { data: history = [], isLoading } = useQuery({
        queryKey: ["statsHistory"],
        queryFn: async () => {
            const response = await api.get("/stats/history/1");
            return response.data;
        },
    });

    if (isLoading || history.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {isLoading ? "Loading..." : "No data yet"}
            </div>
        );
    }

    const chartData = history.map((item: any) => ({
        ...item,
        label: `${item.month} ${item.year}`,
    }));

    return (
        <ChartContainer
            config={chartConfig}
            className={expanded ? "mx-auto w-full h-[400px]" : "mx-auto w-full h-[200px]"}
        >
            <BarChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={expanded ? 12 : 10} />
                {expanded && (
                    <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tickLine={false} axisLine={false} fontSize={12} />
                )}
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => `$${Number(value).toLocaleString()}`}
                            indicator="dot"
                        />
                    }
                />
                <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} barSize={expanded ? 20 : 12} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} barSize={expanded ? 20 : 12} />
                {expanded && (
                    <ChartLegend content={<ChartLegendContent />} />
                )}
            </BarChart>
        </ChartContainer>
    );
}
