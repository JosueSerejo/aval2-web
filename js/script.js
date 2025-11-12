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

initializeApp();