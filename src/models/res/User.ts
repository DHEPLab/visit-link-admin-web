interface Supervisor {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  projectId: number;
  id: number;
  username: string;
  realName: string;
  phone: string;
  role: "ROLE_SUPERVISOR";
  lastModifiedPasswordAt: string | null;
  chw: null;
}

interface CHW {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  projectId: number | null;
  id: number;
  identity: string;
  tags: string[];
  supervisor: Supervisor;
}

export interface User {
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  projectId: number;
  id: number;
  username: string;
  realName: string;
  phone: string;
  role: "ROLE_CHW" | "ROLE_SUPERVISOR" | "ROLE_ADMIN";
  lastModifiedPasswordAt: string | null;
  chw: CHW | null;
}

export interface ChwUser {
  user: User;
  babyCount: number;
  shouldFinish: number;
  hasFinish: number;
}

export interface AssignBaby {
  id: number;
  name: string;
  identity: string;
  gender: string;
  area: string;
  masterCarerName: string;
  masterCarerPhone: string;
}
