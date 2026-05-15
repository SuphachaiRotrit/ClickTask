import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/language-context";
import { useTasks } from "@/lib/task-context";
import type { Task } from "@/types/task";

interface TaskDetailDescriptionProps {
  task: Task;
  updateField: (field: "description", value: string) => void;
  setLightboxSrc: (src: string) => void;
  setDeleteImageIndex: (index: number) => void;
}

export function TaskDetailDescription({
  task,
  updateField,
  setLightboxSrc,
  setDeleteImageIndex,
}: TaskDetailDescriptionProps) {
  const { t } = useLanguage();
  const { addImage, removeLink, addLink } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(task.description);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  useEffect(() => {
    setEditDesc(task.description);
  }, [task.description]);

  const handleSaveDesc = () => {
    updateField("description", editDesc);
    // console.log("🫨 ~ handleSaveDesc ~ editDesc:", editDesc)
    setIsEditingDesc(false);
  };

  const handleCancelDesc = () => {
    setEditDesc(task.description);
    setIsEditingDesc(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          addImage(task.id, ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddLinkAction = () => {
    if (!linkUrl.trim()) return;
    addLink(task.id, linkUrl.trim(), linkLabel.trim());
    setLinkUrl("");
    setLinkLabel("");
  };

  return (
    <div className="px-5 sm:px-8 py-4 border-t">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:file-text" className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">{t("task.description")}</span>
        </div>
        {!isEditingDesc && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs h-7"
            onClick={() => {
              setEditDesc(task.description);
              setIsEditingDesc(true);
            }}
          >
            <Icon icon="lucide:pencil" className="size-3" />
            {t("common.edit")}
          </Button>
        )}
      </div>

      {isEditingDesc ? (
        <div className="space-y-2">
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={5}
            autoFocus
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            placeholder={t("task.addDescPlaceholder")}
          />
          <div className="flex gap-2">
            <Button size="sm" className="h-7 text-xs gap-1" onClick={handleSaveDesc}>
              <Icon icon="lucide:check" className="size-3" />
              {t("common.save")}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCancelDesc}>
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap pl-6">
          {task.description || (
            <span className="text-muted-foreground italic">{t("task.addDescription")}</span>
          )}
        </p>
      )}

      <div className="mt-3 pl-6 space-y-3">
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
          className="gap-1.5 text-xs h-7 text-muted-foreground p-0 hover:bg-transparent hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon icon="lucide:image-plus" className="size-3.5" />
          {t("task.addImage")}
        </Button>

        {task.images.length > 0 && (
          <div className="space-y-2">
            {task.images.map((img, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border">
                <img
                  src={img}
                  alt={`Attachment ${i + 1}`}
                  className="w-full h-auto max-h-80 object-contain bg-muted/30"
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

        {task.links.length > 0 && (
          <div className="space-y-1.5">
            {task.links.map((link) => (
              <div
                key={link.id}
                className="group flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Icon icon="lucide:link" className="size-3.5 text-blue-500 shrink-0" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate flex-1"
                >
                  {link.label}
                </a>
                <button
                  type="button"
                  onClick={() => removeLink(task.id, link.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer"
                >
                  <Icon icon="lucide:x" className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 pt-1">
          <Input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="h-7 text-xs flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLinkAction();
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
                handleAddLinkAction();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 text-muted-foreground p-0 hover:bg-transparent hover:text-foreground"
            onClick={handleAddLinkAction}
            disabled={!linkUrl.trim()}
          >
            <Icon icon="lucide:link" className="size-3.5" />
            {t("common.add")}
          </Button>
        </div>
      </div>
    </div>
  );
}
