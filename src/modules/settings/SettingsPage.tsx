"use client";

import { Icon } from "@iconify/react";
import { Separator } from "@/components/ui/separator";
import { useStatuses } from "@/lib/status-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { StatusItem } from "@/modules/settings/components/StatusItem";
import { AddStatusForm } from "@/modules/settings/components/AddStatusForm";

export function SettingsPage() {
  const { statuses } = useStatuses();
  const { t } = useLanguage();
  const sorted = [...statuses].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon icon="lucide:kanban" className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t("settings.statusManagement")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("settings.statusColorDesc")}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          {sorted.map((status, i) => (
            <StatusItem
              key={status.id}
              status={status}
              isFirst={i === 0}
              isLast={i === sorted.length - 1}
              totalCount={sorted.length}
            />
          ))}
        </div>
        <AddStatusForm />
      </div>
    </div>
  );
}
