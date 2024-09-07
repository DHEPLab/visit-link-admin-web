import { Lesson } from "@/models/res/Lesson";

export type VisitsResponse = Visit[];

export interface Visit {
  id: number;
  distance: number | null;
  status: "UNDONE" | "DONE";
  visitTime: string;
  remark: string | null;
  lesson: Lesson;
}
