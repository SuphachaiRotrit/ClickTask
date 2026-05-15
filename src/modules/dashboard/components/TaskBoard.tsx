"use client";

import { useStatuses } from "@/lib/status-context";
import { TaskColumn } from "@/modules/dashboard/components/TaskColumn";
import type { Task, TaskStatus } from "@/types/task";

interface TaskBoardProps {
  tasksByStatus: Map<TaskStatus, Task[]>;
  activeStatusFilter?: TaskStatus | "all";
}

export function TaskBoard({ tasksByStatus, activeStatusFilter = "all" }: TaskBoardProps) {
  const { statuses } = useStatuses();

  const visibleStatuses = activeStatusFilter === "all"
    ? statuses
    : statuses.filter((s) => s.id === activeStatusFilter);
  const sortedStatuses = [...visibleStatuses].sort((a, b) => a.order - b.order);
  return (
    <div className="overflow-x-auto rounded-xl md:max-h-[calc(100vh-220px)] w-full custom-scrollbar pb-2">
      <div className="flex flex-col md:flex-row gap-4 pb-4 md:min-w-max">
        {sortedStatuses.map((statusConfig) => (
          <div key={statusConfig.id} className="w-full md:w-[320px] md:shrink-0">
            <TaskColumn
              statusConfig={statusConfig}
              tasks={tasksByStatus.get(statusConfig.id) || []}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
