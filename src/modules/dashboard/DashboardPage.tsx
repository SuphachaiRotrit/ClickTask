"use client";

import { useTasks } from "@/lib/task-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useTaskFilters } from "@/modules/dashboard/hooks/useTaskFilters";
import { TaskFiltersBar } from "@/modules/dashboard/components/TaskFilters";
import { TaskBoard } from "@/modules/dashboard/components/TaskBoard";
import { NewTaskDialog } from "@/modules/dashboard/components/NewTaskDialog";

export function DashboardPage() {
  const { tasks } = useTasks();
  const { t } = useLanguage();
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredTasks,
    tasksByStatus,
  } = useTaskFilters(tasks);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <NewTaskDialog />
      </div>

      <TaskFiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        totalCount={tasks.length}
        filteredCount={filteredTasks.length}
      />

      <TaskBoard tasksByStatus={tasksByStatus} activeStatusFilter={filters.status} />
    </div>
  );
}
