import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StatusProvider } from "@/lib/status-context";
import { TaskProvider } from "@/lib/task-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";

export const metadata: Metadata = {
  title: "ClickTask - Task Management",
  description:
    "A modern task management application to organize, track, and collaborate on projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <StatusProvider>
              <TaskProvider>
                <AppShell>{children}</AppShell>
              </TaskProvider>
            </StatusProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
