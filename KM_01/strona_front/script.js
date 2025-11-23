/* ========================================
   DANE Z BAZY
   ======================================== */

let moviesData = [];
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

async function loadDataFromDatabase() {
    const response = await fetch('http://localhost:8000/api/movies.php');
    const data = await response.json();

    // DODAJEMY TYPE
    moviesData = data.map(m => ({
        ...m,
        type: "movie"
    }));

    updateDisplay();
}

loadDataFromDatabase();

/* ========================================
   FUNKCJE
   ======================================== */

function formatDuration(item) {
    if (item.type === 'movie') {
        const hours = Math.floor(item.duration / 60);
        const minutes = item.duration % 60;
        return `${hours}h ${minutes}min`;
    } else {
        return `${item.episodes} odc. (~${item.avgTime}min/odc.)`;
    }
}

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Brak wyników</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const platformClass = 'platform-' + item.platform.toLowerCase().replace(/[^a-z]/g, '');

        card.innerHTML = `
            <div class="movie-title">${item.title}</div>
            <div class="movie-year">${item.year}</div>
            <div class="movie-info">
                <span class="${platformClass} platform-badge">${item.platform}</span>
            </div>
            <div class="movie-info">${formatDuration(item)}</div>
            <div class="movie-info">${item.info3 ?? ''}</div>
        `;

        container.appendChild(card);
    });
}

function sortItems(items, sortType) {
    const sorted = [...items];

    if (sortType === 'az') {
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'pl'));
    } else if (sortType === 'za') {
        sorted.sort((a, b) => b.title.localeCompare(a.title, 'pl'));
    } else if (sortType === 'year-asc') {
        sorted.sort((a, b) => a.year - b.year);
    } else if (sortType === 'year-desc') {
        sorted.sort((a, b) => b.year - a.year);
    }

    return sorted;
}

function searchItems(items, searchTerm) {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
        item.title.toLowerCase().includes(term)
    );
}

function filterByPlatform(items, platform) {
    if (!platform) return items;
    return items.filter(item => item.platform === platform);
}

function filterByDuration(items, durationType) {
    if (!durationType) return items;

    return items.filter(item => {
        if (item.type === 'movie') {
            if (durationType === 'short') return item.duration <= 120;
            if (durationType === 'medium') return item.duration > 120 && item.duration <= 180;
            if (durationType === 'long') return item.duration > 180;
        } else {
            if (durationType === 'short') return item.episodes <= 10;
            if (durationType === 'medium') return item.episodes > 10 && item.episodes <= 20;
            if (durationType === 'long') return item.episodes > 20;
        }
        return true;
    });
}

function updateDisplay() {
    const searchTerm = document.getElementById('searchInput').value;
    const sortType = document.getElementById('sortSelect').value;
    const platform = document.getElementById('platformFilter').value;
    const duration = document.getElementById('durationFilter').value;

    let filteredMovies = searchItems(moviesData, searchTerm);
    filteredMovies = filterByPlatform(filteredMovies, platform);
    filteredMovies = filterByDuration(filteredMovies, duration);
    filteredMovies = sortItems(filteredMovies, sortType);

    let filteredSerials = searchItems(serialsData, searchTerm);
    filteredSerials = filterByPlatform(filteredSerials, platform);
    filteredSerials = filterByDuration(filteredSerials, duration);
    filteredSerials = sortItems(filteredSerials, sortType);

    displayItems(filteredMovies, 'moviesContainer');
    displayItems(filteredSerials, 'serialsContainer');
}

/* ========================================
   EVENTY
   ======================================== */

document.getElementById('sortSelect').addEventListener('change', updateDisplay);
document.getElementById('searchInput').addEventListener('input', updateDisplay);
document.getElementById('platformFilter').addEventListener('change', updateDisplay);
document.getElementById('durationFilter').addEventListener('change', updateDisplay);

