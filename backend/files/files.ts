import { api, APIError, Query } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Bucket } from "encore.dev/storage/objects";
import { getAuthData } from "~encore/auth";
import type { AuthData } from "../auth/auth";

const db = SQLDatabase.named("crm");
const fileBucket = new Bucket("crm-files");

export interface FileMetadata {
  id: string;
  orgId: string;
  ownerType: "ship" | "prospect";
  ownerId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
  isPublic: boolean;
  isPrimary: boolean;
}

export interface UploadUrlRequest {
  ownerType: "ship" | "prospect";
  ownerId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export interface UploadUrlResponse {
  fileId: string;
  uploadUrl: string;
}

export const getUploadUrl = api(
  { auth: true, expose: true, method: "POST", path: "/files/upload-url" },
  async (req: UploadUrlRequest): Promise<UploadUrlResponse> => {
    const auth = getAuthData<AuthData>()!;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(req.contentType)) {
      throw APIError.invalidArgument("File type not allowed");
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.sizeBytes > maxSize) {
      throw APIError.invalidArgument("File size exceeds 10MB limit");
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const objectName = `${auth.orgId}/${req.ownerType}/${req.ownerId}/${fileId}_${req.filename}`;

    const { url: uploadUrl } = await fileBucket.signedUploadUrl(objectName, {
      ttl: 3600,
    });

    await db.exec`
      INSERT INTO files (
        id, org_id, owner_type, owner_id, filename, content_type,
        size_bytes, url, uploaded_by, uploaded_at, is_public, is_primary
      ) VALUES (
        ${fileId}, ${auth.orgId}, ${req.ownerType}, ${req.ownerId},
        ${req.filename}, ${req.contentType}, ${req.sizeBytes},
        ${objectName}, ${auth.userID}, NOW(), false, false
      )
    `;

    return { fileId, uploadUrl };
  }
);

export const listFiles = api(
  {
    auth: true,
    expose: true,
    method: "GET",
    path: "/files",
  },
  async (req: {
    ownerType: Query<"ownerType">;
    ownerId: Query<"ownerId">;
  }): Promise<{ files: FileMetadata[] }> => {
    const auth = getAuthData<AuthData>()!;

    const files = await db.queryAll<FileMetadata>`
      SELECT 
        id, org_id as "orgId", owner_type as "ownerType", owner_id as "ownerId",
        filename, content_type as "contentType", size_bytes as "sizeBytes",
        url, thumbnail_url as "thumbnailUrl", uploaded_by as "uploadedBy",
        uploaded_at as "uploadedAt", is_public as "isPublic", is_primary as "isPrimary"
      FROM files
      WHERE org_id = ${auth.orgId}
        AND owner_type = ${req.ownerType}
        AND owner_id = ${req.ownerId}
      ORDER BY uploaded_at DESC
    `;

    return { files };
  }
);

export const getFileUrl = api(
  { auth: true, expose: true, method: "GET", path: "/files/:fileId/url" },
  async (req: { fileId: string }): Promise<{ url: string }> => {
    const auth = getAuthData<AuthData>()!;

    const file = await db.queryRow<{ url: string; org_id: string }>`
      SELECT url, org_id
      FROM files
      WHERE id = ${req.fileId}
    `;

    if (!file || file.org_id !== auth.orgId) {
      throw APIError.notFound("File not found");
    }

    const { url } = await fileBucket.signedDownloadUrl(file.url, { ttl: 3600 });
    return { url };
  }
);

export const deleteFile = api(
  { auth: true, expose: true, method: "DELETE", path: "/files/:fileId" },
  async (req: { fileId: string }): Promise<{ success: boolean }> => {
    const auth = getAuthData<AuthData>()!;

    const file = await db.queryRow<{ url: string; org_id: string }>`
      SELECT url, org_id
      FROM files
      WHERE id = ${req.fileId}
    `;

    if (!file || file.org_id !== auth.orgId) {
      throw APIError.notFound("File not found");
    }

    await fileBucket.remove(file.url);

    await db.exec`
      DELETE FROM files
      WHERE id = ${req.fileId}
    `;

    return { success: true };
  }
);

export const setPrimaryFile = api(
  { auth: true, expose: true, method: "POST", path: "/files/:fileId/primary" },
  async (req: { fileId: string }): Promise<{ success: boolean }> => {
    const auth = getAuthData<AuthData>()!;

    const file = await db.queryRow<{
      owner_type: string;
      owner_id: string;
      org_id: string;
    }>`
      SELECT owner_type, owner_id, org_id
      FROM files
      WHERE id = ${req.fileId}
    `;

    if (!file || file.org_id !== auth.orgId) {
      throw APIError.notFound("File not found");
    }

    await db.exec`
      UPDATE files
      SET is_primary = false
      WHERE org_id = ${auth.orgId}
        AND owner_type = ${file.owner_type}
        AND owner_id = ${file.owner_id}
    `;

    await db.exec`
      UPDATE files
      SET is_primary = true
      WHERE id = ${req.fileId}
    `;

    return { success: true };
  }
);
