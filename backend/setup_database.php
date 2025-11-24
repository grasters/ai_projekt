<?php

$fileDb = __DIR__ . '/database.sqlite';

if (file_exists($fileDb)) {
    unlink($fileDb);
}

try {
    $pdo = new PDO('sqlite:' . $fileDb);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Tworzenie bazy danych PlusFLIX...<br>";

    // 1. Platforms
    $pdo->exec("
        CREATE TABLE platforms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            logo_url TEXT,
            website_url TEXT
        );
    ");

    $platforms = [
        ['Netflix', 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', 'https://netflix.com'],
        ['HBO Max', 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg', 'https://hbomax.com'],
        ['Disney+', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', 'https://disneyplus.com'],
        ['Prime Video', 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png', 'https://primevideo.com'],
        ['Apple TV+', 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg', 'https://tv.apple.com'],
        ['Player.pl', null, 'https://player.pl'],
        ['Canal+ Online', null, 'https://pl.canalplus.com']
    ];

    $stmtPlat = $pdo->prepare("INSERT INTO platforms (name, logo_url, website_url) VALUES (?, ?, ?)");
    foreach ($platforms as $p) {
        $stmtPlat->execute($p);
    }

    // 2. Categories
    $pdo->exec("
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    ");

    $categories = ['Akcja', 'Komedia', 'Dramat', 'Horror', 'Sci-Fi', 'Fantasy', 'Romans', 'Thriller', 'Animacja', 'Przygodowy', 'Kryminał'];
    $stmtCat = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    foreach ($categories as $c) {
        $stmtCat->execute([$c]);
    }

    // 3. Tags
    $pdo->exec("
        CREATE TABLE tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
    ");

    $tags = ['Oscary', 'Kultowy', 'Na wieczór', 'Dla dzieci', 'Superbohaterowie', 'Postapo', 'Psychologiczny', 'Zaskakujące zakończenie'];
    $stmtTag = $pdo->prepare("INSERT INTO tags (name) VALUES (?)");
    foreach ($tags as $t) {
        $stmtTag->execute([$t]);
    }

    // 4. Movies
    $pdo->exec("
        CREATE TABLE movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            original_title TEXT,
            year INTEGER NOT NULL,
            duration INTEGER, -- w minutach
            description TEXT,
            poster_url TEXT,
            trailer_url TEXT,
            imdb_rating REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 5. Series
    $pdo->exec("
        CREATE TABLE series (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            original_title TEXT,
            year_start INTEGER NOT NULL,
            year_end INTEGER, -- NULL jeśli trwa
            seasons INTEGER,
            episodes_total INTEGER,
            avg_episode_length INTEGER,
            description TEXT,
            poster_url TEXT,
            trailer_url TEXT,
            imdb_rating REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Tabele łączące wiele-do-wiele
    $pdo->exec("
        CREATE TABLE movie_platform (
            movie_id INTEGER,
            platform_id INTEGER,
            available_until DATE NULL, -- kiedy znika z platformy
            PRIMARY KEY (movie_id, platform_id),
            FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
            FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
        );
    ");

    $pdo->exec("
        CREATE TABLE series_platform (
            series_id INTEGER,
            platform_id INTEGER,
            available_until DATE NULL,
            PRIMARY KEY (series_id, platform_id),
            FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
            FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
        );
    ");

    $pdo->exec("
        CREATE TABLE movie_category (movie_id INTEGER, category_id INTEGER, PRIMARY KEY (movie_id, category_id));
        CREATE TABLE series_category (series_id INTEGER, category_id INTEGER, PRIMARY KEY (series_id, category_id));
        CREATE TABLE movie_tag (movie_id INTEGER, tag_id INTEGER, PRIMARY KEY (movie_id, tag_id));
        CREATE TABLE series_tag (series_id INTEGER, tag_id INTEGER, PRIMARY KEY (series_id, tag_id));
    ");

    echo "Struktura tabel utworzona!<br>";

    // Wstawianie przykładowych filmów
    $movies = [
        ['Incepcja', 'Inception', 2010, 148, 'Łotrzyk wkrada się do snów...', 'https://image.tmdb.org/t/p/w342/s2OBnwT9eOo6oW0GfC8tDoG0BPk.jpg'],
        ['Matrix', 'The Matrix', 1999, 136, 'Haker odkrywa prawdę o rzeczywistości...', 'https://image.tmdb.org/t/p/w342/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'],
        ['Titanic', 'Titanic', 1997, 195, 'Miłość na tonącym statku...', 'https://image.tmdb.org/t/p/w342/9xjZS2rlVxm8SFx8kPC3aPmLB2.jpg'],
        ['Avengers: Endgame', 'Avengers: Endgame', 2019, 181, 'Ostatnia bitwa z Thanosem...', 'https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg'],
        ['Interstellar', 'Interstellar', 2014, 169, 'Podróż przez czarne dziury...', 'https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'],
    ];

    $stmtMovie = $pdo->prepare("INSERT INTO movies (title, original_title, year, duration, description, poster_url) VALUES (?, ?, ?, ?, ?, ?)");
    $movieIds = [];
    foreach ($movies as $m) {
        $stmtMovie->execute($m);
        $movieIds[] = $pdo->lastInsertId();
    }

    // Przykładowe przypisanie platform do filmów
    $moviePlatforms = [
        [$movieIds[0], 1], // Incepcja → Netflix
        [$movieIds[0], 4], // Incepcja → Prime Video
        [$movieIds[1], 2], // Matrix → HBO Max
        [$movieIds[2], 4], // Titanic → Prime Video
        [$movieIds[3], 3], // Endgame → Disney+
        [$movieIds[4], 1], // Interstellar → Netflix
    ];
    $stmtMP = $pdo->prepare("INSERT OR IGNORE INTO movie_platform (movie_id, platform_id) VALUES (?, ?)");
    foreach ($moviePlatforms as $mp) $stmtMP->execute($mp);

    // Seriale
    $series = [
        ['Stranger Things', null, 2016, null, 4, 42, 50, 'Dzieci kontra Demogorgon...', 'https://image.tmdb.org/t/p/w342/x2LSRK2CvWXv9TtGvw9Wr6lXgiy.jpg'],
        ['Gra o Tron', 'Game of Thrones', 2011, 2019, 8, 73, 57, 'Walka o Żelazny Tron...', 'https://image.tmdb.org/t/p/w342/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'],
        ['The Mandalorian', null, 2019, null, 3, 24, 40, 'Baby Yoda i łowca nagród...', 'https://image.tmdb.org/t/p/w342/sWgBv7LV2iTvio0rNHM3x9d7b7wG.jpg'],
        ['Breaking Bad', null, 2008, 2013, 5, 62, 47, 'Nauczyciel chemii zostaje królem metamfetaminy...', 'https://image.tmdb.org/t/p/w342/ggFHVNu6YYI5L9pCfOacjizRGt.jpg'],
        ['Wednesday', null, 2022, null, 1, 8, 50, 'Wednesday Addams w Akademii Nevermore...', 'https://image.tmdb.org/t/p/w342/9PFonBhy4cQy7Jz20NpMygczOkv.jpg'],
    ];

    $stmtSeries = $pdo->prepare("INSERT INTO series (title, original_title, year_start, year_end, seasons, episodes_total, avg_episode_length, description, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $seriesIds = [];
    foreach ($series as $s) {
        $stmtSeries->execute($s);
        $seriesIds[] = $pdo->lastInsertId();
    }

    // Seriale → platformy
    $seriesPlatforms = [
        [$seriesIds[0], 1], // Stranger Things → Netflix
        [$seriesIds[1], 2], // GoT → HBO Max
        [$seriesIds[2], 3], // Mandalorian → Disney+
        [$seriesIds[3], 1], // Breaking Bad → Netflix
        [$seriesIds[4], 1], // Wednesday → Netflix
    ];
    $stmtSP = $pdo->prepare("INSERT OR IGNORE INTO series_platform (series_id, platform_id) VALUES (?, ?)");
    foreach ($seriesPlatforms as $sp) $stmtSP->execute($sp);

    echo "Baza PlusFLIX gotowa! Wypełniono danymi startowymi.<br>";
    echo "Plik: " . realpath($fileDb);

} catch (Exception $e) {
    die("Błąd: " . $e->getMessage());
}

echo "Baza gotowa!";
