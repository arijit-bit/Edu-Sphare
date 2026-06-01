"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 [--rdp-accent-color:var(--primary)] [--rdp-accent-background-color:color-mix(in_oklab,var(--primary)_18%,transparent)]",
        className
      )}
      classNames={{
        root: "rdp-root relative",
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "relative flex items-center justify-center px-9 pt-1 min-h-8",
        caption_label: "hidden",
        dropdowns: "flex items-center gap-1",
        dropdown: "text-sm font-semibold bg-transparent border-0 cursor-pointer focus:outline-none text-foreground",
        nav: "absolute top-[10px] left-0 right-0 flex justify-between px-3 z-10",
        button_previous:
          "inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted",
        button_next:
          "inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "w-9 text-[0.8rem] font-medium text-muted-foreground",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-md border border-transparent text-sm font-normal text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-selected:border-primary aria-selected:bg-primary aria-selected:text-primary-foreground",
        today: "text-cyan-500 font-semibold",
        selected:
          "font-semibold",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className={cn("size-4", iconClassName)} {...iconProps} />
          ) : (
            <ChevronRightIcon className={cn("size-4", iconClassName)} {...iconProps} />
          ),
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }
