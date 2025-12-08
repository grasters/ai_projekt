<?php
require_once __DIR__ . '/ORM/Movie.php';

$csv = fopen(__DIR__ . '/CSV/movies.csv', 'r');

Movie::truncate();

$header = fgetcsv($csv);

while ($row = fgetcsv($csv)) {
    Movie::create([
        'title'    => $row[0],
        'year'     => $row[1],
        'platform' => $row[2],
        'duration' => $row[3],
        'info3'    => $row[4]
    ]);
}

fclose($csv);

echo "Movies imported";
