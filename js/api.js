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

// Elementos DOM
const $catalogMovie = document.getElementById('movie-catalog');
const $catalogTv = document.getElementById('tv-catalog');
const $searchInput = document.getElementById('search-input');
const $searchButton = document.getElementById('search-button');
const $mediaTypeFilter = document.getElementById('media-type-filter');
const $genreFilter = document.getElementById('genre-filter');
const $movieSpinner = document.getElementById('movie-spinner')
const $tvSpinner = document.getElementById('tv-spinner')

// Elementos de Paginação
const $prevMovieBtn = document.getElementById('prev-movie-button');
const $nextMovieBtn = document.getElementById('next-movie-button');
const $moviePageInfo = document.getElementById('movie-page-info');
const $prevTvBtn = document.getElementById('prev-tv-button');
const $nextTvBtn = document.getElementById('next-tv-button');
const $tvPageInfo = document.getElementById('tv-page-info');

// Elementos do Modal
const $detailsModal = document.getElementById('details-modal');
const $modalBody = document.getElementById('modal-body');
const $closeButton = document.querySelector('.details-modal .close-button');

// Função para preencher o filtro de Gêneros com a lista correta
function populateGenreFilter(mediaType) {
    let genresToUse = [];
    if (mediaType === 'movie') {
        genresToUse = movieGenres;
    } else if (mediaType === 'tv') {
        genresToUse = tvGenres;
    } else {
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

        movieGenres = movieData.genres;
        tvGenres = tvData.genres;

        const combinedGenres = [...movieData.genres, ...tvData.genres];
        combinedGenres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });

        populateGenreFilter('all');

    } catch (error) {
        console.error('Não foi possível carregar lista de gêneros:', error);
    }
}

// BUSCA DE MÍDIA
async function fetchMedia(mediaType, page = 1, searchTerm = '', genreId = '') {
    const isMovie = (mediaType === 'movie');
    const catalogElement = isMovie ? $catalogMovie : $catalogTv;

    if (isMovie) $movieSpinner.style.display = 'block';
    else $tvSpinner.style.display = 'block';

    const dateFilter = isMovie ? `primary_release_date.gte=${RELEASE_DATE_GTE}` : `first_air_date.gte=${RELEASE_DATE_GTE}`;

    let url;

    if (searchTerm) {
        url = `${BASE}/search/multi?api_key=${API_KEY}&${LANG}&query=${searchTerm}&page=${page}`;
    } else {
        url = `${BASE}/discover/${mediaType}?api_key=${API_KEY}&${LANG}&${dateFilter}&sort_by=popularity.desc&page=${page}`;
        if (genreId) url += `&with_genres=${genreId}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        state[mediaType].currentPage = data.page;
        state[mediaType].totalPages = data.total_pages;

        let results = data.results.filter(item => (item.media_type === mediaType || !searchTerm) && item.media_type !== 'person');

        if (results.length === 0) {
            showMedia(results, catalogElement, mediaType)
        } else {
            showMedia(results, catalogElement, mediaType);
        }
        updatePaginationControls(mediaType);
    } catch (error) {
        console.error(`Erro ao buscar ${mediaType}:`, error);
        showMedia([], catalogElement, mediaType)
        updatePaginationControls(mediaType, true);
    }
    finally {
        if (isMovie) $movieSpinner.style.display = 'none';
        else $tvSpinner.style.display = 'none';
    }
}

// Busca detalhes específicos de um item
async function fetchDetails(id, mediaType) {
    const url = `${BASE}/${mediaType}/${id}?api_key=${API_KEY}&${LANG}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao buscar detalhes.');
        return await res.json();
    } catch (error) {
        console.error(`Erro ao buscar detalhes de ${mediaType} ${id}:`, error);
        return null;
    }
}

// Inicializa o accordion das temporadas
function initializeSeasonAccordion() {
    const $accordion = document.getElementById('seasons-accordion');
    if (!$accordion) return;

    $accordion.querySelectorAll('.season-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const $item = header.closest('.season-item');
            const $list = $item.querySelector('.episode-list');
            const $icon = header.querySelector('.toggle-icon');
            const isCurrentlyOpen = $list.style.display === 'block';

            $accordion.querySelectorAll('.episode-list').forEach(list => {
                list.style.display = 'none';
                list.closest('.season-item').querySelector('.toggle-icon').textContent = '+';
            });

            if (!isCurrentlyOpen) {
                $list.style.display = 'block';
                $icon.textContent = '–';
            }
        });
    });
}


// Renderiza e exibe o modal
function showDetailsModal(item, details) {
    const isMovie = (item.mediaType === 'movie');
    const title = details.title || details.name || 'Título Desconhecido';
    const originalTitle = details.original_title || details.original_name;
    const synopsis = details.overview || 'Sinopse indisponível.';
    const rating = details.vote_average ? `${(details.vote_average * 10).toFixed(0)}%` : 'N/A';
    const posterUrl = details.poster_path ? IMG_PATH + details.poster_path : 'https://via.placeholder.com/180x270?text=Sem+Poster';

    // *** CORREÇÃO DE DATA
    const rawDate = details.release_date || details.first_air_date;
    let formattedDate = 'N/A';
    if (rawDate) {
        formattedDate = rawDate.split('-').reverse().join('/');
    }

    // Informações Básicas
    let contentHTML = `
        <div class="modal-header-info">
            <img class="modal-poster" src="${posterUrl}" alt="Pôster de ${title}">
            <div class="modal-text-content">
                <h2>${title}</h2>
                ${originalTitle && originalTitle !== title ? `<p class="original-title">Título Original: ${originalTitle}</p>` : ''}
                <p class="modal-rating"><img src="./assets/icons/star.svg" alt="Ícone estrela"> Avaliações: ${rating} <span>(${details.vote_count || 0} votos)</span></p>
                <p class="release-info">Lançamento: ${formattedDate}</p>
                <p class="genres-info">Gêneros: ${details.genres ? details.genres.map(g => g.name).join(', ') : 'N/A'}</p>
            </div>
        </div>

        <div class="modal-synopsis">
            <p class="synopsis-title">Sinopse:</p>
            <p>${synopsis}</p>
        </div>
    `;

    // Temporadas e Episódios
    if (!isMovie && details.seasons && details.seasons.length > 0) {
        const seasonsHTML = details.seasons
            .filter(season => season.season_number >= 1)
            .map(season => {
                const seasonTitle = season.name || `Temporada ${season.season_number}`;
                const episodeCount = season.episode_count || 0;

                // CORREÇÃO DE DATA PARA TEMPORADAS
                let seasonAirDate = 'N/A';
                if (season.air_date) {
                    seasonAirDate = season.air_date.split('-').reverse().join('/');
                }

                const episodesContent = `
                    <div class="episode-list-content">
                        <p><strong>Total de Episódios:</strong> ${episodeCount}</p>
                        <p><strong>Data de Lançamento:</strong> ${seasonAirDate}</p>
                        <p><strong>Sinopse:</strong> ${season.overview || 'Sem sinopse para esta temporada.'}</p>
                    </div>
                `;

                return `
                    <li class="season-item">
                        <div class="season-header">
                            <span class="season-title-info">${seasonTitle} (${episodeCount} episódios)</span>
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="episode-list">
                            ${episodesContent}
                        </div>
                    </li>
                `;
            }).join('');

        contentHTML += `
            <div class="seasons-section">
                <h3>Temporadas</h3>
                <ul class="seasons-list" id="seasons-accordion">
                    ${seasonsHTML}
                </ul>
            </div>
        `;
    }

    $modalBody.innerHTML = contentHTML;
    $detailsModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    initializeSeasonAccordion();
}

// RENDERIZAÇÃO
function showMedia(results, catalogElement, mediaType) {
    const itemsToShow = results.slice(0, 6);

    const existingCards = catalogElement.querySelectorAll('.movie-card');
    const existingLoadingMessages = catalogElement.querySelectorAll('.loading');

    existingCards.forEach(card => card.remove());
    existingLoadingMessages.forEach(msg => msg.remove());

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
            <div class="movie-card" data-id="${item.id}" data-media-type="${isMovie ? 'movie' : 'tv'}">
                <img src="${posterUrl}" alt="${title}">
                <h3>${title}</h3>
                <p>Tipo: ${isMovie ? 'Filme' : 'Série'}</p>
                <p>Ano: ${year}</p>
                <p>Gênero(s): ${genreNames}</p>
            </div>
        `;
        catalogElement.insertAdjacentHTML('beforeend', cardHTML)
    });

    catalogElement.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', async () => {
            const id = card.dataset.id;
            const type = card.dataset.mediaType;

            $modalBody.innerHTML = '<p class="loading">Carregando detalhes...</p>';
            $detailsModal.classList.add('show');
            document.body.style.overflow = 'hidden';

            const details = await fetchDetails(id, type);

            if (details) {
                showDetailsModal(card.dataset, details);
            } else {
                $modalBody.innerHTML = '<p class="loading">Não foi possível carregar os detalhes.</p>';
            }
        });
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
        $pageInfo.textContent = 'Páginação indisponível';
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
        fetchMedia(mediaType, newPage, currentSearchTerm, currentGenreId);
    }
}

// LÓGICA DE BUSCA E FILTRO RESPEITANDO O TIPO DE MÍDIA SELECIONADO
function handleSearchAndFilter() {
    currentSearchTerm = $searchInput.value;
    currentGenreId = $genreFilter.value;
    const mediaTypeSelected = $mediaTypeFilter.value;
    const fetchPromises = [];

    if (mediaTypeSelected === 'movie' || mediaTypeSelected === 'all') {
        fetchPromises.push(fetchMedia('movie', 1, currentSearchTerm, currentGenreId));
    } else {
        $catalogMovie.innerHTML = `<p class="loading">Filmes desativados pelo filtro.</p>`;
        updatePaginationControls('movie', true);
    }

    if (mediaTypeSelected === 'tv' || mediaTypeSelected === 'all') {
        fetchPromises.push(fetchMedia('tv', 1, currentSearchTerm, currentGenreId));
    } else {
        $catalogTv.innerHTML = `<p class="loading">Séries desativadas pelo filtro.</p>`;
        updatePaginationControls('tv', true);
    }

    if (fetchPromises.length > 0) {
        Promise.all(fetchPromises);
    }
}

async function initializeApp() {
    await initGenres();

    await Promise.all([
        fetchMedia('movie', 1, currentSearchTerm, currentGenreId),
        fetchMedia('tv', 1, currentSearchTerm, currentGenreId)
    ]);
}

// Lógica de fechamento do modal
$closeButton.onclick = () => {
    $detailsModal.classList.remove('show');
    document.body.style.overflow = 'auto';
};

window.onclick = (event) => {
    if (event.target === $detailsModal) {
        $detailsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
};