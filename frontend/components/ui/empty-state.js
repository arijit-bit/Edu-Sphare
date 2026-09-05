import * as React from "react"
import { cn } from "@/lib/utils"

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px] rounded-xl border border-dashed bg-muted/20", className)}>
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
