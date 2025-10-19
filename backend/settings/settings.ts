import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";

const db = SQLDatabase.named("crm");

export interface OrgSettings {
  orgId: string;
  toggles: {
    messaging?: boolean;
    audit?: boolean;
    exports?: boolean;
    invites?: boolean;
    aiAssistant?: boolean;
  };
  activeAiProviderKeyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSettingsRequest {
  toggles?: {
    messaging?: boolean;
    audit?: boolean;
    exports?: boolean;
    invites?: boolean;
    aiAssistant?: boolean;
  };
  activeAiProviderKeyName?: string;
}

export const getSettings = api(
  { auth: true, expose: true, method: "GET", path: "/settings" },
  async (): Promise<OrgSettings> => {
    const auth = getAuthData<AuthData>()!;

    let settings = await db.queryRow<OrgSettings>`
      SELECT 
        org_id as "orgId", toggles,
        active_ai_provider_key_name as "activeAiProviderKeyName",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM settings
      WHERE org_id = ${auth.orgId}
    `;

    if (!settings) {
      settings = await db.queryRow<OrgSettings>`
        INSERT INTO settings (org_id, toggles, created_at, updated_at)
        VALUES (${auth.orgId}, '{}', NOW(), NOW())
        RETURNING 
          org_id as "orgId", toggles,
          active_ai_provider_key_name as "activeAiProviderKeyName",
          created_at as "createdAt", updated_at as "updatedAt"
      `;
    }

    if (!settings) throw APIError.internal("Failed to get settings");
    return settings;
  }
);

export const updateSettings = api(
  { auth: true, expose: true, method: "PATCH", path: "/settings" },
  async (req: UpdateSettingsRequest): Promise<OrgSettings> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can update settings");
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (req.toggles !== undefined) {
      updates.push(`toggles = $${values.length + 1}`);
      values.push(JSON.stringify(req.toggles));
    }

    if (req.activeAiProviderKeyName !== undefined) {
      updates.push(`active_ai_provider_key_name = $${values.length + 1}`);
      values.push(req.activeAiProviderKeyName);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(auth.orgId);

    const query = `
      UPDATE settings
      SET ${updates.join(", ")}
      WHERE org_id = $${values.length}
      RETURNING 
        org_id as "orgId", toggles,
        active_ai_provider_key_name as "activeAiProviderKeyName",
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const settings = await db.rawQueryRow<OrgSettings>(query, ...values);
    if (!settings) throw APIError.notFound("Settings not found");
    return settings;
  }
);
