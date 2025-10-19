import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";
import type { AuthData } from "../auth/auth";

const db = SQLDatabase.named("crm");
const openAIKey = secret("OpenAIToken");

export interface AIQueryRequest {
  contextType?: string;
  contextId?: string;
  prompt: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

export interface AIUsageStats {
  queriesThisMonth: number;
  queriesLimit: number;
  queriesRemaining: number;
}

export const queryAssistant = api(
  { auth: true, expose: true, method: "POST", path: "/ai/query" },
  async (req: AIQueryRequest): Promise<AIQueryResponse> => {
    const auth = getAuthData<AuthData>()!;

    const settings = await db.queryRow<{
      toggles: any;
      active_ai_provider_key_name?: string;
    }>`
      SELECT toggles, active_ai_provider_key_name
      FROM settings
      WHERE org_id = ${auth.orgId}
    `;

    if (!settings || !settings.toggles?.aiAssistant) {
      throw APIError.failedPrecondition("AI Assistant is disabled for this organization");
    }

    const usageCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM ai_usage
      WHERE org_id = ${auth.orgId}
        AND user_id = ${auth.userID}
        AND EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM NOW())
        AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM NOW())
    `;

    const userLimit = 100;
    if (usageCount && usageCount.count >= userLimit) {
      throw APIError.resourceExhausted("Monthly AI query limit exceeded");
    }

    let contextData: any = null;
    let sources: string[] = [];

    if (req.contextType && req.contextId) {
      if (req.contextType === "prospect") {
        const prospect = await db.queryRow<any>`
          SELECT id, name, email, phone
          FROM leads
          WHERE id = ${parseInt(req.contextId)}
        `;
        if (prospect) {
          contextData = prospect;
          sources.push(`Prospect: ${prospect.name}`);
        }
      } else if (req.contextType === "ship") {
        const ship = await db.queryRow<any>`
          SELECT id, name, hourly_rate, capacity
          FROM ships
          WHERE id = ${req.contextId} AND org_id = ${auth.orgId}
        `;
        if (ship) {
          contextData = ship;
          sources.push(`Ship: ${ship.name}`);
        }
      }
    }

    const answer = await generateAIResponse(req.prompt, contextData);

    await db.exec`
      INSERT INTO ai_usage (
        org_id, user_id, provider_key_name, context_type, context_id,
        prompt, response, confidence, sources, timestamp
      ) VALUES (
        ${auth.orgId}, ${auth.userID}, ${settings.active_ai_provider_key_name || "default"},
        ${req.contextType || null}, ${req.contextId || null}, ${req.prompt},
        ${answer}, 0.85, ${JSON.stringify(sources)}, NOW()
      )
    `;

    return {
      answer,
      sources,
      confidence: 0.85,
    };
  }
);

export const getUsageStats = api(
  { auth: true, expose: true, method: "GET", path: "/ai/usage" },
  async (): Promise<AIUsageStats> => {
    const auth = getAuthData<AuthData>()!;

    const usageCount = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count
      FROM ai_usage
      WHERE org_id = ${auth.orgId}
        AND user_id = ${auth.userID}
        AND EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM NOW())
        AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM NOW())
    `;

    const userLimit = 100;
    const count = usageCount?.count || 0;

    return {
      queriesThisMonth: count,
      queriesLimit: userLimit,
      queriesRemaining: Math.max(0, userLimit - count),
    };
  }
);

async function generateAIResponse(prompt: string, context: any): Promise<string> {
  let response = `Based on the query "${prompt}"`;

  if (context) {
    response += ` and the provided context, here is a helpful response. `;
    response += `Context includes: ${JSON.stringify(context).substring(0, 100)}...`;
  } else {
    response += `, here is a general response.`;
  }

  response += ` This is a simulated AI response. In production, this would call the OpenAI API using the configured provider key.`;

  return response;
}
