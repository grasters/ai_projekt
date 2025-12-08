<?php
require_once __DIR__ . '/ORM/Serial.php';

$csv = fopen(__DIR__ . '/CSV/serials.csv', 'r');

Serial::truncate();

$header = fgetcsv($csv);

while ($row = fgetcsv($csv)) {
    Serial::create([
        'title'    => $row[0],
        'year'     => (int)$row[1],
        'platform' => $row[2],
        'episodes' => (int)$row[3],
        'avgTime'  => (int)$row[4],
        'info3'    => $row[5],
    ]);
}

fclose($csv);

echo "Serials imported";
