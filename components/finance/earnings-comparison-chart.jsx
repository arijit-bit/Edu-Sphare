"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
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
  current: {
    label: "Current Year",
    color: "#3d5af1",
  },
  previous: {
    label: "Previous Year",
    color: "#0d9488",
  },
};

function formatCompactCurrency(value) {
  return `₹${value}k`;
}

export function EarningsComparisonChart({
  data,
  title,
  subtitle,
  className,
}) {
  return (
    <div className={className}>
      <ChartContainer config={chartConfig} className="h-[240px] sm:h-[280px]">
        <AreaChart
          data={data}
          margin={{ top: 12, right: 8, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="earnings-current-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-current)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-current)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/70" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            minTickGap={18}
            className="text-[11px] fill-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            width={42}
            className="text-[11px] fill-muted-foreground"
            tickFormatter={formatCompactCurrency}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `${title}: ${value}`}
                formatter={(value) => formatCompactCurrency(value)}
              />
            }
          />
          <ChartLegend />
          <Area
            type="monotone"
            dataKey="current"
            stroke="var(--color-current)"
            strokeWidth={3}
            fill="url(#earnings-current-fill)"
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="var(--color-previous)"
            strokeWidth={2.5}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
      {subtitle ? (
        <p className="mt-3 text-xs font-medium text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
