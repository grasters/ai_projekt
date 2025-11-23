<?php
require_once __DIR__ . '/../Database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$db = Database::connect();

$stmt = $db->query("SELECT * FROM movies");

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
