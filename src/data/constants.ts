import type { PriorityConfig } from "@/types/task";

export const PRIORITY_CONFIGS: PriorityConfig[] = [
  {
    id: "low",
    label: "Low",
    color: "text-slate-500",
    bgColor: "bg-slate-100",
    icon: "lucide:flag",
  },
  {
    id: "medium",
    label: "Medium",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: "lucide:flag",
  },
  {
    id: "high",
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: "lucide:flag",
  },
  {
    id: "urgent",
    label: "Urgent",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: "lucide:alert-triangle",
  },
];
