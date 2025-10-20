import { api, APIError, Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

export interface Ship {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  hourlyRate: number;
  capacity: number;
  images: string[];
  status: "available" | "booked" | "maintenance" | "offline" | "reserved";
  statusReason?: string;
  statusStart?: Date;
  statusEnd?: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipRequest {
  name: string;
  description?: string;
  hourlyRate: number;
  capacity: number;
}

export interface UpdateShipRequest {
  id: string;
  name?: string;
  description?: string;
  hourlyRate?: number;
  capacity?: number;
  images?: string[];
  published?: boolean;
}

export interface UpdateShipStatusRequest {
  id: string;
  status: "available" | "booked" | "maintenance" | "offline" | "reserved";
  statusReason?: string;
  statusStart?: Date;
  statusEnd?: Date;
}

export const listShips = api(
  { auth: true, expose: true, method: "GET", path: "/ships" },
  async (): Promise<{ ships: Ship[] }> => {
    const auth = getAuthData<AuthData>()!;

    const ships = await db.queryAll<Ship>`
      SELECT 
        id, org_id as "orgId", name, description, hourly_rate as "hourlyRate",
        capacity, images, status, status_reason as "statusReason",
        status_start as "statusStart", status_end as "statusEnd",
        published, created_at as "createdAt", updated_at as "updatedAt"
      FROM ships
      WHERE org_id = ${auth.orgId}
      ORDER BY name ASC
    `;

    return { ships };
  }
);

export const createShip = api(
  { auth: true, expose: true, method: "POST", path: "/ships" },
  async (req: CreateShipRequest): Promise<Ship> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can create ships");
    }

    const id = `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const ship = await db.queryRow<Ship>`
      INSERT INTO ships (
        id, org_id, name, description, hourly_rate, capacity, 
        status, published, created_at, updated_at
      ) VALUES (
        ${id}, ${auth.orgId}, ${req.name}, ${req.description || null},
        ${req.hourlyRate}, ${req.capacity}, 'available', false, NOW(), NOW()
      )
      RETURNING 
        id, org_id as "orgId", name, description, hourly_rate as "hourlyRate",
        capacity, images, status, status_reason as "statusReason",
        status_start as "statusStart", status_end as "statusEnd",
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    if (!ship) throw APIError.internal("Failed to create ship");
    return ship;
  }
);

export const updateShip = api(
  { auth: true, expose: true, method: "PUT", path: "/ships/:id" },
  async (req: UpdateShipRequest): Promise<Ship> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can update ships");
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
    if (req.hourlyRate !== undefined) {
      updates.push(`hourly_rate = $${values.length + 1}`);
      values.push(req.hourlyRate);
    }
    if (req.capacity !== undefined) {
      updates.push(`capacity = $${values.length + 1}`);
      values.push(req.capacity);
    }
    if (req.images !== undefined) {
      updates.push(`images = $${values.length + 1}`);
      values.push(JSON.stringify(req.images));
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
      UPDATE ships
      SET ${updates.join(", ")}
      WHERE id = $${values.length - 1} AND org_id = $${values.length}
      RETURNING 
        id, org_id as "orgId", name, description, hourly_rate as "hourlyRate",
        capacity, images, status, status_reason as "statusReason",
        status_start as "statusStart", status_end as "statusEnd",
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const ship = await db.rawQueryRow<Ship>(query, ...values);
    if (!ship) throw APIError.notFound("Ship not found");
    return ship;
  }
);

export const updateShipStatus = api(
  { auth: true, expose: true, method: "POST", path: "/ships/:id/status" },
  async (req: UpdateShipStatusRequest): Promise<Ship> => {
    const auth = getAuthData<AuthData>()!;

    if (auth.role !== "Admin") {
      throw APIError.permissionDenied("Only admins can update ship status");
    }

    const ship = await db.queryRow<Ship>`
      UPDATE ships
      SET 
        status = ${req.status},
        status_reason = ${req.statusReason || null},
        status_start = ${req.statusStart || null},
        status_end = ${req.statusEnd || null},
        updated_at = NOW()
      WHERE id = ${req.id} AND org_id = ${auth.orgId}
      RETURNING 
        id, org_id as "orgId", name, description, hourly_rate as "hourlyRate",
        capacity, images, status, status_reason as "statusReason",
        status_start as "statusStart", status_end as "statusEnd",
        published, created_at as "createdAt", updated_at as "updatedAt"
    `;

    if (!ship) throw APIError.notFound("Ship not found");
    return ship;
  }
);
