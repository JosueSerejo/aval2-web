// BOTÃO DE PESQUISA, FILTROS, E NAVEGAÇÃO
$searchButton.addEventListener('click', handleSearchAndFilter);
$searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearchAndFilter();
});

$genreFilter.addEventListener('change', handleSearchAndFilter);

$prevBtn.addEventListener('click', () => handleNavigation(-1));
$nextBtn.addEventListener('click', () => handleNavigation(1));