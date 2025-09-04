CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('facebook', 'instagram', 'whatsapp', 'website', 'referral')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'booked', 'lost')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  vessel_type TEXT NOT NULL,
  booking_date DATE,
  party_size INTEGER NOT NULL,
  budget DOUBLE PRECISION NOT NULL,
  notes TEXT DEFAULT '',
  response_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('facebook', 'instagram', 'whatsapp', 'email', 'phone')),
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('lead', 'agent', 'ai')),
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_messages_lead_id ON messages(lead_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
