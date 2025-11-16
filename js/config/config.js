// CONFIGURAÇÃO DA API
export const API_KEY = '13c79f644cb25e1a1aae5b5824eb32de';
export const BASE = 'https://api.themoviedb.org/3';
export const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
export const LANG = 'language=pt-BR';


export const CURRENT_YEAR = new Date().getFullYear();
export const RELEASE_DATE_GTE = `${CURRENT_YEAR}-01-01`;


// URLs para Gêneros de Filmes e Séries
export const MOVIE_GENRE_API_URL = `${BASE}/genre/movie/list?api_key=${API_KEY}&${LANG}`;
export const TV_GENRE_API_URL = `${BASE}/genre/tv/list?api_key=${API_KEY}&${LANG}`;