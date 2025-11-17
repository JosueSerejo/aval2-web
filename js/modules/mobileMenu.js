function initializeMobileMenu() {
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenu && menuToggleButton) {

        const navLinks = mobileMenu.querySelectorAll('a');

        function toggleMenu() {
            mobileMenu.classList.toggle('active');
        }

        menuToggleButton.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeMobileMenu);