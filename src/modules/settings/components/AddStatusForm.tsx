"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { hexToRgb } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { ColorPicker } from "@/modules/settings/components/ColorPicker";
import { isValidHexColor } from "@/modules/settings/utils/constants";

const addStatusSchema = Yup.object({
  label: Yup.string().trim().required("Status name is required"),
  color: Yup.string()
    .required("Color is required")
    .test("valid-hex", "Please enter a valid hex color (e.g. #3b82f6)", (v) =>
      isValidHexColor(v || "")
    ),
});

export function AddStatusForm() {
  const { addStatus, statuses } = useStatuses();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const takenColors = statuses.map((s) => s.color);

  const formik = useFormik({
    initialValues: { label: "", color: "#6366f1" },
    validationSchema: addStatusSchema,
    onSubmit: (values, { resetForm, setStatus }) => {
      // console.log("🫨 ~ AddStatusForm ~ values:", values)
      const success = addStatus(values.label, values.color);
      if (!success) {
        setStatus(t("settings.statusExists"));
        return;
      }
      resetForm();
      setIsOpen(false);
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-full gap-2 border-dashed h-12"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="lucide:plus" className="size-4" />
        {t("settings.addStatusButton")}
      </Button>
    );
  }

  const formError =
    formik.status ||
    (formik.touched.label && formik.errors.label) ||
    (formik.touched.color && formik.errors.color);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="rounded-xl border-2 border-dashed border-primary/20 bg-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{t("settings.addStatus")}</h4>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" size="sm" className="gap-1">
            <Icon icon="lucide:plus" className="size-3.5" />
            {t("settings.addStatus")}
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
          placeholder={t("settings.statusNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("settings.color")}</label>
        <ColorPicker
          value={formik.values.color}
          onChange={(c) => formik.setFieldValue("color", c)}
          takenColors={takenColors}
        />
      </div>

      {formError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <Icon icon="lucide:alert-circle" className="size-3.5" />
          {formError}
        </p>
      )}

      {formik.values.label.trim() && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{t("common.preview")}</label>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{
              backgroundColor: `rgba(${hexToRgb(formik.values.color).r}, ${hexToRgb(formik.values.color).g}, ${hexToRgb(formik.values.color).b}, 0.1)`,
            }}
          >
            <div className="size-2.5 rounded-full" style={{ backgroundColor: formik.values.color }} />
            <span className="text-sm font-semibold" style={{ color: formik.values.color }}>
              {formik.values.label}
            </span>
          </div>
        </div>
      )}
    </form>
  );
}
