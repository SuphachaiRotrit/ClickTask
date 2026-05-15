"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Task, TaskAssignee, TaskPriority, TaskStatus, Subtask, TaskLink } from "@/types/task";
import { MOCK_TASKS } from "@/data/mock-tasks";

interface CreateTaskInput {
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
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  images?: string[];
  links?: TaskLink[];
  status?: TaskStatus;
  priority?: TaskPriority;
  assignees?: TaskAssignee[];
  dueDate?: string | null;
  tags?: string[];
}

interface TaskContextValue {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  removeSubtask: (taskId: string, subtaskId: string) => void;
  addImage: (taskId: string, imageDataUrl: string) => void;
  removeImage: (taskId: string, index: number) => void;
  addLink: (taskId: string, url: string, label: string) => void;
  removeLink: (taskId: string, linkId: string) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const genId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addTask = useCallback((input: CreateTaskInput): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: genId(),
      title: input.title,
      description: input.description,
      images: input.images,
      links: input.links,
      status: input.status,
      priority: input.priority,
      assignees: input.assignees,
      dueDate: input.dueDate,
      tags: input.tags,
      subtasks: input.subtasks,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...input, updatedAt: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            subtasks: [
              ...t.subtasks,
              {
                id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                title,
                completed: false,
              } as Subtask,
            ],
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const removeSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const addImage = useCallback((taskId: string, imageDataUrl: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            images: [...t.images, imageDataUrl],
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const removeImage = useCallback((taskId: string, index: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            images: t.images.filter((_, i) => i !== index),
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const addLink = useCallback((taskId: string, url: string, label: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            links: [
              ...t.links,
              {
                id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                url,
                label: label || url,
              } as TaskLink,
            ],
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  const removeLink = useCallback((taskId: string, linkId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
            ...t,
            links: t.links.filter((l) => l.id !== linkId),
            updatedAt: new Date().toISOString(),
          }
          : t
      )
    );
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        addSubtask,
        toggleSubtask,
        removeSubtask,
        addImage,
        removeImage,
        addLink,
        removeLink,
        selectedTaskId,
        setSelectedTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return ctx;
}
