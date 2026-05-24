"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { summaryTabs } from "@/app/finance/summary/summary-data";
import { cn } from "@/lib/utils";

export function SummarySectionNav() {
  const pathname = usePathname() || "";

  return (
    <div className="rounded-2xl border bg-card/70 p-1 shadow-sm">
      <div className="grid gap-1 sm:grid-cols-3">
        {summaryTabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
