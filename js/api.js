// CONFIGURAÇÃO DA API

const API_KEY = '13c79f644cb25e1a1aae5b5824eb32de';
const BASE = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const LANG = 'language=pt-BR';

const CURRENT_YEAR = new Date().getFullYear();
const RELEASE_DATE_GTE = `primary_release_date.gte=${CURRENT_YEAR}-01-01`;

// Estado da Aplicação
let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';
let currentGenreId = '';

// Elementos DOM
const $catalog = document.getElementById('movie-catalog');
const $searchInput = document.getElementById('search-input');
const $searchButton = document.getElementById('search-button');
const $genreFilter = document.getElementById('genre-filter');
const $prevBtn = document.getElementById('prev-page-button');
const $nextBtn = document.getElementById('next-page-button');
const $pageInfo = document.getElementById('page-info');

// BUSCA DE FILMES
async function fetchMovies(page = 1, searchTerm = '', genreId = '') {
    currentPage = page;
    let url;
    if (searchTerm) {
        url = `${BASE}/search/movie?api_key=${API_KEY}&${LANG}&query=${searchTerm}&page=${page}`;
    } else {
        url = `${BASE}/discover/movie?api_key=${API_KEY}&${LANG}&${RELEASE_DATE_GTE}&sort_by=popularity.desc&page=${page}`;
        if (genreId) url += `&with_genres=${genreId}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        totalPages = data.total_pages;

        $catalog.innerHTML = '';
        if (data.results.length === 0) {
            $catalog.innerHTML = '<p class="loading">Nenhum filme encontrado.</p>';
        } else {
            showMovies(data.results);
        }

        updatePaginationControls();
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        $catalog.innerHTML = '<p class="loading">Erro ao carregar filmes.</p>';
        updatePaginationControls(true);
    }
}

// RENDERIZAÇÃO
function showMovies(movies) {
    const moviesToShow = movies.slice(0, 6);
    $catalog.innerHTML = '';

    moviesToShow.forEach(movie => {
        const posterUrl = movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/180x270?text=Sem+Poster';
        const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
        const genres = movie.genre_ids.join(', ');

        const cardHTML = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>Ano: ${year}</p>
                <p>Tipo: Filme</p>
                <p>Gênero(s): ${genres}</p>
            </div>
        `;
        $catalog.innerHTML += cardHTML;
    });
}

// PAGINAÇÃO E CONTROLES
function updatePaginationControls(isError = false) {
    if (isError) {
        $prevBtn.disabled = true;
        $nextBtn.disabled = true;
        $pageInfo.textContent = 'Erro';
        return;
    }

    const displayTotalPages = totalPages < 1 ? 1 : totalPages;
    $pageInfo.textContent = `Página ${currentPage} de ${displayTotalPages}`;

    $prevBtn.disabled = currentPage <= 1;
    $nextBtn.disabled = currentPage >= totalPages;
}

function handleNavigation(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        fetchMovies(newPage, currentSearchTerm, currentGenreId);
        window.scrollTo(0, 0);
    }
}

function handleSearchAndFilter() {
    currentSearchTerm = $searchInput.value;
    currentGenreId = $genreFilter.value;
    fetchMovies(1, currentSearchTerm, currentGenreId);
}

// BOTÃO DE PESQUISA, FILTROS, E NAVEGAÇÃO

$searchButton.addEventListener('click', handleSearchAndFilter);
$searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchAndFilter();
});

$genreFilter.addEventListener('change', handleSearchAndFilter);

$prevBtn.addEventListener('click', () => handleNavigation(-1));
$nextBtn.addEventListener('click', () => handleNavigation(1));

fetchMovies(1, currentSearchTerm, currentGenreId);