import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "./auth";

export interface UserInfo {
  id: string;
  email: string;
  role: "Admin" | "Staff";
  orgId: string;
}

export const me = api<void, UserInfo>(
  { auth: true, expose: true, method: "GET", path: "/me" },
  async () => {
    const auth = getAuthData<AuthData>()!;
    return {
      id: auth.userID,
      email: auth.email,
      role: auth.role,
      orgId: auth.orgId,
    };
  }
);
