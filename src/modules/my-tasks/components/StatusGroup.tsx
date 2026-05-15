"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { computeProgress, isOverdue } from "@/modules/dashboard/utils/task-helpers";
import { useLanguage } from "@/lib/i18n/language-context";
import type { StatusGroupProps } from "@/modules/my-tasks/types";

export function StatusGroup({
  statusLabel,
  statusColor,
  tasks,
  onTaskClick,
  isDone,
}: StatusGroupProps) {
  // console.log("🫨 ~ StatusGroup ~ onTaskClick:", onTaskClick)
  // console.log("🫨 ~ StatusGroup ~ tasks:", tasks)
  const { t, locale } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 py-2 px-1 w-full hover:bg-muted/30 rounded-md transition-colors cursor-pointer"
      >
        <Icon
          icon={collapsed ? "lucide:chevron-right" : "lucide:chevron-down"}
          className="size-4 text-muted-foreground"
        />
        <Badge
          className="text-xs font-semibold px-2.5 py-0.5 border-0"
          style={{ backgroundColor: statusColor, color: "#fff" }}
        >
          {statusLabel}
        </Badge>
        <span className="text-xs text-muted-foreground font-medium">
          {tasks.length}
        </span>
      </button>

      {!collapsed && (
        <>
          <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b">
            <div className="col-span-4 sm:col-span-5">{t("common.name")}</div>
            <div className="col-span-2 hidden sm:block">{t("prop.assignees")}</div>
            <div className="col-span-2">{t("prop.priority")}</div>
            <div className="col-span-2">{t("prop.dueDate")}</div>
            <div className="col-span-2 sm:col-span-1">{t("prop.progress")}</div>
          </div>

          {tasks.map((task) => {
            const priorityConfig = PRIORITY_CONFIGS.find(
              (p) => p.id === task.priority
            );
            const progress = isDone ? 100 : computeProgress(task.subtasks);
            const dueFormatted = task.dueDate
              ? new Date(task.dueDate).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
                month: "numeric",
                day: "numeric",
                year: "2-digit",
              })
              : "";
            const overdue = isOverdue(task.dueDate, isDone);

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onTaskClick(task)}
                className="grid grid-cols-12 gap-2 px-3 py-2.5 w-full text-left hover:bg-muted/40 border-b border-border/50 transition-colors cursor-pointer group"
              >
                <div className="col-span-4 sm:col-span-5 flex items-center gap-2 min-w-0">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {task.title}
                  </span>
                </div>

                <div className="col-span-2 hidden sm:flex items-center">
                  {task.assignees.length > 0 ? (
                    <div className="flex -space-x-1">
                      {task.assignees.slice(0, 2).map((a) => {
                        const ai = a.name.split(" ").map((n: string) => n[0]).join("");
                        return (
                          <Avatar key={a.id} className="size-5 border border-card">
                            <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-bold">
                              {ai}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {task.assignees.length > 2 && (
                        <span className="flex items-center justify-center size-5 rounded-full bg-muted text-[8px] font-bold text-muted-foreground border border-card">
                          +{task.assignees.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Icon
                      icon="lucide:user"
                      className="size-4 text-muted-foreground/30"
                    />
                  )}
                </div>

                <div className="col-span-2 flex items-center gap-1">
                  <Icon
                    icon="lucide:flag"
                    className={cn("size-3.5", priorityConfig?.color)}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      priorityConfig?.color
                    )}
                  >
                    {priorityConfig?.label}
                  </span>
                </div>

                <div className="col-span-2 flex items-center">
                  <span
                    className={cn(
                      "text-xs",
                      overdue
                        ? "text-destructive font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {dueFormatted || "—"}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: statusColor }}
                  >
                    {progress}%
                  </span>
                </div>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
