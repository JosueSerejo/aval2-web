import { MOVIE_GENRE_API_URL, TV_GENRE_API_URL, genreMap, $genreFilter } from '../config/index.js'
import { movieGenres, filters } from '../config/index.js'

export function populateGenreFilter(mediaType) {
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

    filters.currentGenreId = '';
}

export async function initGenres() {
    try {
        const [movieRes, tvRes] = await Promise.all([
            fetch(MOVIE_GENRE_API_URL),
            fetch(TV_GENRE_API_URL)
        ]);

        const [movieData, tvData] = await Promise.all([
            movieRes.json(),
            tvRes.json()
        ]);

        Object.keys(genreMap).forEach(key => delete genreMap[key])

        const combinedGenres = [...movieData.genres, ...tvData.genres];
        combinedGenres.forEach(genre => {
            genreMap[genre.id] = genre.name;
        });

        populateGenreFilter('all');

    } catch (error) {
        console.error('Não foi possível carregar lista de gêneros:', error);
    }
}