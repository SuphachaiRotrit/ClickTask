"use client";

import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TaskPriority, TaskStatus } from "@/types/task";
import type { TaskFilters } from "@/modules/dashboard/types";

interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: <K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K]
  ) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function TaskFiltersBar({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}: TaskFiltersProps) {
  const { statuses } = useStatuses();
  const { t } = useLanguage();

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("dashboard.searchPlaceholder")}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-1 sm:flex-initial">
          <Select
            value={filters.status}
            onValueChange={(value) =>
              onFilterChange("status", value as TaskStatus | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] md:w-[150px] shrink-0">
              <Icon icon="lucide:circle-dot" className="mr-1.5 size-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder={t("filter.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.allStatus")}</SelectItem>
              {statuses.filter((s) => s.id).map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.priority}
            onValueChange={(value) =>
              onFilterChange("priority", value as TaskPriority | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[130px] md:w-[150px] shrink-0">
              <Icon icon="lucide:flag" className="mr-1.5 size-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder={t("filter.priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("dashboard.allPriority")}</SelectItem>
              {PRIORITY_CONFIGS.map((priority) => (
                <SelectItem key={priority.id} value={priority.id}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1 text-muted-foreground hover:text-foreground shrink-0 h-9 px-3 sm:px-2 sm:h-8 w-full sm:w-auto mt-1 sm:mt-0"
          >
            <Icon icon="lucide:rotate-ccw" className="size-3.5 sm:size-3" />
            <span className="text-sm sm:text-xs font-medium">{t("filter.clear")}</span>
          </Button>
        )}
      </div>
      {hasActiveFilters && (
        <p className="text-xs text-muted-foreground">
          {t("filter.showing")} {filteredCount} {t("common.of")} {totalCount} {t("filter.tasks")}
        </p>
      )}
    </div>
  );
}
