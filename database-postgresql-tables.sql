CREATE TABLE application_users (
	id BIGSERIAL PRIMARY KEY,
	username TEXT UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	first_name TEXT,
	last_name TEXT,
	role TEXT NOT NULL DEFAULT 'USER_ROLE'
);