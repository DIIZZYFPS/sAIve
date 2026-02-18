"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useSettings } from "@/context/SettingsContext"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const chartConfig = {
    Housing: {
        label: "Housing",
        color: "#f43f5e",
    },
    Food: {
        label: "Food",
        color: "#f59e0b",
    },
    Transportation: {
        label: "Transportation",
        color: "#6366f1",
    },
} satisfies ChartConfig

interface BigThreeChartProps {
    expanded?: boolean;
}

export function BigThreeChart({ expanded = false }: BigThreeChartProps) {
    const { formatCurrency } = useSettings();
    const { data: history = [], isLoading } = useQuery({
        queryKey: ["categoryHistory"],
        queryFn: async () => {
            const response = await api.get("/stats/category-history/1?categories=Housing,Food,Transportation");
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

    return (
        <ChartContainer
            config={chartConfig}
            className={expanded ? "mx-auto w-full h-[400px]" : "mx-auto w-full h-[200px]"}
        >
            <LineChart data={history} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
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
                            indicator="dot"
                        />
                    }
                />
                <Line dataKey="Housing" type="monotone" stroke="var(--color-Housing)" strokeWidth={2} dot={{ r: expanded ? 3 : 1.5 }} />
                <Line dataKey="Food" type="monotone" stroke="var(--color-Food)" strokeWidth={2} dot={{ r: expanded ? 3 : 1.5 }} />
                <Line dataKey="Transportation" type="monotone" stroke="var(--color-Transportation)" strokeWidth={2} dot={{ r: expanded ? 3 : 1.5 }} />
                {expanded && (
                    <ChartLegend content={<ChartLegendContent />} />
                )}
            </LineChart>
        </ChartContainer>
    );
}
