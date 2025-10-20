import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";
import db from "../db";

export interface ServiceLineItem {
  serviceId: string;
  quantity: number;
}

export interface CalculateQuoteRequest {
  shipId: string;
  hours: number;
  people: number;
  services: ServiceLineItem[];
}

export interface BreakdownItem {
  type: "ship" | "service" | "rule";
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  adjustment: number;
}

export interface CalculateQuoteResponse {
  breakdown: BreakdownItem[];
  appliedRules: AppliedRule[];
  subtotal: number;
  tax: number;
  total: number;
}

export const calculateQuote = api(
  { auth: true, expose: true, method: "POST", path: "/quotes/calc" },
  async (req: CalculateQuoteRequest): Promise<CalculateQuoteResponse> => {
    const auth = getAuthData<AuthData>()!;

    const ship = await db.queryRow<{
      id: string;
      name: string;
      hourly_rate: number;
      published: boolean;
    }>`
      SELECT id, name, hourly_rate, published
      FROM ships
      WHERE id = ${req.shipId} AND org_id = ${auth.orgId}
    `;

    if (!ship) {
      throw APIError.notFound("Ship not found");
    }

    if (!ship.published) {
      throw APIError.invalidArgument("Cannot quote unpublished ship");
    }

    const breakdown: BreakdownItem[] = [];
    let subtotal = 0;

    const shipCharge = ship.hourly_rate * req.hours;
    breakdown.push({
      type: "ship",
      name: ship.name,
      quantity: req.hours,
      unitPrice: ship.hourly_rate,
      total: shipCharge,
    });
    subtotal += shipCharge;

    if (req.services && req.services.length > 0) {
      const serviceIds = req.services.map((s) => s.serviceId);
      const services = await db.queryAll<{
        id: string;
        name: string;
        unit_price: number;
        unit_type: string;
        published: boolean;
      }>`
        SELECT id, name, unit_price, unit_type, published
        FROM services
        WHERE id = ANY(${serviceIds}) AND org_id = ${auth.orgId}
      `;

      for (const svc of services) {
        if (!svc.published) {
          throw APIError.invalidArgument(`Cannot quote unpublished service: ${svc.name}`);
        }

        const lineItem = req.services.find((s) => s.serviceId === svc.id);
        if (!lineItem) continue;

        let serviceTotal = 0;
        let quantity = lineItem.quantity;

        if (svc.unit_type === "per_hour") {
          serviceTotal = svc.unit_price * lineItem.quantity * req.hours;
          quantity = lineItem.quantity * req.hours;
        } else if (svc.unit_type === "per_person") {
          serviceTotal = svc.unit_price * lineItem.quantity * req.people;
          quantity = lineItem.quantity * req.people;
        } else {
          serviceTotal = svc.unit_price * lineItem.quantity;
        }

        breakdown.push({
          type: "service",
          name: svc.name,
          quantity,
          unitPrice: svc.unit_price,
          total: serviceTotal,
        });

        subtotal += serviceTotal;
      }
    }

    const rules = await db.queryAll<{
      id: string;
      name: string;
      condition: any;
      action: any;
      priority: number;
    }>`
      SELECT id, name, condition, action, priority
      FROM pricing_rules
      WHERE org_id = ${auth.orgId} AND published = true
      ORDER BY priority DESC
    `;

    const appliedRules: AppliedRule[] = [];

    for (const rule of rules) {
      const conditionMet = evaluateCondition(rule.condition, {
        hours: req.hours,
        people: req.people,
        subtotal,
      });

      if (conditionMet) {
        const adjustment = applyRuleAction(rule.action, subtotal);
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          adjustment,
        });
        subtotal += adjustment;
      }
    }

    const tax = subtotal * 0.0;
    const total = subtotal + tax;

    return {
      breakdown,
      appliedRules,
      subtotal,
      tax,
      total,
    };
  }
);

export function evaluateCondition(condition: any, context: any): boolean {
  if (!condition || !condition.field) return false;

  const fieldValue = context[condition.field];
  const conditionValue = condition.value;

  switch (condition.operator) {
    case "gt":
      return fieldValue > conditionValue;
    case "gte":
      return fieldValue >= conditionValue;
    case "lt":
      return fieldValue < conditionValue;
    case "lte":
      return fieldValue <= conditionValue;
    case "eq":
      return fieldValue === conditionValue;
    default:
      return false;
  }
}

export function applyRuleAction(action: any, subtotal: number): number {
  if (!action || !action.type) return 0;

  switch (action.type) {
    case "discount_percent":
      return -(subtotal * (action.value / 100));
    case "discount_fixed":
      return -action.value;
    case "surcharge_percent":
      return subtotal * (action.value / 100);
    case "surcharge_fixed":
      return action.value;
    default:
      return 0;
  }
}
