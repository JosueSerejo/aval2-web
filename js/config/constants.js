// Estado da Aplicação
export const state = {
    movie: { currentPage: 1, totalPages: 1 },
    tv: { currentPage: 1, totalPages: 1 }
};


export let genreMap = {};
export let movieGenres = [];
export let tvGenres = [];


export const spinnerMinimumTime = 800;
export let movieSpinnerStartTime = 0;
export let tvSpinnerStartTime = 0;