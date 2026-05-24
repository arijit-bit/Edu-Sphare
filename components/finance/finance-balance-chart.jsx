"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "#3d5af1",
  },
  expenses: {
    label: "Expenses",
    color: "#f97316",
  },
  surplus: {
    label: "Surplus",
    color: "#0d9488",
  },
};

export function FinanceBalanceChart({
  data,
  title,
  subtitle,
  className,
  valueFormatter = (value) => `₹${value}L`,
}) {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[260px] sm:h-[320px]">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/70" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            className="text-[11px] fill-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            width={56}
            className="text-[11px] fill-muted-foreground"
            tickFormatter={valueFormatter}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.15)" }}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `${title}: ${value}`}
                formatter={(value) => valueFormatter(value)}
                indicator="line"
              />
            }
          />
          <ChartLegend />
          <Bar
            dataKey="earnings"
            fill="var(--color-earnings)"
            radius={[8, 8, 0, 0]}
            barSize={22}
          />
          <Bar
            dataKey="expenses"
            fill="var(--color-expenses)"
            radius={[8, 8, 0, 0]}
            barSize={22}
          />
          <Line
            type="monotone"
            dataKey="surplus"
            stroke="var(--color-surplus)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-surplus)" }}
            activeDot={{ r: 5 }}
          />
        </BarChart>
      </ChartContainer>
      {subtitle ? (
        <p className="mt-3 text-xs font-medium text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
