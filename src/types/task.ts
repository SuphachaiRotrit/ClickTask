export type TaskStatus = string;

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskLink {
  id: string;
  url: string;
  label: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  images: string[];
  links: TaskLink[];
  status: TaskStatus;
  priority: TaskPriority;
  assignees: TaskAssignee[];
  dueDate: string | null;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignee {
  id: string;
  name: string;
  avatar: string | null;
}

export interface StatusConfig {
  id: TaskStatus;
  label: string;
  color: string;
  order: number;
  isDone: boolean;
}

export interface PriorityConfig {
  id: TaskPriority;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}
