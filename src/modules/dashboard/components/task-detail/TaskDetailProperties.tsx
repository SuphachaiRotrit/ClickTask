import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { TEAM_MEMBERS, CURRENT_USER } from "@/data/team-members";
import { useStatuses } from "@/lib/status-context";
import { isOverdue } from "@/modules/dashboard/utils/task-helpers";
import { useLanguage } from "@/lib/i18n/language-context";
import { PropertyRowProps, TaskDetailFormValues } from "@/modules/dashboard/types";
import type { Task, TaskAssignee, StatusConfig, PriorityConfig } from "@/types/task";

export function PropertyRow({ icon, label, children }: PropertyRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-2.5 px-1">
      <div className="flex items-center gap-2 sm:w-40 shrink-0">
        <Icon icon={icon} className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex-1 pl-6 sm:pl-0">{children}</div>
    </div>
  );
}

interface TaskDetailPropertiesProps {
  task: Task;
  formikValues: TaskDetailFormValues;
  updateField: <K extends keyof TaskDetailFormValues>(field: K, value: TaskDetailFormValues[K]) => void;
  statusConfig?: StatusConfig;
  priorityConfig?: PriorityConfig;
  formattedDueDate: string | null;
  formattedCreated: string;
}

export function TaskDetailProperties({
  task,
  formikValues,
  updateField,
  statusConfig,
  priorityConfig,
  formattedDueDate,
  formattedCreated,
}: TaskDetailPropertiesProps) {
  // console.log("🫨 ~ TaskDetailProperties ~ task:", task)
  const { statuses, isDoneStatus } = useStatuses();
  const { t, locale } = useLanguage();

  const [statusSearch, setStatusSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const taskOverdue = isOverdue(formikValues.dueDate, isDoneStatus(formikValues.status));

  // Assignee toggle
  const toggleAssignee = (member: TaskAssignee) => {
    const isSelected = formikValues.assignees.some((a) => a.id === member.id);
    const newAssignees = isSelected
      ? formikValues.assignees.filter((a) => a.id !== member.id)
      : [...formikValues.assignees, member];
    updateField("assignees", newAssignees);
    // console.log("🫨 ~ toggleAssignee ~ newAssignees:", newAssignees)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 rounded-lg border bg-muted/30 divide-y sm:divide-y-0 px-2">
      <PropertyRow icon="lucide:circle-dot" label={t("prop.status")}>
        <Popover onOpenChange={(open) => { if (!open) setStatusSearch(""); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer"
            >
              {statusConfig && (
                <>
                  <Badge
                    className="gap-1.5 text-xs font-semibold px-2.5 py-0.5 border-0"
                    style={{ backgroundColor: statusConfig.color, color: "#fff" }}
                  >
                    {statusConfig.label}
                    {statusConfig.isDone && (
                      <Icon icon="lucide:check" className="size-3" />
                    )}
                  </Badge>
                  <Icon icon="lucide:chevron-right" className="size-3.5 text-muted-foreground" />
                </>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-0">
            <div className="p-2 border-b">
              <Input
                placeholder={t("filter.search")}
                className="h-8 text-sm"
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="p-1 max-h-60 overflow-y-auto">
              {(() => {
                const filteredStatuses = statuses.filter((s) =>
                  s.label.toLowerCase().includes(statusSearch.toLowerCase())
                );
                const openStatuses = [...filteredStatuses].filter((s) => !s.isDone).sort((a, b) => a.order - b.order);
                const closedStatuses = [...filteredStatuses].filter((s) => s.isDone).sort((a, b) => a.order - b.order);
                return (
                  <>
                    {openStatuses.length > 0 && (
                      <>
                        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                          {t("filter.statuses")}
                        </p>
                        {openStatuses.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => updateField("status", s.id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                              formikValues.status === s.id && "bg-muted font-medium"
                            )}
                          >
                            <span
                              className="size-3 rounded-full border-2"
                              style={{ borderColor: s.color, backgroundColor: formikValues.status === s.id ? s.color : "transparent" }}
                            />
                            {s.label}
                            {formikValues.status === s.id && (
                              <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />
                            )}
                          </button>
                        ))}
                      </>
                    )}
                    {closedStatuses.length > 0 && (
                      <>
                        <div className="border-t my-1" />
                        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                          {t("filter.closed")}
                        </p>
                        {closedStatuses.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => updateField("status", s.id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                              formikValues.status === s.id && "bg-muted font-medium"
                            )}
                          >
                            <span className="flex items-center justify-center size-4 rounded-full" style={{ backgroundColor: s.color }}>
                              <Icon icon="lucide:check" className="size-2.5 text-white" />
                            </span>
                            {s.label}
                            {formikValues.status === s.id && (
                              <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />
                            )}
                          </button>
                        ))}
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          </PopoverContent>
        </Popover>
      </PropertyRow>

      <PropertyRow icon="lucide:users" label={t("prop.assignees")}>
        <Popover onOpenChange={(open) => { if (!open) setMemberSearch(""); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer"
            >
              {formikValues.assignees.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {formikValues.assignees.slice(0, 3).map((a) => {
                      const ai = a.name.split(" ").map((n: string) => n[0]).join("");
                      return (
                        <Avatar key={a.id} className="size-6 border border-primary/20">
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                            {ai}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                  </div>
                  <span className="text-sm font-medium">
                    {formikValues.assignees.length === 1
                      ? formikValues.assignees[0].name
                      : `${formikValues.assignees.length} ${t("prop.people")}`}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{t("prop.unassigned")}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-52 p-1">
            <div className="p-2 border-b">
              <Input
                placeholder={t("filter.search")}
                className="h-8 text-sm"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{t("prop.people")}</p>
              {TEAM_MEMBERS.filter((m) =>
                m.name.toLowerCase().includes(memberSearch.toLowerCase())
              ).map((m) => {
                const mi = m.name.split(" ").map((n: string) => n[0]).join("");
                const isSelected = formikValues.assignees.some((a) => a.id === m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleAssignee(m)}
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                      isSelected && "bg-muted font-medium"
                    )}
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {mi}
                    </span>
                    {m.id === CURRENT_USER.id ? (
                      <span className="flex items-center gap-1.5">
                        {t("prop.me")}
                        <span className="text-xs text-muted-foreground">({m.name})</span>
                      </span>
                    ) : m.name}
                    {isSelected && <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />}
                  </button>
                );
              })}
            </div>
            {formikValues.assignees.length > 0 && (
              <>
                <div className="border-t my-1" />
                <button
                  type="button"
                  onClick={() => updateField("assignees", [])}
                  className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:ban" className="size-4" />
                  {t("common.clearAll")}
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </PropertyRow>

      <PropertyRow icon="lucide:calendar" label={t("prop.dates")}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer"
            >
              {formattedDueDate ? (
                <span
                  className={cn(
                    "flex items-center gap-1.5 font-medium",
                    taskOverdue ? "text-destructive" : "text-foreground"
                  )}
                >
                  <Icon icon="lucide:calendar-clock" className="size-3.5" />
                  {formattedDueDate}
                  {taskOverdue && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4 ml-1">
                      {t("prop.overdue")}
                    </Badge>
                  )}
                </span>
              ) : (
                <span className="text-muted-foreground">{t("prop.noDueDate")}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">{t("prop.dueDate")}</p>
            <Input
              type="date"
              value={formikValues.dueDate || ""}
              onChange={(e) => updateField("dueDate", e.target.value || null)}
              className="h-8 text-sm"
            />
            <div className="space-y-0.5">
              {[
                { label: t("date.today"), days: 0 },
                { label: t("date.tomorrow"), days: 1 },
                { label: t("date.nextWeek"), days: 7 },
                { label: t("date.twoWeeks"), days: 14 },
              ].map(({ label, days }) => {
                const d = new Date();
                d.setDate(d.getDate() + days);
                const val = d.toISOString().split("T")[0];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => updateField("dueDate", val)}
                    className="w-full flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span>{label}</span>
                    <span className="text-xs text-muted-foreground">
                      {d.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { weekday: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>
            {formikValues.dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-muted-foreground gap-1"
                onClick={() => updateField("dueDate", null)}
              >
                <Icon icon="lucide:x-circle" className="size-3" />
                {t("date.clear")}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </PropertyRow>

      <PropertyRow icon="lucide:flag" label={t("prop.priority")}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer"
            >
              <Icon
                icon={priorityConfig?.icon || "lucide:flag"}
                className={cn("size-4", priorityConfig?.color)}
              />
              <span className={cn("text-sm font-semibold", priorityConfig?.color)}>
                {priorityConfig?.label || t("prop.priority")}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-44 p-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{t("prop.priority")}</p>
            {PRIORITY_CONFIGS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => updateField("priority", p.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                  formikValues.priority === p.id && "bg-muted font-medium"
                )}
              >
                <Icon icon={p.icon} className={cn("size-4", p.color)} />
                {p.label}
                {formikValues.priority === p.id && <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </PropertyRow>

      <PropertyRow icon="lucide:clock" label={t("prop.created")}>
        <span className="text-sm text-muted-foreground">{formattedCreated}</span>
      </PropertyRow>

      <PropertyRow icon="lucide:tag" label={t("prop.tags")}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:bg-muted/50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors cursor-pointer min-h-[28px]"
            >
              {formikValues.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {formikValues.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-medium capitalize px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground italic">{t("prop.addTags")}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-52 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">{t("prop.addTags")}</p>
            <div className="flex gap-1.5">
              <Input
                placeholder={t("prop.tagPlaceholder")}
                className="h-7 text-xs flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim().toLowerCase();
                    if (val && !formikValues.tags.includes(val)) {
                      updateField("tags", [...formikValues.tags, val]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
            </div>
            {formikValues.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formikValues.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-xs capitalize pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => updateField("tags", formikValues.tags.filter((t) => t !== tag))}
                      className="ml-0.5 hover:text-destructive cursor-pointer"
                    >
                      <Icon icon="lucide:x" className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </PropertyRow>
    </div>
  );
}
