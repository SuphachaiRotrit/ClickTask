import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/language-context";
import { useTasks } from "@/lib/task-context";
import type { Task, StatusConfig } from "@/types/task";

interface TaskDetailSubtasksProps {
  task: Task;
  progress: number;
  completedCount: number;
  totalCount: number;
  statusConfig?: StatusConfig;
}

export function TaskDetailSubtasks({
  task,
  progress,
  completedCount,
  totalCount,
  statusConfig,
}: TaskDetailSubtasksProps) {
  // console.log("🫨 ~ TaskDetailSubtasks ~ task:", task)
  const { t } = useLanguage();
  const { addSubtask, toggleSubtask, removeSubtask } = useTasks();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    // console.log("🫨 ~ handleAddSubtask ~ newSubtaskTitle:", newSubtaskTitle)
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  return (
    <>
      <div className="px-5 sm:px-8 py-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:list-checks" className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">{t("task.subtasks")}</span>
            <span className="text-xs text-muted-foreground">
              {completedCount} {t("common.complete")}
            </span>
          </div>

          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: statusConfig?.color || "#94a3b8",
                  }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: statusConfig?.color || "#94a3b8" }}>
                {progress}%
              </span>
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="space-y-1 mb-3">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className={cn(
                  "group/st flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/60",
                  subtask.completed && "opacity-60"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(task.id, subtask.id)}
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors cursor-pointer",
                    subtask.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {subtask.completed && <Icon icon="lucide:check" className="size-3" />}
                </button>
                <span className={cn("flex-1", subtask.completed && "line-through")}>
                  {subtask.title}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubtask(task.id, subtask.id)}
                  className="opacity-0 group-hover/st:opacity-100 transition-opacity text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Icon icon="lucide:x" className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Icon icon="lucide:plus" className="size-4 text-muted-foreground shrink-0" />
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubtask();
            }}
            placeholder={t("task.addSubtask")}
            className="h-8 text-sm border-dashed"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 shrink-0"
            onClick={handleAddSubtask}
            disabled={!newSubtaskTitle.trim()}
          >
            {t("common.add")}
          </Button>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-4 border-t bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  backgroundColor: statusConfig?.color || "#94a3b8",
                }}
              />
            </div>
          </div>
          <span
            className="text-sm font-bold shrink-0 w-12 text-right"
            style={{ color: statusConfig?.color || "#94a3b8" }}
          >
            {progress}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 pl-0.5">
          {progress === 100
            ? `${t("task.taskCompleted")}`
            : progress === 0
              ? t("task.taskNotStarted")
              : `${completedCount} ${t("common.of")} ${totalCount} ${t("task.subtasksComplete")} · ${100 - progress}% ${t("common.remaining")}`}
        </p>
      </div>
    </>
  );
}
