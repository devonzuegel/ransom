CREATE TABLE
IF NOT EXISTS users
(
    -- TODO: Validate this more strictly
    address VARCHAR NOT NULL PRIMARY KEY,
    data jsonb
);
