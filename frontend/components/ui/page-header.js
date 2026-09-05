import * as React from "react"
import { cn } from "@/lib/utils"

export function PageHeader({ 
  title, 
  description, 
  children,
  className 
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold tracking-tight truncate">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
