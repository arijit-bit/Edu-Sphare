"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex h-[260px] min-w-0 w-full items-center justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {mounted ? (
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        ) : null}
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(([, value]) => value.color || value.theme);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
  indicator = "dot",
  className,
  hideLabel = false,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-xl border bg-background/95 px-3 py-2 shadow-xl backdrop-blur",
        className
      )}
    >
      {hideLabel ? null : (
        <div className="mb-2 text-xs font-semibold text-muted-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((item) => {
          const itemKey = item.dataKey;
          const itemConfig = config[itemKey] || {};
          const itemColor = item.color || item.payload.fill;
          const formattedValue = formatter
            ? formatter(item.value, itemKey, item)
            : item.value;

          return (
            <div key={itemKey} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {indicator === "dot" ? (
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: itemColor }}
                  />
                ) : (
                  <span
                    className="h-2 w-2.5 rounded-sm"
                    style={{ backgroundColor: itemColor }}
                  />
                )}
                <span className="font-medium text-foreground">
                  {itemConfig.label || item.name}
                </span>
              </div>
              <span className="font-bold text-foreground">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({ className, ...props }) {
  return (
    <RechartsPrimitive.Legend
      verticalAlign="bottom"
      align="left"
      iconType="circle"
      wrapperStyle={{ paddingTop: 16, paddingLeft: 8, paddingRight: 8 }}
      content={(contentProps) => (
        <ChartLegendContent className={className} {...contentProps} />
      )}
      {...props}
    />
  );
}

function ChartLegendContent({ payload, className }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2 pl-1", className)}>
      {payload.map((item) => {
        const itemKey = item.dataKey;
        const itemConfig = config[itemKey] || {};

        return (
          <div key={item.value} className="flex items-center gap-2 text-xs font-semibold">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">
              {itemConfig.label || item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
