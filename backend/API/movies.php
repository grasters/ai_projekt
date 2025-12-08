<?php
require_once __DIR__ . '/../ORM/Movie.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode(Movie::all());
