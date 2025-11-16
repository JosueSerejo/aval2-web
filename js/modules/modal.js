import { IMG_PATH } from '../config/index.js'
import { $detailsModal, $modalBody, $closeButton } from '../config/index.js'

export function initializeSeasonAccordion() {
    const $accordion = document.getElementById('seasons-accordion');
    if (!$accordion) return;

    $accordion.querySelectorAll('.season-header').forEach(header => {
        header.addEventListener('click', (e) => {
            const $item = header.closest('.season-item');
            const $list = $item.querySelector('.episode-list');
            const $icon = header.querySelector('.toggle-icon');
            const isCurrentlyOpen = $list.style.display === 'block';

            $accordion.querySelectorAll('.episode-list').forEach(list => {
                list.style.display = 'none';
                list.closest('.season-item').querySelector('.toggle-icon').textContent = '+';
            });

            if (!isCurrentlyOpen) {
                $list.style.display = 'block';
                $icon.textContent = '–';
            }
        });
    });
}

// Renderiza e exibe o modal
export function showDetailsModal(item, details) {
    const isMovie = (item.mediaType === 'movie');
    const title = details.title || details.name || 'Título Desconhecido';
    const originalTitle = details.original_title || details.original_name;
    const synopsis = details.overview || 'Sinopse indisponível.';
    const rating = details.vote_average ? `${(details.vote_average * 10).toFixed(0)}%` : 'N/A';
    const posterUrl = details.poster_path ? IMG_PATH + details.poster_path : 'https://via.placeholder.com/180x270?text=Sem+Poster';

    // FORMATAÇÃO DE DATA FILMES/SÉRIES
    const rawDate = details.release_date || details.first_air_date;
    let formattedDate = 'N/A';
    if (rawDate) {
        formattedDate = rawDate.split('-').reverse().join('/');
    }

    // Informações Básicas
    let contentHTML = `
        <div class="modal-header-info">
            <img class="modal-poster" src="${posterUrl}" alt="Pôster de ${title}">
            <div class="modal-text-content">
                <h2>${title}</h2>
                ${originalTitle && originalTitle !== title ? `<p class="original-title">Título Original: ${originalTitle}</p>` : ''}
                <p class="modal-rating"><img src="./assets/icons/star.svg" alt="Ícone estrela"> Avaliações: ${rating} <span>(${details.vote_count || 0} votos)</span></p>
                <p class="release-info">Lançamento: ${formattedDate}</p>
                <p class="genres-info">Gêneros: ${details.genres ? details.genres.map(g => g.name).join(', ') : 'N/A'}</p>
            </div>
        </div>

        <div class="modal-synopsis">
            <p class="synopsis-title">Sinopse:</p>
            <p>${synopsis}</p>
        </div>
    `;

    // Temporadas e Episódios
    if (!isMovie && details.seasons && details.seasons.length > 0) {
        const seasonsHTML = details.seasons
            .filter(season => season.season_number >= 1)
            .map(season => {
                const seasonTitle = season.name || `Temporada ${season.season_number}`;
                const episodeCount = season.episode_count || 0;

                // CORREÇÃO DE DATA PARA TEMPORADAS
                let seasonAirDate = 'N/A';
                if (season.air_date) {
                    seasonAirDate = season.air_date.split('-').reverse().join('/');
                }

                const episodesContent = `
                    <div class="episode-list-content">
                        <p><strong>Total de Episódios:</strong> ${episodeCount}</p>
                        <p><strong>Data de Lançamento:</strong> ${seasonAirDate}</p>
                        <p><strong>Sinopse:</strong> ${season.overview || 'Sem sinopse para esta temporada.'}</p>
                    </div>
                `;

                return `
                    <li class="season-item">
                        <div class="season-header">
                            <span class="season-title-info">${seasonTitle} (${episodeCount} episódios)</span>
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="episode-list">
                            ${episodesContent}
                        </div>
                    </li>
                `;
            }).join('');

        contentHTML += `
            <div class="seasons-section">
                <h3>Temporadas</h3>
                <ul class="seasons-list" id="seasons-accordion">
                    ${seasonsHTML}
                </ul>
            </div>
        `;
    }

    $modalBody.innerHTML = contentHTML;
    $detailsModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    initializeSeasonAccordion();
}


export function initializeModal() {
    $closeButton.onclick = () => {
    $detailsModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
    if (event.target === $detailsModal) {
        $detailsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    };
}