"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, GraduationCap, Users, CreditCard, BarChart3,
  Settings, Bell, Search, Shield, LogOut, Menu, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/api";

function getNavItems(schoolSlug) {
  const base = `/${schoolSlug}/admin`;
  return [
    { label: "Dashboard", href: `${base}/dashboard`, icon: LayoutDashboard },
    { label: "Students",  href: `${base}/students`,  icon: GraduationCap   },
    { label: "Teachers",  href: `${base}/teachers`,  icon: Users           },
    { label: "Finance",   href: `/${schoolSlug}/finance/dashboard`, icon: CreditCard },
    { label: "Analytics", href: `${base}/analytics`, icon: BarChart3       },
    { label: "Settings",  href: `${base}/settings`,  icon: Settings        },
  ];
}

/* ── Sidebar Content ── */
function SidebarContent({ pathname, onNav }) {
  const { schoolSlug = "demo-school" } = useParams() || {};
  const navItems = getNavItems(schoolSlug);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-rose-600 text-white">
          <Shield className="size-4" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Edu Sphare</p>
          <p className="text-[11px] text-muted-foreground">Admin Portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href + item.label} href={item.href} onClick={onNav}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-rose-600 text-white shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}>
              <Icon className="size-4" />
              {item.label}
              {active && <ChevronRight className="ml-auto size-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-rose-600 text-white text-xs font-bold">SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Super Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@edusphare.edu</p>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={logout} aria-label="Logout"><LogOut className="size-3.5 text-muted-foreground" /></Button>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, title = "Admin Dashboard" }) {
  const { schoolSlug = "demo-school" } = useParams() || {};
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card z-40">
        <SidebarContent pathname={pathname} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle></SheetHeader>
          <SidebarContent pathname={pathname} onNav={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-3 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0 size-8" onClick={() => setMobileOpen(true)} aria-label="Open Menu"><Menu className="size-4" /></Button>
          <h1 className="text-sm font-semibold truncate flex-1 min-w-0">{title}</h1>
          <div className="ml-auto flex items-center gap-1">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input className="pl-9 h-8 w-56 text-sm" placeholder="Search students, staff…" />
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative shrink-0 size-9" aria-label="Notifications">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-rose-500" />
            </Button>
            <Avatar className="size-8 cursor-pointer shrink-0">
              <AvatarFallback className="bg-rose-600 text-white text-xs font-bold">SA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 space-y-6 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
