CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DOMAIN email_address AS citext
CONSTRAINT email_address_check CHECK ((VALUE ~ '\A[^@\s;,]+@[^@\s;,]+\.[^@\s;,]+\Z'::citext));

CREATE TABLE
IF NOT EXISTS users
(
    -- TODO: Validate this more strictly
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,

    "email" email_address NOT NULL UNIQUE,
    "address" VARCHAR NOT NULL UNIQUE,
    "data" jsonb
);

CREATE TABLE
IF NOT EXISTS notes
(
    -- TODO: Validate this more strictly
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,

    "userAddress" VARCHAR NOT NULL references users(address),
    "content" text NOT NULL
);

CREATE TABLE
IF NOT EXISTS challenges
(
    -- TODO: Validate this more strictly
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,

    "userAddress" VARCHAR NOT NULL references users(address),
    "dueAt" timestamptz NOT NULL,
    "numNotes" integer DEFAULT 2 NOT NULL,
    "numWords" integer DEFAULT 500 NOT NULL,
    "centsPerMissedNote" integer DEFAULT 500 NOT NULL
);

CREATE TABLE
IF NOT EXISTS transactions
(
    -- TODO: Validate this more strictly
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,

    "userAddress" VARCHAR NOT NULL references users(address),
    "numNotes" integer DEFAULT 2 NOT NULL,
    "centsOwed" integer NOT NULL,
    "description" text NOT NULL
);
