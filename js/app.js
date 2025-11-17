import { initGenres, populateGenreFilter } from './modules/genres.js'
import { fetchMedia, fetchDetails } from './modules/api.js'
import { showMovieSpinner, hideMovieSpinner, showTvSpinner, hideTvSpinner } from './modules/ui.js'
import { handleSearchAndFilter } from './modules/search.js'
import { handleNavigation, updatePaginationControls } from './modules/pagination.js'
import { initializeModal, showDetailsModal, initializeSeasonAccordion } from './modules/modal.js'
import { $searchButton, $searchInput, $mediaTypeFilter, $genreFilter } from './config/index.js'
import { $prevMovieBtn, $nextMovieBtn, $prevTvBtn, $nextTvBtn } from './config/index.js'
import { filters } from './config/index.js'

export async function initializeApp() {
    await initGenres();
    initializeModal()

    await Promise.all([
        fetchMedia('movie', 1, filters.currentSearchTerm, filters.currentGenreId),
        fetchMedia('tv', 1, filters.currentSearchTerm, filters.currentGenreId)
    ]);
}

document.addEventListener('DOMContentLoaded', () => {
    $searchButton.addEventListener('click', handleSearchAndFilter);
    $searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchAndFilter();
    });

    $mediaTypeFilter.addEventListener('change', handleSearchAndFilter);
    $genreFilter.addEventListener('change', handleSearchAndFilter);

    $prevMovieBtn.addEventListener('click', () => handleNavigation('movie', -1));
    $nextMovieBtn.addEventListener('click', () => handleNavigation('movie', 1));
    $prevTvBtn.addEventListener('click', () => handleNavigation('tv', -1));
    $nextTvBtn.addEventListener('click', () => handleNavigation('tv', 1));

    initializeApp()
})