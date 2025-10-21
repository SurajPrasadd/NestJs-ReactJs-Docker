-- optional: simple init script
CREATE TABLE IF NOT EXISTS init_check(id serial primary key, message text);
INSERT INTO init_check(message) VALUES ('Database initialized') ON CONFLICT DO NOTHING;
