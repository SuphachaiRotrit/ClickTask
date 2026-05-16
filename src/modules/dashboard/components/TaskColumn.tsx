"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { hexToRgb, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/modules/dashboard/components/TaskCard";
import { useColumnPagination } from "@/modules/dashboard/hooks/useColumnPagination";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Task, StatusConfig } from "@/types/task";

const COLUMN_PAGE_SIZE = 5; // อันนี้คือกำหนดว่าต่อ status มันมี card task ได้สูงสุดที่จะแสดงแต่ละ page กี่ card เผื่อลืม

interface TaskColumnProps {
  statusConfig: StatusConfig;
  tasks: Task[];
  pageSize?: number;
  isFiltered?: boolean;
}

export function TaskColumn({
  statusConfig,
  tasks,
  pageSize: propPageSize,
  isFiltered = false,
}: TaskColumnProps) {
  const pageSize = propPageSize || (isFiltered ? 20 : COLUMN_PAGE_SIZE);
  const rgb = hexToRgb(statusConfig.color);
  const { t } = useLanguage();

  const {
    paginatedResult,
    nextPage,
    prevPage,
    goToPage,
  } = useColumnPagination(tasks, pageSize);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: visibleTasks, page, totalPages, totalItems } = paginatedResult;
  const showPagination = totalPages > 1;

  return (
    <div
      className="flex flex-col rounded-xl p-3"
      style={{
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`,
        border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
      }}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all select-none",
          "cursor-pointer md:cursor-default",
          !isCollapsed ? "mb-4" : "md:mb-4"
        )}
        style={{
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
        }}
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) {
            setIsCollapsed(!isCollapsed);
          }
        }}
      >
        <div
          className="size-2.5 rounded-full"
          style={{ backgroundColor: statusConfig.color }}
        />
        <h3
          className="text-sm font-semibold truncate flex-1"
          style={{ color: statusConfig.color }}
        >
          {statusConfig.label}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
              color: statusConfig.color,
            }}
          >
            {totalItems}
          </span>
          <Icon
            icon="lucide:chevron-down"
            className={cn(
              "size-4 transition-transform duration-200 shrink-0 opacity-60 md:hidden",
              isCollapsed && "-rotate-90 opacity-100"
            )}
            style={{ color: statusConfig.color }}
          />
        </div>
      </div>

      <div className={cn(isCollapsed && "hidden md:block")}>
        <div className={cn(
          "flex flex-col gap-3",
          isFiltered && "md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}>
          {visibleTasks.length === 0 ? (
            <div
              className="flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground"
              style={{
                borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
              }}
            >
              {t("dashboard.noTasks")}
            </div>
          ) : (
            visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>

        {showPagination && (
          <div
            className="mt-3 flex items-center justify-between rounded-lg px-2 py-1.5"
            style={{
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.06)`,
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={prevPage}
              disabled={page <= 1}
            >
              <Icon icon="lucide:chevron-left" className="size-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className="flex items-center justify-center rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                  style={{
                    width: p === page ? "24px" : "18px",
                    height: "20px",
                    backgroundColor:
                      p === page
                        ? statusConfig.color
                        : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
                    color: p === page ? "#fff" : statusConfig.color,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={nextPage}
              disabled={page >= totalPages}
            >
              <Icon icon="lucide:chevron-right" className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
