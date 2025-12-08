<?php
require_once 'Database.php';

echo "DB FILE: " . __DIR__ . "/database.sqlite<br>";


$db = Database::connect();

/* FILMY */
$db->exec("
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    year INTEGER,
    platform TEXT,
    duration INTEGER,
    info3 TEXT
)");

/* SERIALE */
$db->exec("
CREATE TABLE IF NOT EXISTS serials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    year INTEGER,
    platform TEXT,
    episodes INTEGER,
    avgTime INTEGER,
    info3 TEXT
)");

echo "Baza gotowa";

