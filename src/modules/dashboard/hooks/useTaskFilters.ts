"use client";

import { useState, useMemo, useCallback } from "react";
import type { Task, TaskStatus } from "@/types/task";
import type { TaskFilters } from "@/modules/dashboard/types";
import { useStatuses } from "@/lib/status-context";

export function useTaskFilters(tasks: Task[]) {
  const { statuses } = useStatuses();

  const [filters, setFilters] = useState<TaskFilters>({
    search: "",
    status: "all",
    priority: "all",
  });

  const updateFilter = useCallback(
    <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({ search: "", status: "all", priority: "all" });
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const grouped = new Map<TaskStatus, Task[]>();

    statuses.forEach((config) => {
      grouped.set(config.id, []);
    });

    filteredTasks.forEach((task) => {
      const existing = grouped.get(task.status) || [];
      grouped.set(task.status, [...existing, task]);
    });

    return grouped;
  }, [filteredTasks, statuses]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredTasks,
    tasksByStatus,
  };
}
