// CONFIGURAÇÃO DA API
const API_KEY = '13c79f644cb25e1a1aae5b5824eb32de';
const BASE = 'https://api.themoviedb.org/3';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const LANG = 'language=pt-BR';

const CURRENT_YEAR = new Date().getFullYear();
const RELEASE_DATE_GTE = `${CURRENT_YEAR}-01-01`;

// URLs para Gêneros de Filmes e Séries
const MOVIE_GENRE_API_URL = `${BASE}/genre/movie/list?api_key=${API_KEY}&${LANG}`;
const TV_GENRE_API_URL = `${BASE}/genre/tv/list?api_key=${API_KEY}&${LANG}`;

// Estado da Aplicação
const state = {
    movie: { currentPage: 1, totalPages: 1 },
    tv: { currentPage: 1, totalPages: 1 }
};
let currentSearchTerm = '';
let currentGenreId = '';
let genreMap = {};
let movieGenres = []; 
let tvGenres = [];  
let spinnerMinimumTime = 800;
let spinnerStartTime = 0;

// Elementos DOM
const $catalogMovie = document.getElementById('movie-catalog');
const $catalogTv = document.getElementById('tv-catalog');
const $searchInput = document.getElementById('search-input');
const $searchButton = document.getElementById('search-button');
const $mediaTypeFilter = document.getElementById('media-type-filter'); 
const $genreFilter = document.getElementById('genre-filter');
const $spinner = document.getElementById('spinner-overlay')

// Elementos de Paginação
const $prevMovieBtn = document.getElementById('prev-movie-button');
const $nextMovieBtn = document.getElementById('next-movie-button');
const $moviePageInfo = document.getElementById('movie-page-info');
const $prevTvBtn = document.getElementById('prev-tv-button');
const $nextTvBtn = document.getElementById('next-tv-button');
const $tvPageInfo = document.getElementById('tv-page-info');

// Função para preencher o filtro de Gêneros com a lista correta
function populateGenreFilter(mediaType) {
    let genresToUse = [];
    
    if (mediaType === 'movie') {
        genresToUse = movieGenres;
    } else if (mediaType === 'tv') {
        genresToUse = tvGenres;
    } else {
        // Se for 'all', usa o mapa geral para a lista combinada
        genresToUse = Object.entries(genreMap).map(([id, name]) => ({ id: parseInt(id), name: name }));
    }

    $genreFilter.innerHTML = '<option value="">Todos os Gêneros</option>';
    
    const uniqueNames = new Set(); 

    genresToUse.forEach(genre => {
        if (!uniqueNames.has(genre.name)) {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            $genreFilter.appendChild(option);
            uniqueNames.add(genre.name);
        }
    });
    
    currentGenreId = ''; 
}

// Inicializa Gêneros
async function initGenres() {
    try {
        const [movieRes, tvRes] = await Promise.all([
            fetch(MOVIE_GENRE_API_URL),
            fetch(TV_GENRE_API_URL)
        ]);

        const [movieData, tvData] = await Promise.all([
            movieRes.json(),
            tvRes.json()
        ]);
        
        // Armazena as listas separadamente
        movieGenres = movieData.genres;
        tvGenres = tvData.genres;
        
        // Constrói o mapa de tradução global
        const combinedGenres = [...movieData.genres, ...tvData.genres];
        combinedGenres.forEach(genre => {
             genreMap[genre.id] = genre.name;
        });

        populateGenreFilter('all');

    } catch (error) {
        console.error('Erro ao carregar lista de gêneros:', error);
    }
}

// BUSCA DE MÍDIA (Filmes ou Séries)
async function fetchMedia(mediaType, page = 1, searchTerm = '', genreId = '') {
    const isMovie = (mediaType === 'movie');
    const catalogElement = isMovie ? $catalogMovie : $catalogTv;
    
    const dateFilter = isMovie ? `primary_release_date.gte=${RELEASE_DATE_GTE}` : `first_air_date.gte=${RELEASE_DATE_GTE}`;
    
    let url;

    if (searchTerm) {
        url = `${BASE}/search/multi?api_key=${API_KEY}&${LANG}&query=${searchTerm}&page=${page}`;
    } else {
        url = `${BASE}/discover/${mediaType}?api_key=${API_KEY}&${LANG}&${dateFilter}&sort_by=popularity.desc&page=${page}`;
        if (genreId) url += `&with_genres=${genreId}`;
    }

    showSpinner()

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        state[mediaType].currentPage = data.page;
        state[mediaType].totalPages = data.total_pages;

        let results = data.results.filter(item => item.media_type === mediaType || !searchTerm);
        
        catalogElement.innerHTML = '';
        if (results.length === 0) {
            catalogElement.innerHTML = `<p class="loading">Nenhum(a) ${isMovie ? 'filme' : 'série'} encontrado(a).</p>`;
        } else {
            showMedia(results, catalogElement, mediaType);
        }

        updatePaginationControls(mediaType);
    } catch (error) {
        console.error(`Erro ao buscar ${mediaType}:`, error);
        catalogElement.innerHTML = `<p class="loading">Erro ao carregar ${isMovie ? 'filmes' : 'séries'}.</p>`;
        updatePaginationControls(mediaType, true);
    }
    finally {
        hideSpinner()
    }
}

// RENDERIZAÇÃO
function showMedia(results, catalogElement, mediaType) {
    const itemsToShow = results.slice(0, 6); 
    
    catalogElement.innerHTML = ''; 

    itemsToShow.forEach(item => {
        const isMovie = (mediaType === 'movie' || item.media_type === 'movie');
        
        const title = item.title || item.name; 
        const rawDate = item.release_date || item.first_air_date || 'N/A';
        const year = rawDate !== 'N/A' ? rawDate.substring(0, 4) : 'N/A';
        
        const posterUrl = item.poster_path ? IMG_PATH + item.poster_path : 'https://via.placeholder.com/180x270?text=Sem+Poster';

        const genreNames = (item.genre_ids || [])
            .map(id => genreMap[id] || 'Desconhecido')
            .join(', ');

        const cardHTML = `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${title}">
                <h3>${title}</h3>
                <p>Tipo: ${isMovie ? 'Filme' : 'Série'}</p>
                <p>Ano: ${year}</p>
                <p>Gênero(s): ${genreNames}</p>
            </div>
        `;
        catalogElement.innerHTML += cardHTML;
    });
}

// PAGINAÇÃO E CONTROLES
function updatePaginationControls(mediaType, isError = false) {
    const isMovie = (mediaType === 'movie');
    const prefix = isMovie ? 'movie' : 'tv';
    const totalPages = state[mediaType].totalPages;
    const currentPage = state[mediaType].currentPage;
    
    const $prevBtn = document.getElementById(`prev-${prefix}-button`);
    const $nextBtn = document.getElementById(`next-${prefix}-button`);
    const $pageInfo = document.getElementById(`${prefix}-page-info`);

    if (isError) {
        $prevBtn.disabled = true;
        $nextBtn.disabled = true;
        $pageInfo.textContent = 'Erro';
        return;
    }

    const displayTotalPages = totalPages < 1 ? 1 : totalPages;
    $pageInfo.textContent = `Página ${currentPage} de ${displayTotalPages}`;

    $prevBtn.disabled = currentPage <= 1;
    $nextBtn.disabled = currentPage >= displayTotalPages;
}

function handleNavigation(mediaType, direction) {
    const totalPages = state[mediaType].totalPages;
    const currentPage = state[mediaType].currentPage;
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        // NÃO TOCA NO SPINNER
        fetchMedia(mediaType, newPage, currentSearchTerm, currentGenreId);
        window.scrollTo(0, 0);
    }
}

// LÓGICA DE BUSCA E FILTRO RESPEITANDO O TIPO DE MÍDIA SELECIONADO
function handleSearchAndFilter() {
    currentSearchTerm = $searchInput.value;
    currentGenreId = $genreFilter.value;
    const mediaTypeSelected = $mediaTypeFilter.value;    
    const fetchPromises = [];

    // LÓGICA FILME: Atualiza SE for 'movie' ou 'all'
    if (mediaTypeSelected === 'movie' || mediaTypeSelected === 'all') {
        fetchPromises.push(fetchMedia('movie', 1, currentSearchTerm, currentGenreId));
    } 

    // LÓGICA SÉRIE: Atualiza SE for 'tv' ou 'all'
    if (mediaTypeSelected === 'tv' || mediaTypeSelected === 'all') {
        fetchPromises.push(fetchMedia('tv', 1, currentSearchTerm, currentGenreId));
    } 

    if (fetchPromises.length > 0) {
        Promise.all(fetchPromises);
    }
}

// SPINNER

function showSpinner() {
    if($spinner) {
        $spinner.classList.add('show')
    }
}

function hideSpinner() {
    if($spinner) {
        $spinner.classList.remove('show')
    }
}

async function initializeApp() {
    await initGenres();
    
    await Promise.all([
        fetchMedia('movie', 1, currentSearchTerm, currentGenreId),
        fetchMedia('tv', 1, currentSearchTerm, currentGenreId)
    ]);
}