import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

export interface YachtService {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  unitPrice: number;
  unitType: "per_hour" | "per_person" | "flat";
  defaultQuantity: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  unitPrice: number;
  unitType: "per_hour" | "per_person" | "flat";
  defaultQuantity?: number;
}

export interface UpdateServiceRequest {
  id: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  unitType?: "per_hour" | "per_person" | "flat";
  defaultQuantity?: number;
  published?: boolean;
}

export const listServices = api(
  { auth: true, expose: true, method: "GET", path: "/services" },
  async (): Promise<{ services: YachtService[] }> => {
    const auth = getAuthData<AuthData>()!;

    const services = await db.queryAll<YachtService>`
      SELECT 
        id, org_id as "orgId", name, description, unit_price as "unitPrice",
        unit_type as "unitType", default_quantity as "defaultQuantity",
        published, created_at as "createdAt", updated_at as "updatedAt"
      FROM services
      WHERE org_id = ${auth.orgId}
      ORDER BY name ASC
    `;

    return { services };
  }
);

export const createService = api(
  { auth: true, expose: true, method: "POST", path: "/services" },
  async (req: CreateServiceRequest): Promise<YachtService> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can create services");
    }

    const id = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const service = await db.queryRow<YachtService>`
      INSERT INTO services (
        id, org_id, name, description, unit_price, unit_type, 
        default_quantity, published, created_at, updated_at
      ) VALUES (
        ${id}, ${auth.orgId}, ${req.name}, ${req.description || null},
        ${req.unitPrice}, ${req.unitType}, ${req.defaultQuantity || 1},
        false, NOW(), NOW()
      )
      RETURNING 
        id, org_id as "orgId", name, description, unit_price as "unitPrice",
        unit_type as "unitType", default_quantity as "defaultQuantity",
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    if (!service) throw APIError.internal("Failed to create service");
    return service;
  }
);

export const updateService = api(
  { auth: true, expose: true, method: "PUT", path: "/services/:id" },
  async (req: UpdateServiceRequest): Promise<YachtService> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can update services");
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (req.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(req.name);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${values.length + 1}`);
      values.push(req.description);
    }
    if (req.unitPrice !== undefined) {
      updates.push(`unit_price = $${values.length + 1}`);
      values.push(req.unitPrice);
    }
    if (req.unitType !== undefined) {
      updates.push(`unit_type = $${values.length + 1}`);
      values.push(req.unitType);
    }
    if (req.defaultQuantity !== undefined) {
      updates.push(`default_quantity = $${values.length + 1}`);
      values.push(req.defaultQuantity);
    }
    if (req.published !== undefined) {
      updates.push(`published = $${values.length + 1}`);
      values.push(req.published);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);
    values.push(auth.orgId);

    const query = `
      UPDATE services
      SET ${updates.join(", ")}
      WHERE id = $${values.length - 1} AND org_id = $${values.length}
      RETURNING 
        id, org_id as "orgId", name, description, unit_price as "unitPrice",
        unit_type as "unitType", default_quantity as "defaultQuantity",
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const service = await db.rawQueryRow<YachtService>(query, ...values);
    if (!service) throw APIError.notFound("Service not found");
    return service;
  }
);
