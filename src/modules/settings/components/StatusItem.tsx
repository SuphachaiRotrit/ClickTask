"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { cn, hexToRgb } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { ColorPicker } from "@/modules/settings/components/ColorPicker";
import { isValidHexColor } from "@/modules/settings/utils/constants";
import type { StatusItemProps } from "@/modules/settings/types";

const editStatusSchema = Yup.object({
  label: Yup.string().trim().required("Status name is required"),
  color: Yup.string()
    .required("Color is required")
    .test("valid-hex", "Please enter a valid hex color (e.g. #3b82f6)", (v) =>
      isValidHexColor(v || "")
    ),
});

export function StatusItem({ status, isFirst, isLast, totalCount }: StatusItemProps) {
  const { updateStatus, removeStatus, reorderStatus, toggleIsDone, statuses } = useStatuses();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const takenColors = statuses.map((s) => s.color);

  const formik = useFormik({
    initialValues: { label: status.label, color: status.color },
    validationSchema: editStatusSchema,
    enableReinitialize: true,
    onSubmit: (values, { setStatus }) => {
      // console.log("🫨 ~ StatusItem ~ values:", values)
      const success = updateStatus(status.id, values.label, values.color);
      if (!success) {
        setStatus("This color is already used by another status");
        return;
      }
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    formik.resetForm({ values: { label: status.label, color: status.color } });
    setIsEditing(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const rgb = hexToRgb(status.color);

  if (isEditing) {
    const formError =
      formik.status ||
      (formik.touched.label && formik.errors.label) ||
      (formik.touched.color && formik.errors.color);

    return (
      <form
        onSubmit={formik.handleSubmit}
        className="rounded-xl border-2 border-primary/20 bg-card p-5 space-y-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">{t("common.edit")}</h4>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" size="sm" className="gap-1">
              <Icon icon="lucide:check" className="size-3.5" />
              {t("common.save")}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.statusName")}</label>
          <Input
            name="label"
            value={formik.values.label}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter status name..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.color")}</label>
          <ColorPicker
            value={formik.values.color}
            onChange={(c) => formik.setFieldValue("color", c)}
            takenColors={takenColors}
            excludeId={status.id}
          />
        </div>
        {formError && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <Icon icon="lucide:alert-circle" className="size-3.5" />
            {formError}
          </p>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{t("common.preview")}</label>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: `rgba(${hexToRgb(formik.values.color).r}, ${hexToRgb(formik.values.color).g}, ${hexToRgb(formik.values.color).b}, 0.1)` }}
          >
            <div className="size-2.5 rounded-full" style={{ backgroundColor: formik.values.color }} />
            <span className="text-sm font-semibold" style={{ color: formik.values.color }}>
              {formik.values.label || t("prop.status")}
            </span>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="size-4 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: status.color }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{status.label}</p>
            {status.isDone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <Icon icon="lucide:check-circle-2" className="size-3" />
                {t("common.done")}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">
            {status.color.toUpperCase()}
          </p>
        </div>
      </div>
      <div
        className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
        style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` }}
      >
        <div className="size-2 rounded-full" style={{ backgroundColor: status.color }} />
        <span className="text-xs font-medium" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8", status.isDone && "text-emerald-600")}
          onClick={() => toggleIsDone(status.id)}
          title={status.isDone ? t("settings.unmarkAsDone") : t("settings.markAsDoneTooltip")}
        >
          <Icon icon={status.isDone ? "lucide:check-circle-2" : "lucide:circle-dashed"} className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => reorderStatus(status.id, "up")}
          disabled={isFirst}
        >
          <Icon icon="lucide:chevron-up" className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => reorderStatus(status.id, "down")}
          disabled={isLast}
        >
          <Icon icon="lucide:chevron-down" className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={handleEdit}
        >
          <Icon icon="lucide:pencil" className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => removeStatus(status.id)}
          disabled={totalCount <= 1}
        >
          <Icon icon="lucide:trash-2" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
