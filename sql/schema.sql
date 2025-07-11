CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );

CREATE TABLE  IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        url TEXT,
        remark TEXT,
        updateTime TEXT NOT NULL,
        createTime TEXT NOT NULL
      );


CREATE TABLE IF NOT EXISTS shortcuts (
  id INTEGER NOT NULL DEFAULT NULL COLLATE RTRIM PRIMARY KEY AUTOINCREMENT,
  keys TEXT NOT NULL,
  functions TEXT NOT NULL,
  last_used_time integer
);

ALTER TABLE password ADD COLUMN numberOfUses INTEGER DEFAULT '0';
