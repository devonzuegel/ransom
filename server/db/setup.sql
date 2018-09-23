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
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "content" text NOT NULL
);
