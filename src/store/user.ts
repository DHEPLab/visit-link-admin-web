import { create } from "zustand";
import { Profile } from "@/models/res/Profile";
import { middlewares } from "./middlewares";

interface UserState {
  user: unknown;
  authorized: boolean;
  loadProfileSuccess: (profile: Profile) => void;
}

export const useUserStore = create<UserState>()(
  middlewares(
    (set) => ({
      user: {},
      authorized: false,
      loadProfileSuccess: (profile: Profile) => set(() => ({ user: profile, authorized: true })),
    }),
    "userStore",
  ),
);
