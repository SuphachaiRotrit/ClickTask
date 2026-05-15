import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/language-context";
import { FormikProps } from "formik";
import { CreateTaskFormValues } from "@/modules/dashboard/hooks/useNewTask";
import type { TaskLink } from "@/types/task";

interface NewTaskDescriptionProps {
  formik: FormikProps<CreateTaskFormValues>;
  showDesc: boolean;
  setShowDesc: (val: boolean) => void;
  setLightboxSrc: (src: string | null) => void;
  setDeleteImageIndex: (index: number | null) => void;
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  linkLabel: string;
  setLinkLabel: (val: string) => void;
}

export function NewTaskDescription({
  formik,
  showDesc,
  setShowDesc,
  setLightboxSrc,
  setDeleteImageIndex,
  linkUrl,
  setLinkUrl,
  linkLabel,
  setLinkLabel,
}: NewTaskDescriptionProps) {
  // console.log("🫨 ~ NewTaskDescription ~ showDesc:", showDesc)
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // console.log("🫨 ~ handleImageUpload ~ files:", files)
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result)
          formik.setFieldValue("images", [...formik.values.images, ev.target.result as string]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveLink = (linkId: string) => {
    formik.setFieldValue(
      "links",
      formik.values.links.filter((l) => l.id !== linkId)
    );
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    const newLink: TaskLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      url: linkUrl.trim(),
      label: linkLabel.trim() || linkUrl.trim(),
    };
    formik.setFieldValue("links", [...formik.values.links, newLink]);
    setLinkUrl("");
    setLinkLabel("");
  };

  if (!showDesc) {
    return (
      <button
        type="button"
        onClick={() => setShowDesc(true)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors pt-1 cursor-pointer"
      >
        <Icon icon="lucide:plus" className="size-3.5" />
        {t("task.addDescription")}
      </button>
    );
  }

  return (
    <div className="pt-2 space-y-2">
      <textarea
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        placeholder={t("task.addDescPlaceholder")}
        rows={4}
        autoFocus
        className="w-full bg-transparent border-0 outline-none text-sm text-foreground/80 placeholder:text-muted-foreground/40 resize-none leading-relaxed"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs h-7 text-muted-foreground"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon icon="lucide:image-plus" className="size-3.5" />
        {t("task.addImage")}
      </Button>

      {formik.values.images.length > 0 && (
        <div className="space-y-2">
          {formik.values.images.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border">
              <img
                src={img}
                alt={`Attachment ${i + 1}`}
                className="w-full h-auto max-h-64 object-contain bg-muted/30"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setLightboxSrc(img)}
                  className="flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-white transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:expand" className="size-3.5" />
                  {t("task.open")}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteImageIndex(i)}
                  className="flex items-center gap-1.5 rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:trash-2" className="size-3.5" />
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formik.values.links.length > 0 && (
        <div className="space-y-1.5">
          {formik.values.links.map((link) => (
            <div key={link.id} className="group flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors">
              <Icon icon="lucide:link" className="size-3.5 text-blue-500 shrink-0" />
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate flex-1">
                {link.label}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer"
              >
                <Icon icon="lucide:x" className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <Input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://..."
          className="h-7 text-xs flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddLink();
            }
          }}
        />
        <Input
          value={linkLabel}
          onChange={(e) => setLinkLabel(e.target.value)}
          placeholder={t("task.labelOptional")}
          className="h-7 text-xs w-32"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddLink();
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 text-muted-foreground"
          onClick={handleAddLink}
          disabled={!linkUrl.trim()}
        >
          <Icon icon="lucide:link" className="size-3.5" />
          {t("common.add")}
        </Button>
      </div>
    </div>
  );
}
