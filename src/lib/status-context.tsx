"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { StatusConfig } from "@/types/task";

const DEFAULT_STATUSES: StatusConfig[] = [
  {
    id: "todo",
    label: "To Do",
    color: "#3b82f6",
    order: 1,
    isDone: false,
  },
  {
    id: "in_progress",
    label: "In Progress",
    color: "#f59e0b",
    order: 2,
    isDone: false,
  },
  {
    id: "done",
    label: "Done",
    color: "#10b981",
    order: 3,
    isDone: true,
  },
];

interface StatusContextValue {
  statuses: StatusConfig[];
  addStatus: (label: string, color: string, isDone?: boolean) => boolean;
  updateStatus: (id: string, label: string, color: string) => boolean;
  removeStatus: (id: string) => void;
  reorderStatus: (id: string, direction: "up" | "down") => void;
  toggleIsDone: (id: string) => void;
  isColorTaken: (color: string, excludeId?: string) => boolean;
  isDoneStatus: (statusId: string) => boolean;
}

const StatusContext = createContext<StatusContextValue | null>(null);

export function StatusProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<StatusConfig[]>(DEFAULT_STATUSES);

  const isColorTaken = useCallback(
    (color: string, excludeId?: string) => {
      return statuses.some(
        (s) =>
          s.color.toLowerCase() === color.toLowerCase() && s.id !== excludeId
      );
    },
    [statuses]
  );

  const isDoneStatus = useCallback(
    (statusId: string) => {
      return statuses.find((s) => s.id === statusId)?.isDone ?? false;
    },
    [statuses]
  );

  const generateId = (label: string) => {
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
    return slug || `status_${Date.now().toString(36)}`;
  };

  const addStatus = useCallback(
    (label: string, color: string, isDone: boolean = false): boolean => {
      if (isColorTaken(color)) return false;
      if (!label.trim()) return false;

      const id = generateId(label);
      if (statuses.some((s) => s.id === id)) return false;

      const maxOrder = Math.max(...statuses.map((s) => s.order), 0);
      setStatuses((prev) => [
        ...prev,
        { id, label: label.trim(), color, order: maxOrder + 1, isDone },
      ]);
      return true;
    },
    [statuses, isColorTaken]
  );

  const updateStatus = useCallback(
    (id: string, label: string, color: string): boolean => {
      if (isColorTaken(color, id)) return false;
      if (!label.trim()) return false;

      setStatuses((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, label: label.trim(), color } : s
        )
      );
      return true;
    },
    [isColorTaken]
  );

  const toggleIsDone = useCallback((id: string) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s))
    );
  }, []);

  const removeStatus = useCallback((id: string) => {
    setStatuses((prev) => prev.filter((s) => s.id !== id));
  }, []);
  const reorderStatus = useCallback(
    (id: string, direction: "up" | "down") => {
      setStatuses((prev) => {
        const sorted = [...prev].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex((s) => s.id === id);
        if (index === -1) return prev;

        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= sorted.length) return prev;

        const tempOrder = sorted[index].order;
        sorted[index] = { ...sorted[index], order: sorted[swapIndex].order };
        sorted[swapIndex] = { ...sorted[swapIndex], order: tempOrder };

        return sorted;
      });
    },
    []
  );

  return (
    <StatusContext.Provider
      value={{
        statuses,
        addStatus,
        updateStatus,
        removeStatus,
        reorderStatus,
        toggleIsDone,
        isColorTaken,
        isDoneStatus,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export function useStatuses() {
  const ctx = useContext(StatusContext);
  if (!ctx) {
    throw new Error("useStatuses must be used within a StatusProvider");
  }
  return ctx;
}
