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

function showSpinner() {
    if($spinner) {
        $spinner.classList.add('show')
    }
}

function hideSpinner() {
    if($spinner) {
        $spinner.classList.remove('show')
    }
}

// Inicializa a Aplicação
initializeApp();