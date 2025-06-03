"use client"

import { CartesianGrid, Area, AreaChart, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState } from "react";


const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "var(--chart-5)",
  },
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  savings: {
    label: "Savings",
    color: "var(--chart-3)",
  },
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
        .slice(-6) // Only keep the last 6 items
    : [];
};

  const chartData = getChartData({ assets });

  const [datakey, setDatakey] = useState<string>("TExpense");

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Monthly Overview</CardTitle>
        </div>
        <div className="ml-auto flex ">
          <button
            onClick={() => setDatakey("TExpense")}
            className={`flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6${datakey === "TExpense" ? " data-[active=true]:bg-muted/50 bg-muted/50" : ""}`}
          >
            <span className="text-muted-foreground text-xs">
                  Expenses
                </span>
          </button>
          <button
            onClick={() => setDatakey("TIncome")}
            className={`flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6${datakey === "TIncome" ? " data-[active=true]:bg-muted/50 bg-muted/50" : ""}`}
          >
            <span className="text-muted-foreground text-xs">
              Income
            </span>
          </button>

          <button
            onClick={() => setDatakey("TSavings")}
            className={`flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6${datakey === "TSavings" ? " data-[active=true]:bg-muted/50 bg-muted/50" : ""}`}
          >
            <span className="text-muted-foreground text-xs">
              Savings
            </span>
          </button>
          <button
            onClick={() => setDatakey("net_worth")}
            className={`flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6${datakey === "net_worth" ? " data-[active=true]:bg-muted/50 bg-muted/50" : ""}`}
          >
            <span className="text-muted-foreground text-xs">
              Net Worth
            </span>
          </button>

        </div>
      </CardHeader>
    <CardContent>
    <ChartContainer config={chartConfig} className="mx-auto max-h-[500px] w-full">
      <AreaChart
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

        <defs>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
        
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey={datakey}
          animationEasing="ease"
          type="linear"
          fill ="url(#fillExpense)"
          fillOpacity={.4}
          stroke="var(--color-expenses)"
          strokeWidth={2}
          dot={{ fill: "var(--color-expenses)" }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ChartContainer>
    </CardContent>
    </Card>
  );
}
