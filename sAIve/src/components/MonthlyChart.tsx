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

import { useEffect, useState, useMemo } from "react";


const chartConfig = {
  TExpense: {
    label: "Expenses",
    color: "var(--chart-5)",
  },
  TIncome: {
    label: "Income",
    color: "var(--chart-1)",
  },
  TSavings: {
    label: "Savings",
    color: "var(--chart-3)",
  },
  net_worth: {
      label: "Net Worth",
      color: "var(--chart-2)",
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
        .slice() // create a shallow copy to avoid mutating the original
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month) // sort by year, then month
        .map(item => ({
          ...item,
          month: monthNames[item.month] || String(item.month)
        }))
        .slice(-6) // Only keep the last 6 items (most recent)
    : [];
};

  const chartData = getChartData({ assets });

  const [datakey, setDatakey] = useState<string>("TExpense");
  const [instanceKey] = useState(() => Date.now());
  const [hasLoaded, setHasLoaded] = useState(false);
    
  useEffect(() => {
      if (chartData.length > 0) {
        setHasLoaded(true);
      }
    }, [chartData.length]);
  
  const chartKey = useMemo(() => Date.now(), [datakey, chartData]);

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
    {hasLoaded ? (
      <ChartContainer config={chartConfig} className="mx-auto max-h-[500px] w-full">
        <AreaChart
          key={chartKey}
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
            <linearGradient id="TExpense" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-TExpense)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-TExpense)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="TIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-TIncome)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-TIncome)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="TSavings" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-TSavings)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-TSavings)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="net_worth" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-net_worth)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-net_worth)"
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
            key={`${instanceKey}-${datakey}-${chartData.map(d => d.month).join('-')}`}
            type="linear"
            fill={`url(#${datakey})`}
            fillOpacity={.4}
            stroke={`var(--color-${datakey})`}
            strokeWidth={2}
            dot={{ fill: `var(--color-${datakey})` }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ChartContainer>
    ): null}
    </CardContent>
    </Card>
  );
}
