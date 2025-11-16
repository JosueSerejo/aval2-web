
export function initializeMobileMenu() {
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
}