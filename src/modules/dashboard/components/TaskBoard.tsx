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

  const desktopCols = Math.min(sortedStatuses.length, 4);

  return (
    <div className="overflow-x-auto rounded-xl md:max-h-[calc(100vh-220px)] md:overflow-y-auto">
      <div
        className="task-board-grid pb-4"
        style={{ "--board-cols": desktopCols } as React.CSSProperties}
      >
        {sortedStatuses.map((statusConfig) => (
          <TaskColumn
            key={statusConfig.id}
            statusConfig={statusConfig}
            tasks={tasksByStatus.get(statusConfig.id) || []}
          />
        ))}
      </div>
    </div>
  );
}
