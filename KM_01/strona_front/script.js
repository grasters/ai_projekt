/* ========================================
   GLOBALNE DANE
   ======================================== */

let moviesData = [];
let serialsData = [];

//   ŁADOWANIE Z API
async function loadMoviesFromDatabase() {
    try {
        const response = await fetch('http://localhost:8000/backend/API/movies.php');
        const data = await response.json();

        moviesData = data.map(m => ({
            ...m,
            type: "movie"
        }));

        updateDisplay();
    } catch (e) {
        console.error('Błąd ładowania filmów:', e);
    }
}

async function loadSerialsFromDatabase() {
    try {
        const response = await fetch('http://localhost:8000/backend/API/serials.php');
        const data = await response.json();

        serialsData = data.map(s => ({
            ...s,
            type: "series"
        }));

        updateDisplay();
    } catch (e) {
        console.error('Błąd ładowania seriali:', e);
    }
}

  // FUNKCJE POMOCNICZE

function formatDuration(item) {
    if (item.type === 'movie') {
        const hours = Math.floor(item.duration / 60);
        const minutes = item.duration % 60;
        return `${hours}h ${minutes}min`;
    }
    return `${item.episodes} odc. (~${item.avgTime}min/odc.)`;
}

function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!items.length) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Brak wyników</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const platformClass =
            'platform-' + item.platform.toLowerCase().replace(/[^a-z]/g, '');

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

    switch (sortType) {
        case 'az':
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'pl'));
            break;
        case 'za':
            sorted.sort((a, b) => b.title.localeCompare(a.title, 'pl'));
            break;
        case 'year-asc':
            sorted.sort((a, b) => a.year - b.year);
            break;
        case 'year-desc':
            sorted.sort((a, b) => b.year - a.year);
            break;
    }

    return sorted;
}

function searchItems(items, term) {
    if (!term) return items;
    term = term.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(term));
}

function filterByPlatform(items, platform) {
    if (!platform) return items;
    return items.filter(i => i.platform === platform);
}

function filterByDuration(items, durationType) {
    if (!durationType) return items;

    return items.filter(item => {
        if (item.type === 'movie') {
            if (durationType === 'short') return item.duration <= 120;
            if (durationType === 'medium') return item.duration <= 180;
            if (durationType === 'long') return item.duration > 180;
        } else {
            if (durationType === 'short') return item.episodes <= 10;
            if (durationType === 'medium') return item.episodes <= 20;
            if (durationType === 'long') return item.episodes > 20;
        }
    });
}

function updateDisplay() {
    const searchTerm = document.getElementById('searchInput').value;
    const sortType = document.getElementById('sortSelect').value;
    const platform = document.getElementById('platformFilter').value;
    const duration = document.getElementById('durationFilter').value;

    let movies = searchItems(moviesData, searchTerm);
    movies = filterByPlatform(movies, platform);
    movies = filterByDuration(movies, duration);
    movies = sortItems(movies, sortType);

    let serials = searchItems(serialsData, searchTerm);
    serials = filterByPlatform(serials, platform);
    serials = filterByDuration(serials, duration);
    serials = sortItems(serials, sortType);

    displayItems(movies, 'moviesContainer');
    displayItems(serials, 'serialsContainer');
}

   //START

document.addEventListener('DOMContentLoaded', () => {
    loadMoviesFromDatabase();
    loadSerialsFromDatabase();

    document.getElementById('sortSelect').addEventListener('change', updateDisplay);
    document.getElementById('searchInput').addEventListener('input', updateDisplay);
    document.getElementById('platformFilter').addEventListener('change', updateDisplay);
    document.getElementById('durationFilter').addEventListener('change', updateDisplay);
});
