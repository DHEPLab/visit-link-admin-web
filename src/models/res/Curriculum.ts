import { Lesson } from "@/models/res/Lesson";
import { Schedule } from "@/models/res/Schedule";

export interface Curriculum {
  id: number;
  name: string;
  description: string;
  branch: string;
  projectId: number;
  published: boolean;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
}

export interface CurriculumResponse {
  id: number;
  branch: string;
  name: string;
  description: string;
  hasDraft: string;
  lastModifiedDraftAt: string | null;
  lastPublishedAt: string;
  published: boolean;
  sessions: Lesson[];
  schedules: Schedule[];
  sourceId: number | null;
  status: "DRAFT" | "PUBLISHED" | null;
}
