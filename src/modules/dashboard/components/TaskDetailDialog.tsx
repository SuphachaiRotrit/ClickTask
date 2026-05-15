"use client";

import { useState } from "react";
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
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { useStatuses } from "@/lib/status-context";
import { useTasks } from "@/lib/task-context";
import { computeProgress } from "@/modules/dashboard/utils/task-helpers";
import { useLanguage } from "@/lib/i18n/language-context";
import type { TaskDetailDialogProps } from "@/modules/dashboard/types";
import { useTaskDetail } from "@/modules/dashboard/hooks/useTaskDetail";
import { TaskDetailProperties } from "@/modules/dashboard/components/task-detail/TaskDetailProperties";
import { TaskDetailDescription } from "@/modules/dashboard/components/task-detail/TaskDetailDescription";
import { TaskDetailSubtasks } from "@/modules/dashboard/components/task-detail/TaskDetailSubtasks";

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  const { statuses, isDoneStatus } = useStatuses();
  const { removeImage } = useTasks();
  const { t, locale } = useLanguage();

  const { formik, updateField } = useTaskDetail(task);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);

  const statusConfig = statuses.find((s) => s.id === formik.values.status);
  const priorityConfig = PRIORITY_CONFIGS.find((p) => p.id === formik.values.priority);

  const progress = isDoneStatus(formik.values.status)
    ? 100
    : computeProgress(task.subtasks);

  const completedCount = task.subtasks.filter((s) => s.completed).length;
  const totalCount = task.subtasks.length;

  const formattedDueDate = formik.values.dueDate
    ? new Date(formik.values.dueDate).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : null;

  const formattedCreated = new Date(task.createdAt).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v && lightboxSrc) return;
          onOpenChange(v);
        }}
      >
        <DialogContent
          className="sm:max-w-6xl p-0 overflow-hidden max-h-[90vh] flex flex-col"
          onInteractOutside={(e) => { if (lightboxSrc) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (lightboxSrc) e.preventDefault(); }}
        >
          <DialogTitle className="sr-only">Task Details: {task.title}</DialogTitle>
          <DialogDescription className="sr-only">View and edit details for this task.</DialogDescription>
          <div className="h-1 w-full shrink-0" />
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 sm:px-8 pt-5 pb-4 space-y-4">
              <h2 className="text-lg sm:text-2xl font-bold leading-snug pr-8 text-foreground">
                {task.title}
              </h2>
              <TaskDetailProperties
                task={task}
                formikValues={formik.values}
                updateField={updateField}
                statusConfig={statusConfig}
                priorityConfig={priorityConfig}
                formattedDueDate={formattedDueDate}
                formattedCreated={formattedCreated}
              />
            </div>
            <TaskDetailDescription
              task={task}
              updateField={updateField}
              setLightboxSrc={setLightboxSrc}
              setDeleteImageIndex={setDeleteImageIndex}
            />
            <TaskDetailSubtasks
              task={task}
              progress={progress}
              completedCount={completedCount}
              totalCount={totalCount}
              statusConfig={statusConfig}
            />
          </div>
          <div className="shrink-0 flex items-center justify-end gap-2 px-5 sm:px-8 py-3 border-t bg-background">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                <Icon icon="lucide:x" className="size-3.5" />
                {t("common.close")}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      <AlertDialog open={deleteImageIndex !== null} onOpenChange={(open) => { if (!open) setDeleteImageIndex(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("task.deleteImage")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("task.deleteImageConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              onClick={() => {
                if (deleteImageIndex !== null) {
                  removeImage(task.id, deleteImageIndex);
                  setDeleteImageIndex(null);
                }
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
