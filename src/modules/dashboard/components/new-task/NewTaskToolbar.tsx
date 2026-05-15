import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn, hexToRgb } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { CreateTaskFormValues } from "@/modules/dashboard/hooks/useNewTask";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { TEAM_MEMBERS, CURRENT_USER } from "@/data/team-members";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TaskAssignee } from "@/types/task";

interface NewTaskToolbarProps {
  formik: FormikProps<CreateTaskFormValues>;
  tagInput: string;
  setTagInput: (val: string) => void;
}

export function NewTaskToolbar({ formik, tagInput, setTagInput }: NewTaskToolbarProps) {
  // console.log("🫨 ~ NewTaskToolbar ~ tagInput:", tagInput)
  const { statuses } = useStatuses();
  const { t, locale } = useLanguage();

  const [statusSearch, setStatusSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const selectedStatus = statuses.find((s) => s.id === formik.values.status);
  const selectedPriority = formik.values.priority ? PRIORITY_CONFIGS.find((p) => p.id === formik.values.priority) : null;
  const statusRgb = selectedStatus ? hexToRgb(selectedStatus.color) : { r: 100, g: 100, b: 100 };

  const handleAddTag = () => {
    const txt = tagInput.trim();
    if (txt && !formik.values.tags.includes(txt)) {
      formik.setFieldValue("tags", [...formik.values.tags, txt]);
    }
    setTagInput("");
  };

  const toggleAssignee = (member: TaskAssignee) => {
    // console.log("🫨 ~ toggleAssignee ~ member:", member)
    const isSelected = formik.values.assignees.some((a) => a.id === member.id);
    if (isSelected) {
      formik.setFieldValue("assignees", formik.values.assignees.filter((a) => a.id !== member.id));
    } else {
      formik.setFieldValue("assignees", [...formik.values.assignees, member]);
    }
  };

  return (
    <div className="shrink-0 border-t bg-muted/30 px-4 sm:px-6 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Popover onOpenChange={(open) => { if (!open) setStatusSearch(""); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors hover:bg-muted cursor-pointer"
              style={{
                borderColor: selectedStatus?.color,
                color: selectedStatus?.color,
                backgroundColor: `rgba(${statusRgb.r}, ${statusRgb.g}, ${statusRgb.b}, 0.08)`,
              }}
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: selectedStatus?.color }} />
              {selectedStatus?.label || t("prop.status")}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-1">
            <div className="p-2 border-b">
              <Input
                placeholder={t("filter.search")}
                className="h-8 text-[11px]"
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t("prop.status")}
              </p>
              {statuses
                .filter((s) => s.label.toLowerCase().includes(statusSearch.toLowerCase()))
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => formik.setFieldValue("status", s.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                      formik.values.status === s.id && "bg-muted font-medium"
                    )}
                  >
                    <span className="size-3 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                    {formik.values.status === s.id && <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />}
                  </button>
                ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover onOpenChange={(open) => { if (!open) setMemberSearch(""); }}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border transition-colors hover:bg-muted cursor-pointer",
                formik.values.assignees.length > 0 && "border-primary/30 text-foreground"
              )}
            >
              <Icon icon="lucide:users" className="size-3.5" />
              {formik.values.assignees.length > 0
                ? formik.values.assignees.length === 1
                  ? formik.values.assignees[0].name
                  : `${formik.values.assignees.length} ${t("prop.people")}`
                : t("prop.assignees")}
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
                const memberInitials = m.name.split(" ").map((n: string) => n[0]).join("");
                const isSelected = formik.values.assignees.some((a) => a.id === m.id);
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
                      {memberInitials}
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
            {formik.values.assignees.length > 0 && (
              <>
                <div className="border-t my-1" />
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("assignees", [])}
                  className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:ban" className="size-4" />
                  {t("common.clearAll")}
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border transition-colors hover:bg-muted cursor-pointer",
                formik.values.dueDate && "border-primary/30 text-foreground"
              )}
            >
              <Icon icon="lucide:calendar" className="size-3.5" />
              {formik.values.dueDate
                ? new Date(formik.values.dueDate).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
                  month: "short",
                  day: "numeric",
                })
                : t("prop.dueDate")}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">{t("prop.dueDate")}</p>
            <Input
              type="date"
              value={formik.values.dueDate || ""}
              onChange={(e) => formik.setFieldValue("dueDate", e.target.value || null)}
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
                    onClick={() => formik.setFieldValue("dueDate", val)}
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
            {formik.values.dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-muted-foreground gap-1"
                onClick={() => formik.setFieldValue("dueDate", null)}
              >
                <Icon icon="lucide:x-circle" className="size-3" />
                {t("date.clear")}
              </Button>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border transition-colors hover:bg-muted cursor-pointer",
                selectedPriority && selectedPriority.color
              )}
            >
              <Icon icon={selectedPriority?.icon || "lucide:flag"} className="size-3.5" />
              {selectedPriority?.label || t("prop.priority")}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-44 p-1">
            <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{t("prop.priority")}</p>
            {PRIORITY_CONFIGS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => formik.setFieldValue("priority", p.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer",
                  formik.values.priority === p.id && "bg-muted font-medium"
                )}
              >
                <Icon icon={p.icon} className={cn("size-4", p.color)} />
                {p.label}
                {formik.values.priority === p.id && <Icon icon="lucide:check" className="size-3.5 ml-auto text-primary" />}
              </button>
            ))}
            {formik.values.priority && (
              <>
                <div className="border-t my-1" />
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("priority", null)}
                  className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:ban" className="size-4" />
                  {t("date.clear")}
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border border-border transition-colors hover:bg-muted cursor-pointer",
                formik.values.tags.length > 0 && "border-primary/30 text-foreground"
              )}
            >
              <Icon icon="lucide:tag" className="size-3.5" />
              {t("prop.tags")}
              {formik.values.tags.length > 0 && (
                <span className="ml-0.5 bg-primary/10 text-primary text-[10px] rounded-full px-1.5 font-bold">
                  {formik.values.tags.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-52 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">{t("prop.addTags")}</p>
            <div className="flex gap-1.5">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t("prop.tagPlaceholder")}
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                {t("common.add")}
              </Button>
            </div>
            {formik.values.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formik.values.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-xs capitalize pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue("tags", formik.values.tags.filter((t) => t !== tag))}
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
      </div>
    </div>
  );
}
