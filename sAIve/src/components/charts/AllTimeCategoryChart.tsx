"use client"

import { Pie, PieChart, Cell, Label } from "recharts"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import { useMemo } from "react"

import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const COLORS = [
    "#f43f5e", "#6366f1", "#2dd4bf", "#f59e0b",
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
    "#06b6d4", "#84cc16",
];

interface AllTimeCategoryChartProps {
    expanded?: boolean;
}

export function AllTimeCategoryChart({ expanded = false }: AllTimeCategoryChartProps) {
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/user_assets/1/category");
            return response.data;
        },
    });

    const chartData = useMemo(() => {
        return categories
            .filter((c: any) => c.category !== "Income")
            .map((item: any, index: number) => ({
                category: item.category,
                amount: item.Amount,
                fill: COLORS[index % COLORS.length],
            }))
            .sort((a: any, b: any) => b.amount - a.amount);
    }, [categories]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        chartData.forEach((item: any) => {
            config[item.category] = {
                label: item.category,
                color: item.fill,
            };
        });
        return config;
    }, [chartData]);

    const totalSpent = useMemo(() => {
        return chartData.reduce((sum: number, item: any) => sum + item.amount, 0);
    }, [chartData]);

    if (isLoading || chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                {isLoading ? "Loading..." : "No expense data yet"}
            </div>
        );
    }

    return (
        <ChartContainer
            config={chartConfig}
            className={expanded ? "mx-auto w-full h-[400px]" : "mx-auto aspect-square w-full h-[200px]"}
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value) => `$${Number(value).toFixed(2)}`}
                            nameKey="category"
                            indicator="dot"
                        />
                    }
                />
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={expanded ? 80 : 40}
                    outerRadius={expanded ? 140 : 70}
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                >
                    {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-xl font-bold"
                                        >
                                            ${totalSpent.toFixed(0)}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 20}
                                            className="fill-muted-foreground text-xs"
                                        >
                                            All Time
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </Pie>
                {expanded && (
                    <ChartLegend
                        content={<ChartLegendContent nameKey="category" />}
                        className="flex-wrap gap-2 [&>*]:basis-auto [&>*]:justify-center"
                    />
                )}
            </PieChart>
        </ChartContainer>
    );
}
