import { API_KEY, BASE, RELEASE_DATE_GTE, LANG, state, $catalogMovie, $catalogTv } from '../config/index.js'
import { showMedia, showMovieSpinner, hideMovieSpinner, showTvSpinner, 
hideTvSpinner} from '../modules/ui.js'
import {  updatePaginationControls  } from '../modules/pagination.js'


// BUSCA DE MÍDIA
export async function fetchMedia(mediaType, page = 1, searchTerm = '', genreId = '') {
    const isMovie = (mediaType === 'movie');
    const catalogElement = isMovie ? $catalogMovie : $catalogTv;

    // SPINNER
    if (isMovie) showMovieSpinner();
    else showTvSpinner();

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
        if (isMovie) hideMovieSpinner()
        else hideTvSpinner()
    }
}

// Busca detalhes específicos de um item
export async function fetchDetails(id, mediaType) {
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