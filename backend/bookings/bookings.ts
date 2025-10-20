import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

export interface Booking {
  id: string;
  orgId: string;
  quoteId?: string;
  shipId: string;
  prospectId?: number;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  status: "confirmed" | "cancelled" | "completed";
  createdAt: Date;
}

export interface QuickBookRequest {
  shipId: string;
  prospectId?: number;
  quoteId?: string;
  startTime: Date;
  endTime: Date;
}

export interface ConflictAlternative {
  shipId: string;
  shipName: string;
  available: boolean;
}

export const listBookings = api(
  { auth: true, expose: true, method: "GET", path: "/bookings" },
  async (): Promise<{ bookings: Booking[] }> => {
    const auth = getAuthData<AuthData>()!;

    const bookings = await db.queryAll<Booking>`
      SELECT 
        id, org_id as "orgId", quote_id as "quoteId", ship_id as "shipId",
        prospect_id as "prospectId", start_time as "startTime", end_time as "endTime",
        created_by as "createdBy", status, created_at as "createdAt"
      FROM bookings
      WHERE org_id = ${auth.orgId} AND status != 'cancelled'
      ORDER BY start_time ASC
    `;

    return { bookings };
  }
);

export const quickBook = api(
  { auth: true, expose: true, method: "POST", path: "/bookings/quick" },
  async (req: QuickBookRequest): Promise<Booking> => {
    const auth = getAuthData<AuthData>()!;

    const ship = await db.queryRow<{
      id: string;
      name: string;
      status: string;
      status_start?: Date;
      status_end?: Date;
    }>`
      SELECT id, name, status, status_start, status_end
      FROM ships
      WHERE id = ${req.shipId} AND org_id = ${auth.orgId}
    `;

    if (!ship) {
      throw APIError.notFound("Ship not found");
    }

    const now = new Date();
    if (
      ship.status === "maintenance" ||
      ship.status === "offline" ||
      (ship.status_start && ship.status_end && 
       now >= ship.status_start && now <= ship.status_end)
    ) {
      throw APIError.failedPrecondition(
        "Ship is not available for booking due to scheduled maintenance or offline status",
        {
          code: 409,
          metadata: {
            reason: "ship_unavailable",
            status: ship.status,
            statusStart: ship.status_start,
            statusEnd: ship.status_end,
          },
        }
      );
    }

    const conflicts = await db.queryAll<{ id: string }>`
      SELECT id
      FROM bookings
      WHERE ship_id = ${req.shipId}
        AND org_id = ${auth.orgId}
        AND status = 'confirmed'
        AND (
          (start_time <= ${req.startTime} AND end_time > ${req.startTime})
          OR (start_time < ${req.endTime} AND end_time >= ${req.endTime})
          OR (start_time >= ${req.startTime} AND end_time <= ${req.endTime})
        )
    `;

    if (conflicts.length > 0) {
      const alternatives = await db.queryAll<{
        id: string;
        name: string;
      }>`
        SELECT DISTINCT s.id, s.name
        FROM ships s
        WHERE s.org_id = ${auth.orgId}
          AND s.status = 'available'
          AND s.published = true
          AND s.id != ${req.shipId}
          AND NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.ship_id = s.id
              AND b.status = 'confirmed'
              AND (
                (b.start_time <= ${req.startTime} AND b.end_time > ${req.startTime})
                OR (b.start_time < ${req.endTime} AND b.end_time >= ${req.endTime})
                OR (b.start_time >= ${req.startTime} AND b.end_time <= ${req.endTime})
              )
          )
        LIMIT 5
      `;

      const alternativeList: ConflictAlternative[] = alternatives.map((a) => ({
        shipId: a.id,
        shipName: a.name,
        available: true,
      }));

      throw APIError.failedPrecondition(
        "Ship is already booked for the requested time",
        {
          code: 409,
          metadata: {
            reason: "time_conflict",
            alternatives: alternativeList,
          },
        }
      );
    }

    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const booking = await db.queryRow<Booking>`
      INSERT INTO bookings (
        id, org_id, quote_id, ship_id, prospect_id, start_time, end_time,
        created_by, status, created_at
      ) VALUES (
        ${id}, ${auth.orgId}, ${req.quoteId || null}, ${req.shipId},
        ${req.prospectId || null}, ${req.startTime}, ${req.endTime},
        ${auth.userID}, 'confirmed', NOW()
      )
      RETURNING 
        id, org_id as "orgId", quote_id as "quoteId", ship_id as "shipId",
        prospect_id as "prospectId", start_time as "startTime", end_time as "endTime",
        created_by as "createdBy", status, created_at as "createdAt"
    `;

    if (!booking) throw APIError.internal("Failed to create booking");
    return booking;
  }
);
