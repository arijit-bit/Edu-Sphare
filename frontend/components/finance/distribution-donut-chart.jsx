"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DistributionDonutChart({
  data,
  centerLabel,
  footerLabel,
  className,
}) {
  const totalValue = React.useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const chartConfig = React.useMemo(() => {
    return data.reduce(
      (config, item) => {
        config[item.key] = {
          label: item.label,
          color: item.color,
        };
        return config;
      },
      {}
    );
  }, [data]);

  return (
    <ChartContainer
      config={chartConfig}
      className={className || "mx-auto aspect-square h-[220px] max-h-[250px]"}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => `${value}%`}
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          stroke="none"
          strokeWidth={0}
        >
          {data.map((item) => (
            <Cell key={item.key} fill={item.color} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {centerLabel || totalValue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 22}
                      className="fill-muted-foreground text-[11px]"
                    >
                      {footerLabel}
                    </tspan>
                  </text>
                );
              }

              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
