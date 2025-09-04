import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("crm");

export interface Message {
  id: number;
  lead_id: number;
  channel: "facebook" | "instagram" | "whatsapp" | "email" | "phone";
  message: string;
  sender: "lead" | "agent" | "ai";
  timestamp: Date;
  read: boolean;
}

export interface SendMessageRequest {
  lead_id: number;
  channel: "facebook" | "instagram" | "whatsapp" | "email" | "phone";
  message: string;
  sender: "agent" | "ai";
}

export interface MessagesResponse {
  messages: Message[];
}

// Retrieves messages for a specific lead.
export const getMessages = api<{ lead_id: number }, MessagesResponse>(
  { expose: true, method: "GET", path: "/leads/:lead_id/messages" },
  async (req) => {
    const messages = await db.queryAll<Message>`
      SELECT * FROM messages 
      WHERE lead_id = ${req.lead_id}
      ORDER BY timestamp ASC
    `;
    return { messages };
  }
);

// Sends a new message to a lead.
export const sendMessage = api<SendMessageRequest, Message>(
  { expose: true, method: "POST", path: "/messages" },
  async (req) => {
    const message = await db.queryRow<Message>`
      INSERT INTO messages (lead_id, channel, message, sender, timestamp, read)
      VALUES (${req.lead_id}, ${req.channel}, ${req.message}, ${req.sender}, NOW(), true)
      RETURNING *
    `;
    if (!message) throw new Error("Failed to send message");
    return message;
  }
);

// Marks messages as read.
export const markAsRead = api<{ lead_id: number }, void>(
  { expose: true, method: "PUT", path: "/leads/:lead_id/messages/read" },
  async (req) => {
    await db.exec`
      UPDATE messages 
      SET read = true 
      WHERE lead_id = ${req.lead_id} AND read = false
    `;
  }
);
