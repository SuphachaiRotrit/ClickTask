"use client";

import { Icon } from "@iconify/react";
import { useTasks } from "@/lib/task-context";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { CURRENT_USER } from "@/data/team-members";
import { StatusGroup } from "@/modules/my-tasks/components/StatusGroup";

export function MyTasksPage() {
  const { tasks, setSelectedTaskId } = useTasks();
  const { statuses } = useStatuses();
  const { t } = useLanguage();

  const myTasks = tasks.filter(
    (t) => t.assignees.some((a) => a.id === CURRENT_USER.id)
  );
  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);
  const groupedTasks = sortedStatuses
    .map((s) => ({
      status: s,
      tasks: myTasks.filter((t) => t.status === s.id),
    }))
    .filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          {t("myTasks.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("myTasks.subtitle")} · {myTasks.length} {t("myTasks.total")}
        </p>
      </div>

      {myTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <Icon
            icon="lucide:inbox"
            className="mb-4 size-12 text-muted-foreground/40"
          />
          <h3 className="text-lg font-semibold text-muted-foreground">
            {t("myTasks.noTasks")}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground/60">
            {t("myTasks.noTasksDesc")}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          {groupedTasks.map(({ status, tasks: groupTasks }) => (
            <StatusGroup
              key={status.id}
              statusLabel={status.label}
              statusColor={status.color}
              tasks={groupTasks}
              isDone={status.isDone}
              onTaskClick={(t) => setSelectedTaskId(t.id)}
            />
          ))}
        </div>
      )}


    </div>
  );
}
