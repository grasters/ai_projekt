<?php
require_once __DIR__ . '/../Database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$db = Database::connect();

$stmt = $db->query("
    SELECT s.*, GROUP_CONCAT(p.name) as platforms
    FROM series s
    LEFT JOIN series_platform sp ON s.id = sp.series_id
    LEFT JOIN platforms p ON sp.platform_id = p.id
    GROUP BY s.id
");

$series = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($series);