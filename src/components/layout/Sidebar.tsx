"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TranslationKey } from "@/lib/i18n/translations";

const MENU_ITEMS = [
  {
    id: "dashboard",
    labelKey: "sidebar.dashboard" as TranslationKey,
    icon: "lucide:layout-dashboard",
    href: "/dashboard",
  },
  {
    id: "my-tasks",
    labelKey: "sidebar.myTasks" as TranslationKey,
    icon: "lucide:list-todo",
    href: "/my-tasks",
  },
  {
    id: "team",
    labelKey: "sidebar.team" as TranslationKey,
    icon: "lucide:users",
    href: "/team",
  },
  {
    id: "settings",
    labelKey: "sidebar.settings" as TranslationKey,
    icon: "lucide:settings",
    href: "/settings",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border/50",
          collapsed
            ? "flex-col gap-1 px-2 py-3 h-auto"
            : "h-14 justify-between px-3"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 min-w-0",
            collapsed && "justify-center"
          )}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Icon icon="lucide:zap" className="size-4" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold tracking-tight truncate animate-in fade-in slide-in-from-left-2 duration-200">
              ClickTask
            </span>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="size-7 shrink-0 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Icon
                icon={collapsed ? "lucide:panel-left-open" : "lucide:panel-left-close"}
                className="size-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          </TooltipContent>
        </Tooltip>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                icon={item.icon}
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-primary"
                )}
              />
              {!collapsed && (
                <span className="animate-in fade-in slide-in-from-left-2 duration-200">
                  {t(item.labelKey)}
                </span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {t(item.labelKey)}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.id}>{linkContent}</div>;
        })}
      </nav>
    </aside>
  );
}
