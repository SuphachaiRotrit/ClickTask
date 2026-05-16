"use client";

import { useStatuses } from "@/lib/status-context";
import { TaskColumn } from "@/modules/dashboard/components/TaskColumn";
import type { Task, TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskBoardProps {
  tasksByStatus: Map<TaskStatus, Task[]>;
  activeStatusFilter?: TaskStatus | "all";
}

export function TaskBoard({ tasksByStatus, activeStatusFilter = "all" }: TaskBoardProps) {
  const { statuses } = useStatuses();

  const isFiltered = activeStatusFilter !== "all";
  const visibleStatuses = isFiltered
    ? statuses.filter((s) => s.id === activeStatusFilter)
    : statuses;
    
  const sortedStatuses = [...visibleStatuses].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto rounded-xl md:max-h-[calc(100vh-220px)] w-full custom-scrollbar pb-2">
      <div className={cn(
        "flex flex-col gap-4 pb-4",
        isFiltered ? "w-full" : "md:flex-row md:min-w-max"
      )}>
        {sortedStatuses.map((statusConfig) => (
          <div 
            key={statusConfig.id} 
            className={cn(
              "w-full md:shrink-0",
              !isFiltered && "md:w-[320px]"
            )}
          >
            <TaskColumn
              statusConfig={statusConfig}
              tasks={tasksByStatus.get(statusConfig.id) || []}
              isFiltered={isFiltered}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
