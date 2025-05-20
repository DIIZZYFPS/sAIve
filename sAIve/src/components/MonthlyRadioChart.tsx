"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"


import type { ChartConfig } from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { to: "Housing", expense: 186 },
  { to: "Bills", expense: 305 },
  { to: "Food", expense: 237 },
  { to: "Subscriptions", expense: 273 },
  { to: "Transportation", expense: 209 },
  { to: "Other", expense: 214 },
]

const chartConfig = {
  expense: {
    label: "Expense",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function MonthlyRadioChart() {
  return (
    
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px] w-full"
          
        >
          <RadarChart data={chartData} margin={{
              left: 20,
              right: 10,
                top: 10,
                bottom: 10,
            }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>} />
            <PolarAngleAxis dataKey="to" />
            <PolarGrid />
            <Radar
              dataKey="expense"
              fill="var(--color-expense)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
  )
}
