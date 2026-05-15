import type { Subtask } from "@/types/task";

export function computeProgress(subtasks: Subtask[]): number {
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter((s) => s.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

export function getProgressColor(p: number): string {
  if (p === 100) return "#10b981";
  if (p >= 60) return "#3b82f6";
  if (p >= 30) return "#f59e0b";
  return "#94a3b8";
}

export function isOverdue(dueDate: string | null, isDone: boolean): boolean {
  if (!dueDate || isDone) return false;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}
