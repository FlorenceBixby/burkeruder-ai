-- Ballots name everyone coming instead of counting them.
-- Existing rows keep their party_size; the API falls back to the filer's name for them.
-- Run once against the live database:
--   npx wrangler d1 execute burkeruder-crew --remote --file=reunion-site/migration-001-attendees.sql
ALTER TABLE reunion_rsvps ADD COLUMN attendees TEXT;
