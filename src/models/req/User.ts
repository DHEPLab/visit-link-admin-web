export interface UpdateUserRequest {
  realName: string;
  phone: string;
  chw?: {
    identity: string;
    tags: string[];
  } | null;
}
