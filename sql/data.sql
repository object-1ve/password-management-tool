CREATE TABLE IF NOT EXISTS shortcuts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keys TEXT NOT NULL,
    functions TEXT NOT NULL,
    last_used_time  INTEGER NOT NULL,
);