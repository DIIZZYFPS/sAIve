"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    savings_rate: {
        label: "Savings Rate",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

interface SavingsRateChartProps {
    expanded?: boolean;
}

export function SavingsRateChart({ expanded = false }: SavingsRateChartProps) {
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

    const avgRate = chartData.reduce((sum: number, d: any) => sum + d.savings_rate, 0) / chartData.length;

    return (
        <ChartContainer
            config={chartConfig}
            className={expanded ? "mx-auto w-full h-[400px]" : "mx-auto w-full h-[200px]"}
        >
            <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={expanded ? 12 : 10}
                />
                {expanded && (
                    <YAxis
                        tickFormatter={(v) => `${v}%`}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                    />
                )}
                <ReferenceLine
                    y={avgRate}
                    stroke="var(--chart-1)"
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                    label={expanded ? { value: `Avg: ${avgRate.toFixed(1)}%`, position: "insideTopRight", fontSize: 11 } : undefined}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => `${Number(value).toFixed(1)}%`}
                            indicator="line"
                        />
                    }
                />
                <Line
                    dataKey="savings_rate"
                    type="monotone"
                    stroke="var(--color-savings_rate)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-savings_rate)", r: expanded ? 4 : 2 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ChartContainer>
    );
}
