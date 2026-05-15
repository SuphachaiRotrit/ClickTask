"use client";

import { Icon } from "@iconify/react";
import { useLanguage } from "@/lib/i18n/language-context";

export function TeamPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("team.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("team.subtitle")}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
        <Icon icon="lucide:users" className="mb-4 size-12 text-muted-foreground/40" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          {t("team.comingSoon")}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground/60">
          {t("team.comingSoonDesc")}
        </p>
      </div>
    </div>
  );
}
