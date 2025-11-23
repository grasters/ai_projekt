<?php
require_once "Database.php";

$db = Database::connect();

$db->exec("
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    year INTEGER,
    platform TEXT
)
");

echo "Baza gotowa!";
