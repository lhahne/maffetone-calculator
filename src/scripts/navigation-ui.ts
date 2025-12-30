export function setupNav(container: Document | HTMLElement = typeof document !== 'undefined' ? document : {} as Document) {
    const toggleBtn = (typeof Document !== 'undefined' && container instanceof Document ? container.getElementById('nav-toggle') : container.querySelector('#nav-toggle')) as HTMLElement | null;
    const menu = (typeof Document !== 'undefined' && container instanceof Document ? container.getElementById('nav-menu') : container.querySelector('#nav-menu')) as HTMLElement | null;
    const hamburgerIcon = (typeof Document !== 'undefined' && container instanceof Document ? container.getElementById('hamburger-icon') : container.querySelector('#hamburger-icon')) as HTMLElement | null;
    const closeIcon = (typeof Document !== 'undefined' && container instanceof Document ? container.getElementById('close-icon') : container.querySelector('#close-icon')) as HTMLElement | null;

    if (!toggleBtn || !menu || !hamburgerIcon || !closeIcon) return;

    function toggleMenu() {
        const isClosed = menu!.classList.contains('-translate-x-full');
        if (isClosed) {
            menu!.classList.remove('-translate-x-full');
            menu!.classList.add('translate-x-0');
            hamburgerIcon!.classList.add('hidden');
            closeIcon!.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            menu!.classList.add('-translate-x-full');
            menu!.classList.remove('translate-x-0');
            hamburgerIcon!.classList.remove('hidden');
            closeIcon!.classList.add('hidden');
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
    const outsideClickListener = (e: MouseEvent) => {
        if (!menu!.classList.contains('-translate-x-full') && !menu!.contains(e.target as Node) && !toggleBtn!.contains(e.target as Node)) {
            toggleMenu();
        }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
        document.removeEventListener('click', outsideClickListener);
    };
}
