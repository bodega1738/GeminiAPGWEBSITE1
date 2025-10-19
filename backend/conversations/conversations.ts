import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { getAuthData } from "~encore/auth";
import { secret } from "encore.dev/config";
import type { AuthData } from "../auth/auth";

const db = SQLDatabase.named("crm");
const unipileToken = secret("UNIPILE_TOKEN");

export interface Thread {
  id: string;
  orgId: string;
  prospectId?: number;
  sourcePlatform: string;
  chatId: string;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  message: string;
  senderType: "prospect" | "agent" | "ai";
  senderId?: string;
  timestamp: Date;
}

export interface SendMessageRequest {
  threadId: string;
  message: string;
}

export const listThreads = api(
  { auth: true, expose: true, method: "GET", path: "/conversations" },
  async (): Promise<{ threads: Thread[] }> => {
    const auth = getAuthData<AuthData>()!;

    const threads = await db.queryAll<Thread>`
      SELECT 
        id, org_id as "orgId", prospect_id as "prospectId",
        source_platform as "sourcePlatform", chat_id as "chatId",
        last_message_at as "lastMessageAt", created_at as "createdAt"
      FROM threads
      WHERE org_id = ${auth.orgId}
      ORDER BY last_message_at DESC NULLS LAST, created_at DESC
    `;

    return { threads };
  }
);

export const getThreadMessages = api(
  { auth: true, expose: true, method: "GET", path: "/conversations/:threadId/messages" },
  async (req: { threadId: string }): Promise<{ messages: ThreadMessage[] }> => {
    const auth = getAuthData<AuthData>()!;

    const thread = await db.queryRow<{ org_id: string }>`
      SELECT org_id
      FROM threads
      WHERE id = ${req.threadId}
    `;

    if (!thread || thread.org_id !== auth.orgId) {
      throw APIError.notFound("Thread not found");
    }

    const messages = await db.queryAll<ThreadMessage>`
      SELECT 
        id, thread_id as "threadId", message,
        sender_type as "senderType", sender_id as "senderId", timestamp
      FROM thread_messages
      WHERE thread_id = ${req.threadId}
      ORDER BY timestamp ASC
    `;

    return { messages };
  }
);

export const sendMessage = api(
  { auth: true, expose: true, method: "POST", path: "/conversations/send" },
  async (req: SendMessageRequest): Promise<ThreadMessage> => {
    const auth = getAuthData<AuthData>()!;

    const thread = await db.queryRow<{
      id: string;
      org_id: string;
      source_platform: string;
      chat_id: string;
    }>`
      SELECT id, org_id, source_platform, chat_id
      FROM threads
      WHERE id = ${req.threadId}
    `;

    if (!thread || thread.org_id !== auth.orgId) {
      throw APIError.notFound("Thread not found");
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const message = await db.queryRow<ThreadMessage>`
      INSERT INTO thread_messages (
        id, thread_id, message, sender_type, sender_id, timestamp
      ) VALUES (
        ${id}, ${req.threadId}, ${req.message}, 'agent', ${auth.userID}, NOW()
      )
      RETURNING 
        id, thread_id as "threadId", message,
        sender_type as "senderType", sender_id as "senderId", timestamp
    `;

    if (!message) throw APIError.internal("Failed to send message");

    await db.exec`
      UPDATE threads
      SET last_message_at = NOW()
      WHERE id = ${req.threadId}
    `;

    return message;
  }
);

export const inboundWebhook = api(
  { expose: true, method: "POST", path: "/conversations/webhook" },
  async (req: {
    platform: string;
    chatId: string;
    message: string;
    senderId?: string;
  }): Promise<{ success: boolean }> => {
    const orgId = "default_org";

    let thread = await db.queryRow<{ id: string }>`
      SELECT id
      FROM threads
      WHERE org_id = ${orgId} 
        AND source_platform = ${req.platform}
        AND chat_id = ${req.chatId}
    `;

    if (!thread) {
      const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      thread = await db.queryRow<{ id: string }>`
        INSERT INTO threads (
          id, org_id, source_platform, chat_id, last_message_at, created_at
        ) VALUES (
          ${threadId}, ${orgId}, ${req.platform}, ${req.chatId}, NOW(), NOW()
        )
        RETURNING id
      `;
    }

    if (thread) {
      const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.exec`
        INSERT INTO thread_messages (
          id, thread_id, message, sender_type, sender_id, timestamp
        ) VALUES (
          ${msgId}, ${thread.id}, ${req.message}, 'prospect',
          ${req.senderId || null}, NOW()
        )
      `;

      await db.exec`
        UPDATE threads
        SET last_message_at = NOW()
        WHERE id = ${thread.id}
      `;
    }

    return { success: true };
  }
);
