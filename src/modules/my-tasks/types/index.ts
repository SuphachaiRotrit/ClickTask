import type { Task } from "@/types/task";

export interface StatusGroupProps {
  statusLabel: string;
  statusColor: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isDone: boolean;
}
