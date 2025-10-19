# Maritime Yacht Charter CRM - Changelog

## Version 2.0.0 - October 2025

### Major Features Added

#### 🚢 Fleet Management System
- Complete CRUD interface for ships with status management
- Ship status tracking: available, booked, maintenance, offline, reserved
- Scheduled maintenance windows with conflict prevention
- Hourly rate and capacity configuration
- Image gallery support for ship profiles
- Draft/Published workflow for ships

#### 💰 Configurable Quote Generator
- Admin-defined ships and services catalog
- Live quote calculation with itemized breakdown
- Pricing rules engine with priority-based application
- Service types: per_hour, per_person, flat
- Immutable quote snapshots preserving config version
- Convert quote to booking workflow

#### 📅 Bookings & Calendar
- Quick-book flow with real-time availability checks
- Per-ship calendar visualization with status bars
- Conflict detection with 409 responses
- Alternative ship suggestions on conflicts
- Maintenance window enforcement
- Status-based color coding (green, red, orange, gray, blue)

#### 💬 Unified Conversations Inbox
- Thread-based messaging mapped to prospects
- Multi-platform support (WhatsApp, Facebook, Instagram, etc.)
- Inbound webhook integration for external messages
- Send/receive message flows
- Quick-book prefill from conversation threads
- Real-time message sync

#### 📁 File Management System
- Per-entity file uploads (ships, prospects)
- Signed URL generation with 1-hour TTL
- File type whitelist: JPEG, PNG, GIF, WebP, PDF
- 10MB size limit per file
- Primary image designation
- Thumbnail support (placeholder for future)
- Object storage bucket integration

#### ⚙️ Organization Settings & Roles
- Admin and Staff role enforcement
- Org-scoped feature toggles:
  - Messaging
  - Audit logging
  - Data exports
  - User invites
  - AI Assistant
- Real-time toggle updates
- Admin-only settings management

#### 🤖 AI Assistant Widget
- Bottom-right floating bubble interface
- Admin enable/disable toggle
- Single-context query support
- Confidence scoring and data source attribution
- Usage tracking with 100 queries/user/month limit
- Rate limiting and monthly caps
- Simulated responses (production ready for OpenAI integration)

### Backend API Endpoints

#### New Services
- **auth**: User authentication and authorization
  - `GET /me` - Get current user info
  
- **fleet**: Ships and services management
  - `GET /ships`, `POST /ships`, `PUT /ships/:id`
  - `POST /ships/:id/status` - Update ship status
  - `GET /services`, `POST /services`, `PUT /services/:id`
  
- **quotes**: Quote calculation and persistence
  - `POST /quotes/calc` - Live quote calculation
  - `GET /quotes`, `POST /quotes` - Quote management
  - `GET /pricing-rules`, `POST /pricing-rules`, `PUT /pricing-rules/:id`
  
- **bookings**: Booking management with conflicts
  - `GET /bookings`
  - `POST /bookings/quick` - Quick-book with availability checks
  
- **conversations**: Unified inbox
  - `GET /conversations` - List threads
  - `GET /conversations/:threadId/messages` - Thread messages
  - `POST /conversations/send` - Send message
  - `POST /conversations/webhook` - Inbound webhook
  
- **files**: File upload and management
  - `POST /files/upload-url` - Get signed upload URL
  - `GET /files` - List files by owner
  - `GET /files/:fileId/url` - Get signed download URL
  - `DELETE /files/:fileId`
  - `POST /files/:fileId/primary` - Set primary image
  
- **settings**: Organization configuration
  - `GET /settings`, `PATCH /settings`
  
- **ai**: AI assistant
  - `POST /ai/query` - Query assistant
  - `GET /ai/usage` - Usage statistics

### Frontend Components

#### New Views
- **QuotesView**: Quote generation with live calculator
- **ConversationsView**: Unified inbox with thread list and messaging
- **BookingsView**: Calendar view with per-ship bars and quick-book modal
- **FleetView**: Ship management with status editor
- **SettingsAdminView**: Organization settings and toggles
- **AIAssistantWidget**: Floating assistant bubble

#### Navigation Updates
- Expanded sidebar with new menu items:
  - Conversations
  - Quotes
  - Bookings
  - Fleet
  - (Existing: Dashboard, Leads, Communications, Analytics, Calendar, Settings)
- Removed top-left icon as requested
- Responsive design maintained at 375px and 768px breakpoints

### Database Schema

#### New Tables
- **users**: User accounts with roles and org assignment
- **ships**: Fleet inventory with status and schedules
- **services**: Service catalog with pricing
- **pricing_rules**: Configurable pricing logic
- **quotes**: Quote snapshots with immutable config
- **bookings**: Reservations with conflict tracking
- **threads**: Conversation threads by platform
- **thread_messages**: Individual messages
- **settings**: Org-scoped configuration
- **files**: File metadata and storage references
- **audit_logs**: Action tracking
- **ai_providers**: AI provider configs
- **ai_usage**: Query tracking and limits

### Security & Secrets

#### Secrets Management
- `UNIPILE_TOKEN`: External messaging integration
- `OpenAIToken`: AI assistant provider key
- Secrets configured in Leap Infrastructure settings
- No raw secrets in codebase (placeholders only)
- Runtime injection via secret manager

#### Authentication
- Bearer token auth on all protected endpoints
- Org-scoped data access enforcement
- Admin/Staff role checks on sensitive operations
- Active status validation

### Testing & Quality

#### Tests Added
- **backend/quotes/calculator.test.ts**:
  - Unit tests for condition evaluation
  - Unit tests for pricing rule actions
  - Quote calculation logic tests

### Documentation

- **API-DOCUMENTATION.md**: Complete endpoint reference
- **RUNBOOK.md**: Operations guide with:
  - Secret management procedures
  - Emergency AI kill-switch
  - Database operations
  - Troubleshooting guide
  - Performance monitoring
  - Backup and recovery
  - Security best practices

### Breaking Changes

None - This is a new feature release building on top of the existing CRM.

### Known Limitations

1. **Thumbnail generation**: Placeholder in file API (not implemented)
2. **Multi-document AI synthesis**: Not implemented (single-context only)
3. **Provider orchestration**: Simulated OpenAI responses (integration ready)
4. **Advanced AI features**: Background jobs, scheduled analysis not included

### Migration Notes

- Database migrations run automatically via Encore.ts
- Existing `leads` and `messages` tables preserved
- New tables created with proper indexes
- No downtime during deployment

### Performance

- All list endpoints paginated/limited
- Indexes on critical query paths (org_id, time ranges, status)
- Signed URLs cached for 1 hour
- File size limit enforced at 10MB

### Visual Design

- Status badge color scheme implemented:
  - Available: Green (#10b981)
  - Booked: Red (#ef4444)
  - Maintenance: Orange (#f97316)
  - Offline: Gray (#6b7280)
  - Reserved: Blue (#3b82f6)
- Responsive at mobile (375px) and tablet (768px)
- Minimal loader and reduced animations
- Dark theme with slate/black gradient background

### Next Steps

For production readiness:
1. Implement actual OpenAI API calls in ai/assistant.ts
2. Add thumbnail generation for images
3. Implement audit log UI
4. Add user management UI (invite/revoke)
5. Build export functionality
6. Add comprehensive error logging
7. Implement advanced AI features if needed
8. Add E2E tests for critical flows
