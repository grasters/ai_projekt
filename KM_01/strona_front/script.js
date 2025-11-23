/* ========================================
   DANE FILMÓW I SERIALI
   ======================================== */

/**
 * Tablica z danymi filmów
 * Każdy obiekt zawiera:
 * - id: unikalny identyfikator
 * - title: tytuł filmu
 * - year: rok produkcji
 * - type: typ ('movie' dla filmów)
 * - platform: platforma streamingowa
 * - duration: czas trwania w minutach
 * - info3: dodatkowa informacja (placeholder)
 *
 * W przyszłości te dane będą pobierane z bazy danych przez API
 */
let moviesData = [
    { id: 1, title: "Zielona Mila", year: 1999, type: "movie", platform: "Netflix", duration: 189, info3: "Info 3" },
    { id: 2, title: "Avengers: Koniec gry", year: 2019, type: "movie", platform: "Disney+", duration: 181, info3: "Info 3" },
    { id: 3, title: "Matrix", year: 1999, type: "movie", platform: "HBO Max", duration: 136, info3: "Info 3" },
    { id: 4, title: "Król Lew", year: 1994, type: "movie", platform: "Disney+", duration: 88, info3: "Info 3" },
    { id: 5, title: "Incepcja", year: 2010, type: "movie", platform: "Netflix", duration: 148, info3: "Info 3" },
    { id: 6, title: "Pulp Fiction", year: 1994, type: "movie", platform: "Prime Video", duration: 154, info3: "Info 3" },
    { id: 7, title: "Forrest Gump", year: 1994, type: "movie", platform: "Prime Video", duration: 142, info3: "Info 3" },
    { id: 8, title: "Batman: Mroczny Rycerz", year: 2008, type: "movie", platform: "HBO Max", duration: 152, info3: "Info 3" },
    { id: 9, title: "Titanic", year: 1997, type: "movie", platform: "Prime Video", duration: 195, info3: "Info 3" },
    { id: 10, title: "Jurassic Park", year: 1993, type: "movie", platform: "Netflix", duration: 127, info3: "Info 3" }
];

/**
 * Tablica z danymi seriali
 * Każdy obiekt zawiera:
 * - id: unikalny identyfikator
 * - title: tytuł serialu
 * - year: rok premiery
 * - type: typ ('series' dla seriali)
 * - platform: platforma streamingowa
 * - episodes: liczba odcinków
 * - avgTime: średni czas trwania odcinka w minutach
 * - info3: dodatkowa informacja (placeholder)
 */
let serialsData = [
    { id: 11, title: "Stranger Things", year: 2016, type: "series", platform: "Netflix", episodes: 42, avgTime: 50, info3: "Info 3" },
    { id: 12, title: "Gra o Tron", year: 2011, type: "series", platform: "HBO Max", episodes: 73, avgTime: 57, info3: "Info 3" },
    { id: 13, title: "The Mandalorian", year: 2019, type: "series", platform: "Disney+", episodes: 24, avgTime: 40, info3: "Info 3" },
    { id: 14, title: "Breaking Bad", year: 2008, type: "series", platform: "Netflix", episodes: 62, avgTime: 47, info3: "Info 3" },
    { id: 15, title: "The Boys", year: 2019, type: "series", platform: "Prime Video", episodes: 32, avgTime: 60, info3: "Info 3" },
    { id: 16, title: "Ted Lasso", year: 2020, type: "series", platform: "Apple TV+", episodes: 34, avgTime: 30, info3: "Info 3" },
    { id: 17, title: "Wiedźmin", year: 2019, type: "series", platform: "Netflix", episodes: 24, avgTime: 60, info3: "Info 3" },
    { id: 18, title: "Wednesday", year: 2022, type: "series", platform: "Netflix", episodes: 8, avgTime: 50, info3: "Info 3" },
    { id: 19, title: "House of the Dragon", year: 2022, type: "series", platform: "HBO Max", episodes: 10, avgTime: 65, info3: "Info 3" },
    { id: 20, title: "Loki", year: 2021, type: "series", platform: "Disney+", episodes: 12, avgTime: 50, info3: "Info 3" }
];

/* ========================================
   FUNKCJE POMOCNICZE
   ======================================== */

/**
 * Formatuje czas trwania do czytelnego formatu
 * @param {Object} item - Obiekt filmu lub serialu
 * @returns {string} - Sformatowany czas (np. "2h 45min" lub "42 odc. (~50min/odc.)")
 */
function formatDuration(item) {
    if (item.type === 'movie') {
        // Dla filmów: oblicz godziny i minuty z całkowitej liczby minut
        const hours = Math.floor(item.duration / 60);  // Math.floor zaokrągla w dół
        const minutes = item.duration % 60;  // % (modulo) zwraca resztę z dzielenia
        return `${hours}h ${minutes}min`;
    } else {
        // Dla seriali: pokaż liczbę odcinków i średni czas
        return `${item.episodes} odc. (~${item.avgTime}min/odc.)`;
    }
}

/**
 * Wyświetla filmy/seriale w kontenerze
 * @param {Array} items - Tablica filmów/seriali do wyświetlenia
 * @param {string} containerId - ID kontenera HTML gdzie mają być wyświetlone
 */
function displayItems(items, containerId) {
    // Pobierz element HTML po jego ID
    const container = document.getElementById(containerId);

    // Wyczyść zawartość kontenera (usuń poprzednie elementy)
    container.innerHTML = '';

    // Jeśli brak wyników, pokaż komunikat
    if (items.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Brak wyników</p>';
        return;
    }

    // Iteruj przez każdy element w tablicy
    items.forEach(item => {
        // Utwórz nowy element div dla karty
        const card = document.createElement('div');
        card.className = 'movie-card';  // Przypisz klasę CSS

        // Utwórz klasę CSS dla platformy (usuń spacje i znaki specjalne)
        const platformClass = 'platform-' + item.platform.toLowerCase().replace(/[^a-z]/g, '');

        // Wstaw HTML do karty (template string używa `backticks`)
        card.innerHTML = `
            <div class="movie-title">${item.title}</div>
            <div class="movie-year">${item.year}</div>
            <div class="movie-info">
                <span class="${platformClass} platform-badge">${item.platform}</span>
            </div>
            <div class="movie-info">${formatDuration(item)}</div>
            <div class="movie-info">${item.info3}</div>
        `;

        // Dodaj kartę do kontenera
        container.appendChild(card);
    });
}

/* ========================================
   FUNKCJE SORTOWANIA I FILTROWANIA
   ======================================== */

/**
 * Sortuje tablicę filmów/seriali według wybranego kryterium
 * @param {Array} items - Tablica do posortowania
 * @param {string} sortType - Typ sortowania ('az', 'za', 'year-asc', 'year-desc')
 * @returns {Array} - Posortowana tablica (nowa kopia, oryginał nie jest modyfikowany)
 */
function sortItems(items, sortType) {
    // Utwórz kopię tablicy używając spread operator (...)
    // To ważne, żeby nie modyfikować oryginalnej tablicy
    const sorted = [...items];

    if (sortType === 'az') {
        // Sortowanie alfabetyczne A-Z
        // localeCompare porównuje stringi z uwzględnieniem polskich znaków
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'pl'));
    } else if (sortType === 'za') {
        // Sortowanie alfabetyczne Z-A (odwrotnie)
        sorted.sort((a, b) => b.title.localeCompare(a.title, 'pl'));
    } else if (sortType === 'year-asc') {
        // Sortowanie po roku rosnąco (najstarsze -> najnowsze)
        sorted.sort((a, b) => a.year - b.year);
    } else if (sortType === 'year-desc') {
        // Sortowanie po roku malejąco (najnowsze -> najstarsze)
        sorted.sort((a, b) => b.year - a.year);
    }

    return sorted;
}

/**
 * Wyszukuje filmy/seriale po tytule
 * @param {Array} items - Tablica do przeszukania
 * @param {string} searchTerm - Szukana fraza
 * @returns {Array} - Przefiltrowana tablica
 */
function searchItems(items, searchTerm) {
    // Jeśli pole jest puste, zwróć wszystkie elementy
    if (!searchTerm) return items;

    // Zamień frazę na małe litery dla porównania case-insensitive
    const term = searchTerm.toLowerCase();

    // filter() tworzy nową tablicę z elementami spełniającymi warunek
    // includes() sprawdza czy string zawiera podany tekst
    return items.filter(item =>
        item.title.toLowerCase().includes(term)
    );
}

/**
 * Filtruje po platformie streamingowej
 * @param {Array} items - Tablica do filtrowania
 * @param {string} platform - Nazwa platformy
 * @returns {Array} - Przefiltrowana tablica
 */
function filterByPlatform(items, platform) {
    if (!platform) return items;  // Jeśli nie wybrano platformy, zwróć wszystko

    // Zwróć tylko elementy z wybranej platformy
    return items.filter(item => item.platform === platform);
}

/**
 * Filtruje po czasie trwania
 * @param {Array} items - Tablica do filtrowania
 * @param {string} durationType - Typ czasu ('short', 'medium', 'long')
 * @returns {Array} - Przefiltrowana tablica
 */
function filterByDuration(items, durationType) {
    if (!durationType) return items;

    return items.filter(item => {
        if (item.type === 'movie') {
            // Filtrowanie dla filmów (duration w minutach)
            if (durationType === 'short') return item.duration <= 120;  // do 2h
            if (durationType === 'medium') return item.duration > 120 && item.duration <= 180;  // 2-3h
            if (durationType === 'long') return item.duration > 180;  // ponad 3h
        } else {
            // Filtrowanie dla seriali (episodes = liczba odcinków)
            if (durationType === 'short') return item.episodes <= 10;
            if (durationType === 'medium') return item.episodes > 10 && item.episodes <= 20;
            if (durationType === 'long') return item.episodes > 20;
        }
        return true;
    });
}

/* ========================================
   GŁÓWNA FUNKCJA AKTUALIZACJI WYŚWIETLANIA
   ======================================== */

/**
 * Aktualizuje wyświetlanie filmów i seriali na podstawie wszystkich filtrów
 * Ta funkcja jest wywoływana za każdym razem gdy użytkownik:
 * - wpisuje coś w wyszukiwarkę
 * - zmienia sortowanie
 * - zmienia filtr platformy
 * - zmienia filtr czasu trwania
 */
function updateDisplay() {
    // Pobierz wartości z wszystkich pól formularza
    const searchTerm = document.getElementById('searchInput').value;
    const sortType = document.getElementById('sortSelect').value;
    const platform = document.getElementById('platformFilter').value;
    const duration = document.getElementById('durationFilter').value;

    /* --- PRZETWARZANIE FILMÓW --- */
    // Krok 1: Wyszukaj filmy pasujące do frazy
    let filteredMovies = searchItems(moviesData, searchTerm);
    // Krok 2: Przefiltruj po platformie
    filteredMovies = filterByPlatform(filteredMovies, platform);
    // Krok 3: Przefiltruj po czasie trwania
    filteredMovies = filterByDuration(filteredMovies, duration);
    // Krok 4: Posortuj wyniki
    filteredMovies = sortItems(filteredMovies, sortType);

    /* --- PRZETWARZANIE SERIALI --- */
    // To samo dla seriali
    let filteredSerials = searchItems(serialsData, searchTerm);
    filteredSerials = filterByPlatform(filteredSerials, platform);
    filteredSerials = filterByDuration(filteredSerials, duration);
    filteredSerials = sortItems(filteredSerials, sortType);

    // Wyświetl przetworzone dane
    displayItems(filteredMovies, 'moviesContainer');
    displayItems(filteredSerials, 'serialsContainer');
}

/* ========================================
   NASŁUCHIWANIE ZDARZEŃ (EVENT LISTENERS)
   ======================================== */

/**
 * addEventListener() rejestruje funkcję która ma być wywołana gdy zajdzie zdarzenie
 * 'change' - zdarzenie gdy zmieni się wartość w <select>
 * 'input' - zdarzenie gdy użytkownik wpisuje tekst (działa w czasie rzeczywistym)
 */

// Gdy zmieni się wybór w sortowaniu - zaktualizuj wyświetlanie
document.getElementById('sortSelect').addEventListener('change', updateDisplay);

// Gdy użytkownik wpisuje w wyszukiwarkę - zaktualizuj wyświetlanie
document.getElementById('searchInput').addEventListener('input', updateDisplay);

// Gdy zmieni się wybór platformy - zaktualizuj wyświetlanie
document.getElementById('platformFilter').addEventListener('change', updateDisplay);

// Gdy zmieni się wybór czasu trwania - zaktualizuj wyświetlanie
document.getElementById('durationFilter').addEventListener('change', updateDisplay);

/* ========================================
   INICJALIZACJA - PIERWSZE WYŚWIETLENIE
   ======================================== */

// Wywołaj updateDisplay() przy załadowaniu strony
// To wyświetli wszystkie filmy i seriale na start
updateDisplay();

/* ========================================
   INTEGRACJA Z BAZĄ DANYCH (PRZYKŁAD)
   ======================================== */

/**
 * PRZYSZŁA FUNKCJA DO POBIERANIA DANYCH Z BAZY
 * Odkomentuj i dostosuj gdy będziesz gotowy do połączenia z API
 */
/*
async function loadDataFromDatabase() {
    try {
        // Promise.all() pozwala wykonać wiele requestów jednocześnie
        const [moviesResponse, serialsResponse] = await Promise.all([
            fetch('/api/movies'),      // Endpoint dla filmów
            fetch('/api/series')       // Endpoint dla seriali
        ]);

        // Zamień odpowiedzi na format JSON
        moviesData = await moviesResponse.json();
        serialsData = await serialsResponse.json();

        // Wyświetl pobrane dane
        updateDisplay();
    } catch (error) {
        // Obsługa błędów (np. brak połączenia z serwerem)
        console.error('Błąd ładowania danych:', error);
    }
}

// Wywołaj tę funkcję zamiast updateDisplay() przy starcie:
// loadDataFromDatabase();
*/

/*
========================================
PRZYDATNE LINKI DO NAUKI JAVASCRIPT:
========================================
- JavaScript Basics: https://developer.mozilla.org/pl/docs/Web/JavaScript/Guide
- Array Methods (map, filter, sort): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- Event Listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- DOM Manipulation: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Arrow Functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
- Template Literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
*/