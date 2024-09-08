export type AllProjectResponse = Project[];

export type ProjectStatus = 0 | 1;

export interface Project {
  id: number;
  code: string;
  name: string;
  status: ProjectStatus;
  userId: number | null;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string | null;
  lastModifiedBy: string | null;
}
