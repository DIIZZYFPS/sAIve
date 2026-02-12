"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
    cumulative: {
        label: "Total Saved",
        color: "#6366f1",
    },
} satisfies ChartConfig

interface CumulativeSavingsChartProps {
    expanded?: boolean;
}

export function CumulativeSavingsChart({ expanded = false }: CumulativeSavingsChartProps) {
    const { formatCurrency } = useSettings();
    const { data: history = [], isLoading } = useQuery({
        queryKey: ["statsHistory"],
        queryFn: async () => {
            const response = await api.get("/stats/history/1");
            return response.data;
        },
    });

    const chartData = useMemo(() => {
        let running = 0;
        return history.map((item: any) => {
            running += item.savings;
            return {
                label: `${item.month} ${item.year}`,
                cumulative: Math.round(running),
            };
        });
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
            <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={expanded ? 12 : 10} />
                {expanded && (
                    <YAxis tickFormatter={(v) => formatCurrency(v)} tickLine={false} axisLine={false} fontSize={12} />
                )}
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => formatCurrency(Number(value))}
                            indicator="line"
                        />
                    }
                />
                <Line
                    dataKey="cumulative"
                    type="monotone"
                    stroke="var(--color-cumulative)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-cumulative)", r: expanded ? 4 : 2 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ChartContainer>
    );
}
