CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Staff')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Revoked')),
  org_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ships (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hourly_rate DOUBLE PRECISION NOT NULL,
  capacity INTEGER NOT NULL,
  images JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance', 'offline', 'reserved')),
  status_reason TEXT,
  status_start TIMESTAMP,
  status_end TIMESTAMP,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit_price DOUBLE PRECISION NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('per_hour', 'per_person', 'flat')),
  default_quantity INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pricing_rules (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  prospect_id BIGINT REFERENCES leads(id),
  ship_id TEXT REFERENCES ships(id),
  hours DOUBLE PRECISION NOT NULL,
  people INTEGER NOT NULL,
  services JSONB DEFAULT '[]',
  subtotal DOUBLE PRECISION NOT NULL,
  tax DOUBLE PRECISION DEFAULT 0,
  total DOUBLE PRECISION NOT NULL,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  published_config_version INTEGER,
  immutable_snapshot JSONB NOT NULL
);

CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  quote_id TEXT REFERENCES quotes(id),
  ship_id TEXT NOT NULL REFERENCES ships(id),
  prospect_id BIGINT REFERENCES leads(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_by TEXT REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE threads (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  prospect_id BIGINT REFERENCES leads(id),
  source_platform TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, source_platform, chat_id)
);

CREATE TABLE thread_messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('prospect', 'agent', 'ai')),
  sender_id TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE settings (
  org_id TEXT PRIMARY KEY,
  toggles JSONB DEFAULT '{}',
  active_ai_provider_key_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE files (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('ship', 'prospect')),
  owner_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by TEXT REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes JSONB,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_providers (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  key_name TEXT NOT NULL,
  provider_type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, key_name)
);

CREATE TABLE ai_usage (
  id BIGSERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id),
  provider_key_name TEXT NOT NULL,
  context_type TEXT,
  context_id TEXT,
  prompt TEXT,
  response TEXT,
  confidence DOUBLE PRECISION,
  sources JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ships_org_id ON ships(org_id);
CREATE INDEX idx_ships_status ON ships(status);
CREATE INDEX idx_services_org_id ON services(org_id);
CREATE INDEX idx_pricing_rules_org_id ON pricing_rules(org_id);
CREATE INDEX idx_quotes_org_id ON quotes(org_id);
CREATE INDEX idx_quotes_prospect_id ON quotes(prospect_id);
CREATE INDEX idx_bookings_org_id ON bookings(org_id);
CREATE INDEX idx_bookings_ship_id ON bookings(ship_id);
CREATE INDEX idx_bookings_time_range ON bookings(start_time, end_time);
CREATE INDEX idx_threads_org_id ON threads(org_id);
CREATE INDEX idx_threads_chat_id ON threads(org_id, source_platform, chat_id);
CREATE INDEX idx_thread_messages_thread_id ON thread_messages(thread_id);
CREATE INDEX idx_files_owner ON files(owner_type, owner_id);
CREATE INDEX idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_ai_usage_org_id ON ai_usage(org_id);
CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
