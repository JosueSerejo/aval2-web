// BOTÃO DE PESQUISA, FILTROS, E NAVEGAÇÃO

$searchButton.addEventListener('click', handleSearchAndFilter);
$searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchAndFilter();
});

// Os filtros com a lógica de atualização seletiva
$mediaTypeFilter.addEventListener('change', handleSearchAndFilter);
$genreFilter.addEventListener('change', handleSearchAndFilter);

// Listeners de Paginação de Filmes
$prevMovieBtn.addEventListener('click', () => handleNavigation('movie', -1));
$nextMovieBtn.addEventListener('click', () => handleNavigation('movie', 1));

// Listeners de Paginação de Séries
$prevTvBtn.addEventListener('click', () => handleNavigation('tv', -1));
$nextTvBtn.addEventListener('click', () => handleNavigation('tv', 1));

// SPINNERS ESPECIFICOS - CATALOGOS DE FILME E SERIE

let spinnerMinimumTime = 800;
let movieSpinnerStartTime = 0;
let tvSpinnerStartTime = 0;


function showMovieSpinner() {
    if ($movieSpinner) {
        $movieSpinner.classList.remove('hidden')
        movieSpinnerStartTime = Date.now()
    }
}

function hideMovieSpinner() {
    const remainingTime = calculateRemainaingTime(movieSpinnerStartTime, spinnerMinimumTime)

    if (remainingTime > 0) {
        setTimeout(() => {
            $movieSpinner.classList.add('hidden')
        }, remainingTime)
    }
    else {
        $movieSpinner.classList.add('hidden')
    }
}

function showTvSpinner() {
    if ($tvSpinner) {
        $tvSpinner.classList.remove('hidden')
        tvSpinnerStartTime = Date.now()
    }
}

function hideTvSpinner() {
    const remainingTime = calculateRemainaingTime(tvSpinnerStartTime, spinnerMinimumTime)

    if (remainingTime > 0) {
        setTimeout(() => {
            $tvSpinner.classList.add('hidden')
        }, remainingTime)
    }
    else {
        $tvSpinner.classList.add('hidden')
    }
}

function calculateRemainaingTime(startTime, minimumTimeSpinner) {
    const elapsedTime = Date.now() - startTime
    const remainingTime = minimumTimeSpinner - elapsedTime
    return remainingTime
}

// MENU MOBILE

document.addEventListener('DOMContentLoaded', () => {
    // referências aos elementos do DOM
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = mobileMenu.querySelectorAll('a');

    // alternar a visibilidade do menu
    function toggleMenu() {
        mobileMenu.classList.toggle('active');
    }

    // Adicionar ouvinte de evento ao botão
    if (menuToggleButton) {
        menuToggleButton.addEventListener('click', toggleMenu);
    }
    
    // Fechar o menu ao clicar em um link (navegação)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Verifica se o menu está ativo no mobile
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});

initializeApp();