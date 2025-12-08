<?php
require_once __DIR__ . '/../ORM/Serial.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode(Serial::all());
