import type { TaskAssignee } from "@/types/task";

export const TEAM_MEMBERS: TaskAssignee[] = [
  { id: "user-1", name: "Suphachai Rotrit", avatar: null },
  { id: "user-2", name: "Alex Kim", avatar: null },
  { id: "user-3", name: "Jordan Lee", avatar: null },
  { id: "user-4", name: "Mia Patel", avatar: null },
  { id: "user-5", name: "Chris Wang", avatar: null },
];

export const CURRENT_USER: TaskAssignee = TEAM_MEMBERS[0];
