import { state, filters } from '../config/index.js'
import { fetchMedia  } from './api.js'

// PAGINAÇÃO E CONTROLES
export function updatePaginationControls(mediaType, isError = false) {
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


export function handleNavigation(mediaType, direction) {
    const totalPages = state[mediaType].totalPages;
    const currentPage = state[mediaType].currentPage;
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        fetchMedia(mediaType, newPage, filters.currentSearchTerm, filters.currentGenreId);
    }
}