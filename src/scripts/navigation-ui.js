export function setupNav(container = document) {
    const toggleBtn = container.getElementById('nav-toggle');
    const menu = container.getElementById('nav-menu');
    const hamburgerIcon = container.getElementById('hamburger-icon');
    const closeIcon = container.getElementById('close-icon');

    if (!toggleBtn || !menu || !hamburgerIcon || !closeIcon) return;

    function toggleMenu() {
        const isClosed = menu.classList.contains('-translate-x-full');
        if (isClosed) {
            menu.classList.remove('-translate-x-full');
            menu.classList.add('translate-x-0');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.add('-translate-x-full');
            menu.classList.remove('translate-x-0');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Close menu when clicking outside
    const outsideClickListener = (e) => {
        if (!menu.classList.contains('-translate-x-full') && !menu.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleMenu();
        }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
        document.removeEventListener('click', outsideClickListener);
    };
}
