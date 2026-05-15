"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { useStatuses } from "@/lib/status-context";
import { useTasks } from "@/lib/task-context";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Task } from "@/types/task";
import { computeProgress, isOverdue } from "@/modules/dashboard/utils/task-helpers";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  // console.log("🫨 ~ TaskCard ~ task:", task)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { statuses, isDoneStatus } = useStatuses();
  const { deleteTask, setSelectedTaskId } = useTasks();
  const { t, locale } = useLanguage();
  const priorityConfig = PRIORITY_CONFIGS.find((p) => p.id === task.priority);
  const statusConfig = statuses.find((s) => s.id === task.status);

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      month: "short",
      day: "numeric",
    })
    : null;

  const taskOverdue = isOverdue(task.dueDate, isDoneStatus(task.status));

  const progress = isDoneStatus(task.status)
    ? 100
    : computeProgress(task.subtasks);

  return (
    <>
      <div
        className="group rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer"
        onClick={() => setSelectedTaskId(task.id)}
      >
        <div className="mb-3 flex items-start justify-between">
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider",
              priorityConfig?.bgColor,
              priorityConfig?.color
            )}
          >
            <Icon icon={priorityConfig?.icon || "lucide:flag"} className="size-3 mr-1" />
            {priorityConfig?.label}
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen(true);
            }}
          >
            <Icon icon="lucide:trash-2" className="size-4" />
          </Button>
        </div>

        <h4 className="mb-1.5 text-sm font-semibold leading-tight text-card-foreground line-clamp-2">
          {task.title}
        </h4>

        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        {task.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                <Icon icon="lucide:tag" className="size-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Icon icon="lucide:list-checks" className="size-3" />
                {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
              </span>
              {task.links.length > 0 && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Icon icon="lucide:link" className="size-3" />
                  {task.links.length}
                </span>
              )}
              <span
                className="text-[10px] font-bold ml-auto"
                style={{ color: statusConfig?.color || "#94a3b8" }}
              >
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: statusConfig?.color || "#94a3b8",
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {formattedDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px]",
                taskOverdue
                  ? "font-medium text-destructive"
                  : "text-muted-foreground"
              )}
            >
              <Icon icon="lucide:calendar" className="size-3" />
              {formattedDate}
            </span>
          )}
          {!formattedDate && <div />}

          {task.assignees.length > 0 && (
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 3).map((a) => {
                const ini = a.name.split(" ").map((n: string) => n[0]).join("");
                return (
                  <Avatar key={a.id} className="size-6 border-2 border-card">
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-semibold">
                      {ini}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {task.assignees.length > 3 && (
                <span className="flex items-center justify-center size-6 rounded-full bg-muted text-[9px] font-bold text-muted-foreground border-2 border-card">
                  +{task.assignees.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("task.deleteTask")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("task.deleteTaskConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => deleteTask(task.id)}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
