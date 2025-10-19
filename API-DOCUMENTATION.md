# Maritime Yacht Charter CRM API Documentation

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <user-id>
```

The system validates that the user is Active and has the appropriate role for admin-only operations.

## Core Endpoints

### User Management

#### GET /me
Returns current user information.
- **Auth**: Required
- **Response**: `{ id, email, role, orgId }`

### Ships Management

#### GET /ships
List all ships for the organization.
- **Auth**: Required
- **Response**: `{ ships: Ship[] }`

#### POST /ships
Create a new ship (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ name, description?, hourlyRate, capacity }`
- **Response**: `Ship`

#### PUT /ships/:id
Update ship details (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ name?, description?, hourlyRate?, capacity?, images?, published? }`
- **Response**: `Ship`

#### POST /ships/:id/status
Update ship status and schedule maintenance windows (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ status, statusReason?, statusStart?, statusEnd? }`
- **Response**: `Ship`
- **Status values**: `available | booked | maintenance | offline | reserved`

### Services Management

#### GET /services
List all services for the organization.
- **Auth**: Required
- **Response**: `{ services: YachtService[] }`

#### POST /services
Create a new service (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ name, description?, unitPrice, unitType, defaultQuantity? }`
- **Response**: `YachtService`
- **Unit types**: `per_hour | per_person | flat`

#### PUT /services/:id
Update service details (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ name?, description?, unitPrice?, unitType?, defaultQuantity?, published? }`
- **Response**: `YachtService`

### Pricing Rules

#### GET /pricing-rules
List all pricing rules for the organization.
- **Auth**: Required
- **Response**: `{ rules: PricingRule[] }`

#### POST /pricing-rules
Create a new pricing rule (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ name, condition, action, priority? }`
- **Response**: `PricingRule`

### Quote Calculator

#### POST /quotes/calc
Calculate a quote with live breakdown and applied rules.
- **Auth**: Required
- **Request**:
```json
{
  "shipId": "ship_...",
  "hours": 4.0,
  "people": 8,
  "services": [
    { "serviceId": "service_...", "quantity": 2 }
  ]
}
```
- **Response**:
```json
{
  "breakdown": [
    { "type": "ship", "name": "Yacht Alpha", "quantity": 4, "unitPrice": 500, "total": 2000 },
    { "type": "service", "name": "Catering", "quantity": 8, "unitPrice": 50, "total": 400 }
  ],
  "appliedRules": [
    { "ruleId": "rule_...", "ruleName": "Weekend Surcharge", "adjustment": 200 }
  ],
  "subtotal": 2600,
  "tax": 0,
  "total": 2600
}
```
- **Errors**:
  - `404`: Ship or service not found
  - `400`: Cannot quote unpublished ship or service

### Quotes

#### GET /quotes
List all quotes for the organization.
- **Auth**: Required
- **Response**: `{ quotes: Quote[] }`

#### POST /quotes
Save a quote with immutable snapshot.
- **Auth**: Required
- **Request**:
```json
{
  "prospectId?": 123,
  "shipId": "ship_...",
  "hours": 4.0,
  "people": 8,
  "services": [...],
  "breakdown": [...],
  "appliedRules": [...],
  "subtotal": 2600,
  "tax": 0,
  "total": 2600
}
```
- **Response**: `Quote` (with immutableSnapshot containing ship/service snapshots)

### Bookings

#### GET /bookings
List all active bookings for the organization.
- **Auth**: Required
- **Response**: `{ bookings: Booking[] }`

#### POST /bookings/quick
Create a booking with availability checks.
- **Auth**: Required
- **Request**:
```json
{
  "shipId": "ship_...",
  "prospectId?": 123,
  "quoteId?": "quote_...",
  "startTime": "2025-10-20T10:00:00Z",
  "endTime": "2025-10-20T14:00:00Z"
}
```
- **Response**: `Booking`
- **Errors**:
  - `409`: Ship unavailable (maintenance/offline) or time conflict
  - Conflict response includes `alternatives: [{ shipId, shipName, available }]`

### Conversations

#### GET /conversations
List all conversation threads.
- **Auth**: Required
- **Response**: `{ threads: Thread[] }`

#### GET /conversations/:threadId/messages
Get all messages for a thread.
- **Auth**: Required
- **Response**: `{ messages: ThreadMessage[] }`

#### POST /conversations/send
Send a message in a thread.
- **Auth**: Required
- **Request**: `{ threadId, message }`
- **Response**: `ThreadMessage`

#### POST /conversations/webhook
Inbound webhook for external messages (no auth).
- **Request**: `{ platform, chatId, message, senderId? }`
- **Response**: `{ success: true }`

### File Management

#### POST /files/upload-url
Get a signed upload URL for a file.
- **Auth**: Required
- **Request**: `{ ownerType, ownerId, filename, contentType, sizeBytes }`
- **Response**: `{ fileId, uploadUrl }`
- **Allowed types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`
- **Size limit**: 10MB

#### GET /files?ownerType=&ownerId=
List files for an entity.
- **Auth**: Required
- **Response**: `{ files: FileMetadata[] }`

#### GET /files/:fileId/url
Get a signed download URL.
- **Auth**: Required
- **Response**: `{ url }`
- **TTL**: 1 hour

#### DELETE /files/:fileId
Delete a file.
- **Auth**: Required
- **Response**: `{ success: true }`

#### POST /files/:fileId/primary
Set a file as primary image.
- **Auth**: Required
- **Response**: `{ success: true }`

### Settings

#### GET /settings
Get organization settings.
- **Auth**: Required
- **Response**: `OrgSettings`

#### PATCH /settings
Update organization settings (Admin only).
- **Auth**: Required (Admin)
- **Request**: `{ toggles?, activeAiProviderKeyName? }`
- **Response**: `OrgSettings`

### AI Assistant

#### POST /ai/query
Query the AI assistant.
- **Auth**: Required
- **Request**: `{ contextType?, contextId?, prompt }`
- **Response**: `{ answer, sources, confidence }`
- **Errors**:
  - `412`: AI Assistant disabled for organization
  - `429`: Monthly query limit exceeded

#### GET /ai/usage
Get AI usage statistics.
- **Auth**: Required
- **Response**: `{ queriesThisMonth, queriesLimit, queriesRemaining }`

## Error Codes

- **400**: Invalid request parameters
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Resource not found
- **409**: Conflict (booking overlap, ship unavailable)
- **412**: Precondition failed (feature disabled)
- **429**: Rate limit exceeded
- **500**: Internal server error

## Rate Limits

- AI queries: 100 per user per month
- File uploads: 10MB per file
- No other rate limits currently enforced

## Data Models

### Ship Status Badges
- **available**: Green
- **booked**: Red
- **maintenance**: Orange
- **offline**: Gray
- **reserved**: Blue

### Pricing Rule Conditions
```typescript
{
  field: "hours" | "people" | "subtotal",
  operator: "gt" | "gte" | "lt" | "lte" | "eq",
  value: number
}
```

### Pricing Rule Actions
```typescript
{
  type: "discount_percent" | "discount_fixed" | "surcharge_percent" | "surcharge_fixed",
  value: number
}
```
