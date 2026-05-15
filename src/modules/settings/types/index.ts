import type { StatusConfig } from "@/types/task";

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  takenColors: string[];
  excludeId?: string;
}

export interface StatusItemProps {
  status: StatusConfig;
  isFirst: boolean;
  isLast: boolean;
  totalCount: number;
}
