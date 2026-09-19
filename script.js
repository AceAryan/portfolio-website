const root = document.body;
const toggleButton = document.querySelector('[data-theme-toggle]');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
} else {
    root.setAttribute('data-theme', 'dark');
}

if (toggleButton) {
    const syncButton = () => {
        const theme = root.getAttribute('data-theme');
        const isLight = theme === 'light';
        toggleButton.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        toggleButton.classList.toggle('is-light', isLight);
    };

    syncButton();

    toggleButton.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
        syncButton();
    });
}

const revealNodes = document.querySelectorAll('[data-reveal]');
if (revealNodes.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealNodes.forEach((node) => observer.observe(node));
}
