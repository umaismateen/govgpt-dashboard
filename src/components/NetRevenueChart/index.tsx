"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface RevenueData {
  month: string;
  netVolume: number;
}

interface TotalNetRevenueChartProps {
  data: RevenueData[];
}

function TotalNetRevenueChart({ data }: TotalNetRevenueChartProps) {

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.netVolume, 0);
  }, [data]);

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `AED ${(value / 1000).toFixed(1)}k`;
    }
    return `AED ${value}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Net Revenue</CardTitle>
        <CardDescription>Net revenue for the last 12 months</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            netVolume: {
              label: "Net Revenue",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="max-h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleString("default", { month: "short" });
                }}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="netVolume"
                fill="var(--color-netVolume)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TotalNetRevenueChart;
