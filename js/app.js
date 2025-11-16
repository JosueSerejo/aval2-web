import { initGenres } from './modules/genres.js'
import { fetchMedia } from './modules/api.js'
import { handleSearchAndFilter } from './modules/search.js'
import { handleNavigation } from './modules/pagination.js'
import { initializeModal } from './modules/modal.js'
import { initializeMobileMenu } from './modules/mobileMenu.js'
import { $searchButton, $searchInput, $mediaTypeFilter, $genreFilter } from './config/index.js'
import { $prevMovieBtn, $nextMovieBtn, $prevTvBtn, $nextTvBtn } from './config/index.js'


export async function initializeApp() {
    await initGenres();
    initializeModal()
    initializeMobileMenu()

    await Promise.all([
        fetchMedia('movie', 1, '', ''),
        fetchMedia('tv', 1, '', '')
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