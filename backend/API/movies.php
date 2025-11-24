<?php
require_once __DIR__ . '/../Database.php';
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$db = Database::connect();

$stmt = $db->query("
    SELECT m.*, GROUP_CONCAT(p.name) as platforms
    FROM movies m
    LEFT JOIN movie_platform mp ON m.id = mp.movie_id
    LEFT JOIN platforms p ON mp.platform_id = p.id
    GROUP BY m.id
");
$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($movies);