/* ========================================
   GLOBALNE DANE
   ======================================== */

let moviesData = [];
let serialsData = [];
let favorites = [];
let searchHistory = [];

const FAVORITES_COOKIE = 'plusfix_favorites';
const HISTORY_COOKIE = 'plusfix_history';
const COOKIE_DAYS = 30;

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function loadFavorites() {
    try {
        const raw = getCookie(FAVORITES_COOKIE);
        favorites = raw ? JSON.parse(raw) : [];
    } catch (e) {
        favorites = [];
    }
}

function saveFavorites() {
    setCookie(FAVORITES_COOKIE, JSON.stringify(favorites), COOKIE_DAYS);
}

function loadSearchHistory() {
    try {
        const raw = getCookie(HISTORY_COOKIE);
        searchHistory = raw ? JSON.parse(raw) : [];
    } catch (e) {
        searchHistory = [];
    }
}

function saveSearchHistory() {
    setCookie(HISTORY_COOKIE, JSON.stringify(searchHistory.slice(0, 5)), COOKIE_DAYS);
}

//   ŁADOWANIE Z API
async function loadMoviesFromDatabase() {
    try {
        const response = await fetch('http://localhost:8000/backend/API/movies.php');
        const data = await response.json();

        moviesData = data.map(m => ({
            ...m,
            type: "movie",
            genre: m.genre || 'Inne'
        }));

        refreshViews();
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
            type: "series",
            genre: s.genre || 'Inne'
        }));

        refreshViews();
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

        const favoriteKey = `${item.type}-${item.id}`;
        const isFavorite = favorites.some(f => f.key === favoriteKey);

        const platformClass =
            'platform-' + item.platform.toLowerCase().replace(/[^a-z]/g, '');

        card.innerHTML = `
            <div class="movie-title">${item.title}</div>
            <div class="movie-year">${item.year}</div>
            <div class="movie-info">
                <span class="${platformClass} platform-badge">${item.platform}</span>
            </div>
            <div class="movie-info">${formatDuration(item)}</div>
            <div class="movie-info">${item.genre ?? ''}</div>
            <div class="movie-info">${item.info3 ?? ''}</div>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-key="${favoriteKey}">
                ${isFavorite ? '★ Ulubione' : '☆ Dodaj'}
            </button>
        `;

        container.appendChild(card);

        card.addEventListener('click', () => showDetail(item));
    });

    container.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(btn.dataset.key);
        });
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
    displayFavorites();
    renderCategories();
    renderFavoritesPage();
}

function toggleFavorite(key) {
    const exists = favorites.find(f => f.key === key);
    if (exists) {
        favorites = favorites.filter(f => f.key !== key);
    } else {
        favorites.push({ key });
    }
    saveFavorites();
    displayFavorites();
    updateDisplay();
}

function displayFavorites() {
    const container = document.getElementById('favoritesContainer');
    const allItems = [...moviesData, ...serialsData];
    const favItems = favorites
        .map(f => allItems.find(i => `${i.type}-${i.id}` === f.key))
        .filter(Boolean);

    if (!favItems.length) {
        container.innerHTML = '<p style="color:#777;">Brak ulubionych</p>';
        return;
    }

    container.innerHTML = '';
    favItems.forEach(item => {
        const el = document.createElement('div');
        el.className = 'favorites-item';
        el.innerHTML = `
            <span>${item.title} (${item.year})</span>
            <button class="favorite-btn active" data-key="${item.type}-${item.id}">Usuń</button>
        `;
        el.querySelector('button').addEventListener('click', () => toggleFavorite(`${item.type}-${item.id}`));
        container.appendChild(el);
    });
}

function addSearchTermToHistory(term) {
    if (!term.trim()) return;
    const normalized = term.trim();
    // Unikamy duplikatów, najnowsze na górze
    searchHistory = [normalized, ...searchHistory.filter(t => t !== normalized)].slice(0, 5);
    saveSearchHistory();
    renderSearchHistory();
}

function renderSearchHistory() {
    const list = document.getElementById('searchHistory');
    list.innerHTML = '';
    if (!searchHistory.length) {
        list.innerHTML = '<li style="list-style:none;color:#777;border:none;">Brak historii</li>';
        return;
    }
    searchHistory.forEach(term => {
        const li = document.createElement('li');
        li.textContent = term;
        li.addEventListener('click', () => {
            document.getElementById('searchInput').value = term;
            updateDisplay();
        });
        list.appendChild(li);
    });
}

function renderFavoritesPage() {
    const container = document.getElementById('favoritesPage');
    const allItems = [...moviesData, ...serialsData];
    const favItems = favorites
        .map(f => allItems.find(i => `${i.type}-${i.id}` === f.key))
        .filter(Boolean);

    if (!favItems.length) {
        container.innerHTML = '<p style="color:#777;">Brak ulubionych</p>';
        return;
    }

    container.innerHTML = '';
    favItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="movie-title">${item.title}</div>
            <div class="movie-year">${item.year}</div>
            <div class="movie-info">${item.platform}</div>
            <div class="movie-info">${item.genre ?? ''}</div>
            <button class="favorite-btn active">Usuń</button>
        `;
        card.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(`${item.type}-${item.id}`);
        });
        card.addEventListener('click', () => showDetail(item));
        container.appendChild(card);
    });
}

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    const allItems = [...moviesData, ...serialsData];
    const byGenre = allItems.reduce((acc, item) => {
        const key = item.genre || 'Inne';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    container.innerHTML = '';

    Object.keys(byGenre).sort().forEach(genre => {
        const row = document.createElement('div');
        row.className = 'category-row';
        row.innerHTML = `<div class="category-title">${genre}</div>`;

        const list = document.createElement('div');
        list.className = 'category-list';

        byGenre[genre].forEach(item => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-title-card">${item.title}</div>
                <div class="category-info">
                    <div>${item.year}</div>
                    <div>${item.platform}</div>
                    <div>${item.type === 'movie' ? formatDuration(item) : item.episodes + ' odc.'}</div>
                </div>
            `;
            card.addEventListener('click', () => showDetail(item));
            list.appendChild(card);
        });

        row.appendChild(list);
        container.appendChild(row);
    });
}

function showDetail(item) {
    const modal = document.getElementById('detailModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.getElementById('detailType').textContent = item.type === 'movie' ? 'Film' : 'Serial';
    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailYear').textContent = `Rok: ${item.year}`;
    document.getElementById('detailPlatform').textContent = `Platforma: ${item.platform}`;
    document.getElementById('detailDuration').textContent = item.type === 'movie'
        ? `Czas trwania: ${formatDuration(item)}`
        : `Odcinki: ${item.episodes} × ${item.avgTime} min`;
    document.getElementById('detailGenre').textContent = `Gatunek: ${item.genre ?? 'Brak danych'}`;
    document.getElementById('detailInfo').textContent = item.info3 ?? '';
}

function hideDetail() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hidden');
}

function refreshViews() {
    updateDisplay();
}

function setupNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const target = link.dataset.target;
            document.querySelectorAll('.page-section').forEach(sec => {
                sec.classList.add('hidden');
            });
            const sec = document.getElementById(target);
            if (sec) sec.classList.remove('hidden');
        });
    });
}

   //START

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadSearchHistory();
    renderSearchHistory();

    loadMoviesFromDatabase();
    loadSerialsFromDatabase();

    document.getElementById('sortSelect').addEventListener('change', updateDisplay);
    document.getElementById('searchInput').addEventListener('input', updateDisplay);
    document.getElementById('searchInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const term = document.getElementById('searchInput').value;
            addSearchTermToHistory(term);
            updateDisplay();
        }
    });
    document.getElementById('platformFilter').addEventListener('change', updateDisplay);
    document.getElementById('durationFilter').addEventListener('change', updateDisplay);

    setupNav();

    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.addEventListener('click', hideDetail);
    const modal = document.getElementById('detailModal');
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) hideDetail();
    });
});
