export const state = {
    movie: { currentPage: 1, totalPages: 1 },
    tv: { currentPage: 1, totalPages: 1 }
};

export const filters = {
    currentSearchTerm: '',
    currentGenreId: ''
}

export const spinnerState = {
    spinnerMinimumTime: 800,
    movieSpinnerStartTime: 0,
    tvSpinnerStartTime: 0
}

export let genreMap = {};
export let movieGenres = [];
export let tvGenres = [];