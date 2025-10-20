import { api } from "encore.dev/api";
import db from "../db";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: "facebook" | "instagram" | "whatsapp" | "website" | "referral";
  status: "new" | "contacted" | "qualified" | "proposal" | "booked" | "lost";
  priority: "low" | "medium" | "high" | "urgent";
  vessel_type: string;
  booking_date?: string;
  party_size: number;
  budget: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  response_time?: number;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone: string;
  source: "facebook" | "instagram" | "whatsapp" | "website" | "referral";
  vessel_type: string;
  booking_date?: string;
  party_size: number;
  budget: number;
  notes?: string;
}

export interface UpdateLeadRequest {
  id: number;
  status?: "new" | "contacted" | "qualified" | "proposal" | "booked" | "lost";
  priority?: "low" | "medium" | "high" | "urgent";
  name?: string;
  email?: string;
  phone?: string;
  vessel_type?: string;
  booking_date?: string;
  party_size?: number;
  budget?: number;
  notes?: string;
}

export interface LeadsResponse {
  leads: Lead[];
}

export interface DashboardMetrics {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  conversion_rate: number;
  avg_response_time: number;
  total_revenue: number;
  pending_proposals: number;
}

export const getLeads = api<void, LeadsResponse>(
  { expose: true, method: "GET", path: "/leads" },
  async () => {
    const leads = await db.queryAll<Lead>`
      SELECT * FROM leads 
      ORDER BY created_at DESC
    `;
    return { leads };
  }
);

export const createLead = api<CreateLeadRequest, Lead>(
  { expose: true, method: "POST", path: "/leads" },
  async (req) => {
    const lead = await db.queryRow<Lead>`
      INSERT INTO leads (
        name, email, phone, source, vessel_type, booking_date, 
        party_size, budget, notes, status, priority, created_at, updated_at
      ) VALUES (
        ${req.name}, ${req.email}, ${req.phone}, ${req.source}, 
        ${req.vessel_type}, ${req.booking_date}, ${req.party_size}, 
        ${req.budget}, ${req.notes || ""}, 'new', 'medium', NOW(), NOW()
      ) RETURNING *
    `;
    if (!lead) throw new Error("Failed to create lead");
    return lead;
  }
);

export const updateLead = api<UpdateLeadRequest, Lead>(
  { expose: true, method: "PUT", path: "/leads/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (req.status !== undefined) {
      updates.push(`status = $${values.length + 1}`);
      values.push(req.status);
    }
    if (req.priority !== undefined) {
      updates.push(`priority = $${values.length + 1}`);
      values.push(req.priority);
    }
    if (req.name !== undefined) {
      updates.push(`name = $${values.length + 1}`);
      values.push(req.name);
    }
    if (req.email !== undefined) {
      updates.push(`email = $${values.length + 1}`);
      values.push(req.email);
    }
    if (req.phone !== undefined) {
      updates.push(`phone = $${values.length + 1}`);
      values.push(req.phone);
    }
    if (req.vessel_type !== undefined) {
      updates.push(`vessel_type = $${values.length + 1}`);
      values.push(req.vessel_type);
    }
    if (req.booking_date !== undefined) {
      updates.push(`booking_date = $${values.length + 1}`);
      values.push(req.booking_date);
    }
    if (req.party_size !== undefined) {
      updates.push(`party_size = $${values.length + 1}`);
      values.push(req.party_size);
    }
    if (req.budget !== undefined) {
      updates.push(`budget = $${values.length + 1}`);
      values.push(req.budget);
    }
    if (req.notes !== undefined) {
      updates.push(`notes = $${values.length + 1}`);
      values.push(req.notes);
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(req.id);
    
    const query = `
      UPDATE leads 
      SET ${updates.join(', ')} 
      WHERE id = $${values.length} 
      RETURNING *
    `;
    
    const lead = await db.rawQueryRow<Lead>(query, ...values);
    if (!lead) throw new Error("Lead not found");
    return lead;
  }
);

export const getDashboardMetrics = api<void, DashboardMetrics>(
  { expose: true, method: "GET", path: "/dashboard/metrics" },
  async () => {
    const metrics = await db.queryRow<DashboardMetrics>`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(*) FILTER (WHERE status = 'new') as new_leads,
        COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'booked')::decimal / 
           NULLIF(COUNT(*), 0) * 100), 2
        ) as conversion_rate,
        COALESCE(AVG(response_time), 0) as avg_response_time,
        COALESCE(SUM(budget) FILTER (WHERE status = 'booked'), 0) as total_revenue,
        COUNT(*) FILTER (WHERE status = 'proposal') as pending_proposals
      FROM leads
    `;
    
    if (!metrics) {
      return {
        total_leads: 0,
        new_leads: 0,
        qualified_leads: 0,
        conversion_rate: 0,
        avg_response_time: 0,
        total_revenue: 0,
        pending_proposals: 0,
      };
    }
    
    return metrics;
  }
);
