"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "var(--chart-5)",
  }
} satisfies ChartConfig





export function MonthlyChart() {
  // Convert numerical months to text months

  const {
    data: assets = [],
  } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await api.get("/user_assets/1/all");
      return response.data;
    },
  });

  const monthNames = [
  "", // so that month numbers match index (1-based)
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const getChartData = ({ assets }: { assets: any }) => {
  return Array.isArray(assets)
    ? assets
        .map(item => ({
          ...item,
          month: monthNames[item.month] || String(item.month)
        }))
        .slice() // create a shallow copy
    : [];
};

  const chartData = getChartData({ assets });

  return (
    <ChartContainer config={chartConfig} className="mx-auto max-h-[500px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 20, right: 10, top: 10, bottom: 10 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={true}
          axisLine={true}
          tickMargin={5}
        />
        
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="TExpense"
          animationEasing="ease"
          type="linear"
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={{ fill: "var(--color-expenses)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
