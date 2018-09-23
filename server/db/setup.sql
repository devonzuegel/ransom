CREATE TABLE
IF NOT EXISTS users
(
    -- TODO: Validate this more strictly
    address VARCHAR NOT NULL PRIMARY KEY,
    data jsonb
);

CREATE TABLE
IF NOT EXISTS notes
(
    -- TODO: Validate this more strictly
    "userAddress" VARCHAR NOT NULL references users(address),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,
    "content" text NOT NULL
);

CREATE TABLE
IF NOT EXISTS challenges
(
    -- TODO: Validate this more strictly
    "userAddress" VARCHAR NOT NULL references users(address),
    "createdAt" timestamptz DEFAULT now() NOT NULL,
    "updatedAt" timestamptz DEFAULT now() NOT NULL,
    "dueAt" timestamptz DEFAULT now() NOT NULL,
    "numNotes" integer DEFAULT 2 NOT NULL,
    "numWords" integer DEFAULT 500 NOT NULL,
    "centsPerMissedNote" integer DEFAULT 500 NOT NULL
);
