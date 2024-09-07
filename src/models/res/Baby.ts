import { BabyStage, FeedingPattern, Gender } from "@/constants/enums";
import { User } from "@/models/res/User";

export interface BabyResponse {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  deleted: boolean;
  projectId: number;
  id: number;
  name: string;
  identity: string;
  gender: keyof typeof Gender;
  stage: keyof typeof BabyStage;
  edc: string | null;
  birthday: string | null;
  feedingPattern: keyof typeof FeedingPattern | null;
  assistedFood: boolean;
  approved: boolean;
  actionFromApp: string | null;
  area: string;
  location: string;
  remark: string | null;
  chw: User | null;
  curriculum: string | null;
  longitude: number | null;
  latitude: number | null;
  showLocation: boolean | null;
  closeAccountReason: string | null;
  months: number;
  days: number;
  canCreate: boolean;
}
