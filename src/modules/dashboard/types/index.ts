import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskAssignee,
  TaskLink,
} from "@/types/task";

export interface TaskFilters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
}

export interface PropertyRowProps {
  icon: string;
  label: string;
  children: React.ReactNode;
}

export interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface TaskDetailFormValues {
  status: string;
  priority: TaskPriority;
  assignees: TaskAssignee[];
  dueDate: string | null;
  tags: string[];
  description: string;
  links: TaskLink[];
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
