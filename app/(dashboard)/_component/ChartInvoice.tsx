"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button"

export const description = "An interactive area chart"




interface InvoiceData {
  date: string
  totalRevenue: number
  paidRevenue: number
}

interface IChartInvoice {
  chartData: InvoiceData[]
  chartConfig: ChartConfig
}


export function ChartInvoice({ chartData, chartConfig }: IChartInvoice) {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData?.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="p-0 col-span-2">
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">

        <div className="flex gap-2 mb-4">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
          >
            7d
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
          >
            30d
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
          >
            90d
          </Button>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-80 lg:h-96 w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotalRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalRevenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalRevenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPaidRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-paidRevenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-paidRevenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="paidRevenue"
              type="natural"
              fill="url(#fillPaidRevenue)"
              stroke="var(--color-paidRevenue)"
              stackId="a"
              name="Paid Revenue"
            />
            <Area
              dataKey="totalRevenue"
              type="natural"
              fill="url(#fillTotalRevenue)"
              stroke="var(--color-totalRevenue)"
              stackId="a"
              name="Total Revenue"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
