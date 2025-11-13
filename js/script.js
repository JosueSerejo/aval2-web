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

// SPINNER

let spinnerMinimumTime = 800;
let spinnerStartTime = 0;
let isSpinnerVisible = false;

function showSpinner() {
    if($spinner && !isSpinnerVisible) {
        document.body.classList.add('spinner-active')
        $spinner.classList.add('show')
        spinnerStartTime = Date.now()
        isSpinnerVisible = true
    }
}

function hideSpinner() {
    const elapsedTime = Date.now() - spinnerStartTime
    const remainingTime = spinnerMinimumTime - elapsedTime

    if (remainingTime > 0) {
        setTimeout(() => {
            $spinner.classList.remove('show')
            document.body.classList.remove('spinner-active')
            isSpinnerVisible = false
        }, remainingTime)
    }
    else {
        $spinner.classList.remove('show')
        document.body.classList.remove('spinner-active')
        isSpinnerVisible = false
    }
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