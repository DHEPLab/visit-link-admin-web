import { FamilyTies } from "@/constants/enums";

export interface CarerFormValues {
  id?: number;
  master: boolean;
  familyTies: keyof typeof FamilyTies;
  phone: string;
  wechat: string | null;
}
