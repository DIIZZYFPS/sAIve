"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"


import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"


const chartConfig = {
  expense: {
    label: "Expense",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function MonthlyRadioChart() {


  const {
    data: categories = [],
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/user_assets/1/category");
      return response.data;
    },
  });

  const chartData = categories.filter((c: { category: string }) => c.category !== "Income");
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
      if (chartData.length > 0) {
        setHasLoaded(true);
      }
    }, [chartData.length]);

  return (
    hasLoaded ? (
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[500px] w-full"
      >
        <RadarChart data={chartData} margin={{
                left: 30,
                right: 10,
                  top: 10,
                  bottom: 10,
              }}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>} />
              <PolarAngleAxis dataKey="category" />
              <PolarGrid />
              <Radar
                dataKey="Amount"
                fill="var(--color-expense)"
                fillOpacity={0.6}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ChartContainer>
    ) : null
  );
}


