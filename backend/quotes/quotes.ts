import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import type { ServiceLineItem, BreakdownItem, AppliedRule } from "./calculator";
import db from "../db";

export interface Quote {
  id: string;
  orgId: string;
  prospectId?: number;
  shipId: string;
  hours: number;
  people: number;
  services: ServiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdBy: string;
  createdAt: Date;
  publishedConfigVersion?: number;
  immutableSnapshot: {
    breakdown: BreakdownItem[];
    appliedRules: AppliedRule[];
    shipSnapshot: any;
    servicesSnapshot: any[];
  };
}

export interface CreateQuoteRequest {
  prospectId?: number;
  shipId: string;
  hours: number;
  people: number;
  services: ServiceLineItem[];
  breakdown: BreakdownItem[];
  appliedRules: AppliedRule[];
  subtotal: number;
  tax: number;
  total: number;
}

export const listQuotes = api(
  { auth: true, expose: true, method: "GET", path: "/quotes" },
  async (): Promise<{ quotes: Quote[] }> => {
    const auth = getAuthData<AuthData>()!;

    const quotes = await db.queryAll<Quote>`
      SELECT 
        id, org_id as "orgId", prospect_id as "prospectId", ship_id as "shipId",
        hours, people, services, subtotal, tax, total,
        created_by as "createdBy", created_at as "createdAt",
        published_config_version as "publishedConfigVersion",
        immutable_snapshot as "immutableSnapshot"
      FROM quotes
      WHERE org_id = ${auth.orgId}
      ORDER BY created_at DESC
    `;

    return { quotes };
  }
);

export const createQuote = api(
  { auth: true, expose: true, method: "POST", path: "/quotes" },
  async (req: CreateQuoteRequest): Promise<Quote> => {
    const auth = getAuthData<AuthData>()!;

    const ship = await db.queryRow<any>`
      SELECT id, name, hourly_rate, capacity, published
      FROM ships
      WHERE id = ${req.shipId} AND org_id = ${auth.orgId}
    `;

    if (!ship) {
      throw APIError.notFound("Ship not found");
    }

    const serviceIds = req.services.map((s) => s.serviceId);
    const services = serviceIds.length > 0
      ? await db.queryAll<any>`
          SELECT id, name, unit_price, unit_type, published
          FROM services
          WHERE id = ANY(${serviceIds}) AND org_id = ${auth.orgId}
        `
      : [];

    const id = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const immutableSnapshot = {
      breakdown: req.breakdown,
      appliedRules: req.appliedRules,
      shipSnapshot: ship,
      servicesSnapshot: services,
    };

    const quote = await db.queryRow<Quote>`
      INSERT INTO quotes (
        id, org_id, prospect_id, ship_id, hours, people, services,
        subtotal, tax, total, created_by, created_at, 
        published_config_version, immutable_snapshot
      ) VALUES (
        ${id}, ${auth.orgId}, ${req.prospectId || null}, ${req.shipId},
        ${req.hours}, ${req.people}, ${JSON.stringify(req.services)},
        ${req.subtotal}, ${req.tax}, ${req.total}, ${auth.userID}, NOW(),
        1, ${JSON.stringify(immutableSnapshot)}
      )
      RETURNING 
        id, org_id as "orgId", prospect_id as "prospectId", ship_id as "shipId",
        hours, people, services, subtotal, tax, total,
        created_by as "createdBy", created_at as "createdAt",
        published_config_version as "publishedConfigVersion",
        immutable_snapshot as "immutableSnapshot"
    `;

    if (!quote) throw APIError.internal("Failed to create quote");
    return quote;
  }
);
