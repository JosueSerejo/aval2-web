import { state, filters } from '../config/index.js'
import { $searchInput, $genreFilter, $mediaTypeFilter, $catalogMovie, $catalogTv } from '../config/index.js'
import { fetchMedia } from './api.js'
import { updatePaginationControls } from './pagination.js'

export function handleSearchAndFilter() {
    filters.currentSearchTerm = $searchInput.value;
    filters.currentGenreId = $genreFilter.value;
    const mediaTypeSelected = $mediaTypeFilter.value;
    const fetchPromises = [];

    const clearCatalogMessages = (catalogElement) => {
        const existingCards = catalogElement.querySelectorAll('.movie-card')
        const existingMessages = catalogElement.querySelectorAll('.loading');
        existingMessages.forEach(msg => msg.remove())
        existingCards.forEach(card => card.remove())
    };

    if (mediaTypeSelected === 'movie' || mediaTypeSelected === 'all') {
        clearCatalogMessages($catalogMovie)
        fetchPromises.push(fetchMedia('movie', 1, filters.currentSearchTerm, filters.currentGenreId));
    } else {
        clearCatalogMessages($catalogMovie);
        const message = document.createElement('p');
        message.className = 'loading';
        message.textContent = 'Filmes desativados pelo filtro.';
        $catalogMovie.appendChild(message)
        updatePaginationControls('movie', true)

        state.movie.currentPage = 1;
        state.movie.totalPages = 1;
    }

    if (mediaTypeSelected === 'tv' || mediaTypeSelected === 'all') {
        clearCatalogMessages($catalogTv)
        fetchPromises.push(fetchMedia('tv', 1, filters.currentSearchTerm, filters.currentGenreId));
    } else {
        clearCatalogMessages($catalogTv);
        const message = document.createElement('p');
        message.className = 'loading';
        message.textContent = 'Séries desativados pelo filtro.';
        $catalogTv.appendChild(message)
        updatePaginationControls('tv', true)

        state.tv.currentPage = 1;
        state.tv.totalPages = 1;
    }

    if (fetchPromises.length > 0) {
        Promise.all(fetchPromises);
    }
}