"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    net_worth: {
        label: "Net Worth",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

interface NetWorthChartProps {
    expanded?: boolean;
}

export function NetWorthChart({ expanded = false }: NetWorthChartProps) {
    const { formatCurrency } = useSettings();
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
            <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={expanded ? 12 : 10} />
                {expanded && (
                    <YAxis tickFormatter={(v) => formatCurrency(v)} tickLine={false} axisLine={false} fontSize={12} />
                )}
                <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-net_worth)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-net_worth)" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                            indicator="line"
                        />
                    }
                />
                <Area
                    dataKey="net_worth"
                    type="monotone"
                    fill="url(#netWorthGrad)"
                    fillOpacity={0.4}
                    stroke="var(--color-net_worth)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-net_worth)", r: expanded ? 4 : 2 }}
                    activeDot={{ r: 6 }}
                />
            </AreaChart>
        </ChartContainer>
    );
}
