export function initNav() {
  const navHTML = `
    <button id="nav-toggle" class="fixed top-6 left-6 z-50 p-2 text-white bg-slate-800 rounded-lg border border-white/10 hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Toggle Menu">
      <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div id="nav-menu" class="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm transition-transform duration-300 transform -translate-x-full flex items-center justify-center">
        <nav class="flex flex-col gap-8 text-center">
            <a href="/" class="text-3xl font-semibold text-white hover:text-sky-400 transition">Maffetone Calculator</a>
            <a href="/pace.html" class="text-3xl font-semibold text-white hover:text-sky-400 transition">Pace Calculator</a>
        </nav>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', navHTML);

  const toggleBtn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  function toggleMenu() {
    const isClosed = menu.classList.contains('-translate-x-full');
    if (isClosed) {
        menu.classList.remove('-translate-x-full');
        menu.classList.add('translate-x-0');
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
        menu.classList.add('-translate-x-full');
        menu.classList.remove('translate-x-0');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
          toggleMenu();
      });
  });
}
