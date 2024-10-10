export type CarersResponse = Carer[];

export interface Carer {
  createdAt: string;
  createdBy: string;
  familyTies: string;
  id: number;
  lastModifiedAt: string;
  lastModifiedBy: string;
  master: boolean;
  name: string;
  phone: string;
  projectId: number;
  otherContact: string | null;
}
