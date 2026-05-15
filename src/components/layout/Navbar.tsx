"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/lib/i18n/language-context";
import { useTasks } from "@/lib/task-context";
import { useStatuses } from "@/lib/status-context";
import { PRIORITY_CONFIGS } from "@/data/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export function Navbar({ onMobileMenuToggle, mobileMenuOpen }: NavbarProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const { locale, setLocale, t } = useLanguage();
  const { tasks, setSelectedTaskId } = useTasks();
  const { statuses } = useStatuses();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo<Task[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    return tasks.filter((task) => {
      if (task.title.toLowerCase().includes(q)) return true;
      if (task.description.toLowerCase().includes(q)) return true;
      if (task.tags.some((tag) => tag.toLowerCase().includes(q))) return true;
      const statusConfig = statuses.find((s) => s.id === task.status);
      if (statusConfig && statusConfig.label.toLowerCase().includes(q)) return true;
      const priorityConfig = PRIORITY_CONFIGS.find((p) => p.id === task.priority);
      if (priorityConfig && priorityConfig.label.toLowerCase().includes(q)) return true;
      return false;
    }).slice(0, 8);
  }, [searchQuery, tasks, statuses]);

  const handleSelectResult = (task: Task) => {
    setSearchQuery("");
    setSearchOpen(false);
    setSelectedTaskId(task.id);
    router.push("/dashboard");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-3 sm:px-6 backdrop-blur-md gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden size-8"
          onClick={onMobileMenuToggle}
        >
          <Icon
            icon={mobileMenuOpen ? "lucide:x" : "lucide:menu"}
            className="size-5"
          />
        </Button>
        <h2 className="text-base sm:text-lg font-semibold tracking-tight hidden sm:block">
          {t("navbar.dashboard")}
        </h2>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
        <div ref={searchRef} className="relative hidden sm:block">
          <Icon icon="lucide:search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => { if (searchQuery.trim()) setSearchOpen(true); }}
            className="h-9 w-56 lg:w-72 pl-9 text-sm"
          />
          {searchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-muted-foreground">
                  <Icon icon="lucide:search-x" className="size-8 mb-2 opacity-40" />
                  <p className="text-sm">{t("search.noResults")}</p>
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                    {searchResults.length} {t("search.results")}
                  </div>
                  {searchResults.map((task) => {
                    const statusConfig = statuses.find((s) => s.id === task.status);
                    const priorityConfig = PRIORITY_CONFIGS.find((p) => p.id === task.priority);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => handleSelectResult(task)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors text-left cursor-pointer"
                      >
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: statusConfig?.color || "#94a3b8" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">
                              {statusConfig?.label}
                            </span>
                            <span className={cn("text-[10px] font-medium", priorityConfig?.color)}>
                              {priorityConfig?.label}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        <MobileSearchButton
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          statuses={statuses}
          t={t}
          onSelect={handleSelectResult}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 sm:size-9"
              onClick={() => setLocale(locale === "en" ? "th" : "en")}
            >
              <span className="text-xs font-bold">
                {locale === "en" ? "EN" : "TH"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {locale === "en" ? t("lang.th") : t("lang.en")}
          </TooltipContent>
        </Tooltip>

        {mounted ? (
          <div className="flex items-center gap-2 px-1">
            <Icon icon="lucide:sun" className="size-4 text-muted-foreground" />
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
            <Icon icon="lucide:moon" className="size-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-[84px]" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative size-8 sm:size-9">
              <Icon icon="lucide:bell" className="size-4" />
              <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
                1
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>{t("navbar.notifications")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">
                {t("common.noData")}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-8 sm:size-9 rounded-full p-0"
            >
              <Avatar className="size-7 sm:size-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold">
                  SR
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Suphachai Rotrit</p>
                <p className="text-xs text-muted-foreground">
                  suphachairotrit@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("navbar.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("navbar.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              {t("navbar.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ส่วนของ mobile
interface MobileSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: Task[];
  statuses: { id: string; label: string; color: string }[];
  t: (key: any) => string;
  onSelect: (task: Task) => void;
}

function MobileSearchButton({
  searchQuery,
  setSearchQuery,
  searchResults,
  statuses,
  t,
  onSelect,
}: MobileSearchProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden size-8"
        onClick={() => setOpen(true)}
      >
        <Icon icon="lucide:search" className="size-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm sm:hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 border-b">
          <Icon icon="lucide:search" className="size-5 text-muted-foreground shrink-0" />
          <Input
            autoFocus
            type="search"
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 h-10 text-base shadow-none focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              setSearchQuery("");
            }}
            className="shrink-0"
          >
            {t("common.cancel")}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() && searchResults.length === 0 && (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Icon icon="lucide:search-x" className="size-10 mb-3 opacity-40" />
              <p className="text-sm">{t("search.noResults")}</p>
            </div>
          )}
          {searchResults.map((task) => {
            const statusConfig = statuses.find((s) => s.id === task.status);
            const priorityConfig = PRIORITY_CONFIGS.find((p) => p.id === task.priority);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => {
                  onSelect(task);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b cursor-pointer"
              >
                <span
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: statusConfig?.color || "#94a3b8" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {statusConfig?.label}
                    </span>
                    <span className={cn("text-xs font-medium", priorityConfig?.color)}>
                      {priorityConfig?.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
