CREATE TABLE IF NOT EXISTS crew (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  site_url TEXT,
  photo_key TEXT,
  bio TEXT,
  approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
