import { Header, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("crm", { migrations: "../crm/migrations" });

interface AuthParams {
  authorization?: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  email: string;
  role: "Admin" | "Staff";
  orgId: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    const user = await db.queryRow<{
      id: string;
      email: string;
      role: "Admin" | "Staff";
      org_id: string;
      status: string;
    }>`
      SELECT id, email, role, org_id, status
      FROM users
      WHERE id = ${token}
    `;

    if (!user) {
      throw APIError.unauthenticated("invalid token");
    }

    if (user.status !== "Active") {
      throw APIError.unauthenticated("user not active");
    }

    return {
      userID: user.id,
      email: user.email,
      role: user.role,
      orgId: user.org_id,
    };
  }
);

export const gw = new Gateway({ authHandler: auth });
