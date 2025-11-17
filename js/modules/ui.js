import { IMG_PATH, genreMap, spinnerState ,$movieSpinner, $tvSpinner, $modalBody, $detailsModal } from '../config/index.js'
import { fetchDetails  } from './api.js'
import { showDetailsModal  } from './modal.js'
import { calculateRemainaingTime  } from '../utils/helpers.js'

export function showMovieSpinner() {
    if ($movieSpinner) {
        $movieSpinner.classList.remove('hidden')
        spinnerState.movieSpinnerStartTime = Date.now()
    }
}

export function hideMovieSpinner() {
    const remainingTime = calculateRemainaingTime(spinnerState.movieSpinnerStartTime, spinnerState.spinnerMinimumTime)

    if (remainingTime > 0) {
        setTimeout(() => {
            $movieSpinner.classList.add('hidden')
        }, remainingTime)
    }
    else {
        $movieSpinner.classList.add('hidden')
    }
}


export function showTvSpinner() {
    if ($tvSpinner) {
        $tvSpinner.classList.remove('hidden')
        spinnerState.tvSpinnerStartTime = Date.now();
    }
}


export function hideTvSpinner() {
    const remainingTime = calculateRemainaingTime(spinnerState.tvSpinnerStartTime, spinnerState.spinnerMinimumTime)

    if (remainingTime > 0) {
        setTimeout(() => {
            $tvSpinner.classList.add('hidden')
        }, remainingTime)
    }
    else {
        $tvSpinner.classList.add('hidden')
    }
}

export function showMedia(results, catalogElement, mediaType) {
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