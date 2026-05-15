"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TaskDetailDialog } from "@/modules/dashboard/components/TaskDetailDialog";
import { useTasks } from "@/lib/task-context";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tasks, selectedTaskId, setSelectedTaskId } = useTasks();

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;
  console.log("🫨 ~ AppShell ~ selectedTask:", selectedTask)

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 h-full w-[240px] animate-in slide-in-from-left duration-300">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 transition-[margin] duration-300 ease-in-out",
          sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[240px]",
          "ml-0"
        )}
      >
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          mobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 p-4 md:p-6 min-w-0 overflow-hidden">{children}</main>
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTaskId}
          onOpenChange={(v) => { if (!v) setSelectedTaskId(null); }}
        />
      )}
    </div>
  );
}
