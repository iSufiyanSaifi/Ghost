import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { ChartCard } from "@/components/ghost/chart-card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const revenue = [
  { month: "Jun", revenue: 682000 },
  { month: "Jul", revenue: 745000 },
  { month: "Aug", revenue: 718000 },
  { month: "Sep", revenue: 836000 },
  { month: "Oct", revenue: 893000 },
  { month: "Nov", revenue: 946000 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ChartCardDemo() {
  return (
    <ChartCard
      className="w-full max-w-md"
      title="Revenue"
      subtitle="Last 6 months"
      value="₹48.2L"
      action={
        <Button variant="outline" size="sm">
          Export
        </Button>
      }
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-36 w-full">
        <AreaChart data={revenue} margin={{ left: 4, right: 4, top: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value) => (
                  <span className="font-medium tabular-nums">
                    ₹{Number(value).toLocaleString("en-IN")}
                  </span>
                )}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            fill="var(--color-revenue)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}
