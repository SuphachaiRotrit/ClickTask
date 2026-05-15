import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/language-context";
import { FormikProps } from "formik";
import { CreateTaskFormValues } from "@/modules/dashboard/hooks/useNewTask";
import type { Subtask } from "@/types/task";

interface NewTaskSubtasksProps {
  formik: FormikProps<CreateTaskFormValues>;
}

export function NewTaskSubtasks({ formik }: NewTaskSubtasksProps) {
  const { t } = useLanguage();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    formik.setFieldValue("subtasks", [...formik.values.subtasks, newSt]);
    setNewSubtaskTitle("");
  };

  const handleRemoveSubtask = (stId: string) => {
    formik.setFieldValue(
      "subtasks",
      formik.values.subtasks.filter((s) => s.id !== stId)
    );
  };

  return (
    <div className="pt-3 space-y-2">
      <div className="flex items-center gap-2">
        <Icon icon="lucide:list-checks" className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground">{t("task.subtasks")}</span>
        {formik.values.subtasks.length > 0 && (
          <span className="text-xs text-muted-foreground/60">
            {formik.values.subtasks.length} {t("common.items")}
          </span>
        )}
      </div>

      {formik.values.subtasks.length > 0 && (
        <div className="space-y-1">
          {formik.values.subtasks.map((st) => (
            <div key={st.id} className="group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors">
              <div className="flex size-4 shrink-0 items-center justify-center rounded border-2 border-muted-foreground/30">
              </div>
              <span className="flex-1 text-foreground/80">{st.title}</span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(st.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer"
              >
                <Icon icon="lucide:x" className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Icon icon="lucide:plus" className="size-3.5 text-muted-foreground shrink-0" />
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSubtask();
            }
          }}
          placeholder={t("task.addSubtask")}
          className="h-7 text-xs border-dashed flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={handleAddSubtask}
          disabled={!newSubtaskTitle.trim()}
        >
          {t("common.add")}
        </Button>
      </div>
    </div>
  );
}
