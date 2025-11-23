<?php
require_once "Database.php";

$db = Database::connect();

$db->exec("DELETE FROM movies");

$db->exec("
INSERT INTO movies (title, year, platform, duration, info3) VALUES
('Incepcja', 2010, 'Netflix', 148, 'Info'),
('Matrix', 1999, 'HBO Max', 136, 'Info'),
('Titanic', 1997, 'Prime Video', 195, 'Info')
");

echo "Dodano 3 filmy!";

require_once "../Database.php";

header("Content-Type: application/json");

$db = Database::connect();
$stmt = $db->query("SELECT * FROM movies");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
