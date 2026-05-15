"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useLanguage } from "@/lib/i18n/language-context";
import { useNewTask } from "@/modules/dashboard/hooks/useNewTask";
import { NewTaskDescription } from "@/modules/dashboard/components/new-task/NewTaskDescription";
import { NewTaskSubtasks } from "@/modules/dashboard/components/new-task/NewTaskSubtasks";
import { NewTaskToolbar } from "@/modules/dashboard/components/new-task/NewTaskToolbar";

export function NewTaskDialog() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const [showDesc, setShowDesc] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  const handleSuccess = () => {
    setShowDesc(false);
    setTagInput("");
    setLinkUrl("");
    setLinkLabel("");
    setOpen(false);
  };

  const { formik } = useNewTask(handleSuccess);

  const handleClose = () => {
    formik.resetForm();
    setShowDesc(false);
    setTagInput("");
    setLinkUrl("");
    setLinkLabel("");
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v && lightboxSrc) return;
          if (!v) handleClose();
          else setOpen(true);
        }}
      >
        <Button className="gap-2 shadow-md" onClick={() => setOpen(true)}>
          <Icon icon="lucide:plus" className="size-4" />
          {t("dashboard.newTask")}
        </Button>

        <DialogContent
          className="sm:max-w-2xl p-0 overflow-hidden max-h-[85vh] flex flex-col"
          onInteractOutside={(e) => { if (lightboxSrc) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (lightboxSrc) e.preventDefault(); }}
        >
          <DialogTitle className="sr-only">New Task</DialogTitle>
          <DialogDescription className="sr-only">Fill out the form below to create a new task.</DialogDescription>

          <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-6 pb-4 space-y-1">
              <input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("task.taskName")}
                autoFocus
                className="w-full text-xl sm:text-2xl font-bold bg-transparent border-0 outline-none placeholder:text-muted-foreground/50 text-foreground pr-8"
              />

              <NewTaskDescription
                formik={formik}
                showDesc={showDesc}
                setShowDesc={setShowDesc}
                setLightboxSrc={setLightboxSrc}
                setDeleteImageIndex={setDeleteImageIndex}
                linkUrl={linkUrl}
                setLinkUrl={setLinkUrl}
                linkLabel={linkLabel}
                setLinkLabel={setLinkLabel}
              />

              <NewTaskSubtasks formik={formik} />

              <div className="min-h-[120px]" />
            </div>

            <NewTaskToolbar
              formik={formik}
              tagInput={tagInput}
              setTagInput={setTagInput}
            />

            <div className="shrink-0 border-t bg-background px-4 sm:px-6 py-3 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground cursor-pointer"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!formik.values.title.trim()}
                className="gap-1.5 px-5 cursor-pointer"
              >
                {t("task.createTask")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <AlertDialog open={deleteImageIndex !== null} onOpenChange={(v) => { if (!v) setDeleteImageIndex(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("task.deleteImage")}</AlertDialogTitle>
            <AlertDialogDescription>{t("task.deleteImageConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              onClick={() => {
                if (deleteImageIndex !== null) {
                  formik.setFieldValue(
                    "images",
                    formik.values.images.filter((_, idx) => idx !== deleteImageIndex)
                  );
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
