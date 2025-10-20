import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

export interface PricingRule {
  id: string;
  orgId: string;
  name: string;
  condition: any;
  action: any;
  priority: number;
  version: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePricingRuleRequest {
  name: string;
  condition: any;
  action: any;
  priority?: number;
}

export interface UpdatePricingRuleRequest {
  id: string;
  name?: string;
  condition?: any;
  action?: any;
  priority?: number;
  published?: boolean;
}

export const listPricingRules = api(
  { auth: true, expose: true, method: "GET", path: "/pricing-rules" },
  async (): Promise<{ rules: PricingRule[] }> => {
    const auth = getAuthData<AuthData>()!;

    const rules = await db.queryAll<PricingRule>`
      SELECT 
        id, org_id as "orgId", name, condition, action, priority, version,
        published, created_at as "createdAt", updated_at as "updatedAt"
      FROM pricing_rules
      WHERE org_id = ${auth.orgId}
      ORDER BY priority DESC, name ASC
    `;

    return { rules };
  }
);

export const createPricingRule = api(
  { auth: true, expose: true, method: "POST", path: "/pricing-rules" },
  async (req: CreatePricingRuleRequest): Promise<PricingRule> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can create pricing rules");
    }

    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const rule = await db.queryRow<PricingRule>`
      INSERT INTO pricing_rules (
        id, org_id, name, condition, action, priority, version,
        published, created_at, updated_at
      ) VALUES (
        ${id}, ${auth.orgId}, ${req.name}, ${JSON.stringify(req.condition)},
        ${JSON.stringify(req.action)}, ${req.priority || 0}, 1,
        false, NOW(), NOW()
      )
      RETURNING 
        id, org_id as "orgId", name, condition, action, priority, version,
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    if (!rule) throw APIError.internal("Failed to create pricing rule");
    return rule;
  }
);

export const updatePricingRule = api(
  { auth: true, expose: true, method: "PUT", path: "/pricing-rules/:id" },
  async (req: UpdatePricingRuleRequest): Promise<PricingRule> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can update pricing rules");
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (req.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(req.name);
    }
    if (req.condition !== undefined) {
      updates.push(`condition = $${values.length + 1}`);
      values.push(JSON.stringify(req.condition));
    }
    if (req.action !== undefined) {
      updates.push(`action = $${values.length + 1}`);
      values.push(JSON.stringify(req.action));
    }
    if (req.priority !== undefined) {
      updates.push(`priority = $${values.length + 1}`);
      values.push(req.priority);
    }
    if (req.published !== undefined) {
      updates.push(`published = $${values.length + 1}`);
      values.push(req.published);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    updates.push(`version = version + 1`);
    values.push(req.id);
    values.push(auth.orgId);

    const query = `
      UPDATE pricing_rules
      SET ${updates.join(", ")}
      WHERE id = $${values.length - 1} AND org_id = $${values.length}
      RETURNING 
        id, org_id as "orgId", name, condition, action, priority, version,
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const rule = await db.rawQueryRow<PricingRule>(query, ...values);
    if (!rule) throw APIError.notFound("Pricing rule not found");
    return rule;
  }
);
