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

const projectItems = document.querySelectorAll('.project-list-item');
const projectFilterButtons = document.querySelectorAll('[data-filter]');
const projectToolbar = document.querySelector('.project-toolbar');
const projectList = document.querySelector('.project-list');

let activeProjectFilter = 'all';

const updateProjectToolbarState = () => {
    if (!projectToolbar || !projectList) return;

    const threshold = Math.max(projectList.offsetTop - 110, 200);
    const isOverContent = window.scrollY > threshold;

    projectToolbar.classList.toggle('is-overlap', isOverContent);
};

const applyProjectFilters = () => {
    const visibleItems = [];

    projectItems.forEach((item) => {
        const categories = item.dataset.category ? item.dataset.category.split(' ') : [];
        const isOngoing = item.dataset.status === 'ongoing';
        const matchesFilter = activeProjectFilter === 'all'
            || (activeProjectFilter === 'ongoing' ? isOngoing : categories.includes(activeProjectFilter));

        item.hidden = !matchesFilter;
        item.classList.toggle('is-hidden', !matchesFilter);

        if (matchesFilter) {
            visibleItems.push(item);
        }
    });

    const firstVisibleItem = visibleItems[0];
    if (firstVisibleItem) {
        const toolbar = document.querySelector('.project-toolbar');

        if (toolbar) {
            const toolbarRect = toolbar.getBoundingClientRect();
            const desiredTop = toolbarRect.top + toolbarRect.height + 18;
            const itemTop = firstVisibleItem.getBoundingClientRect().top;
            const delta = itemTop - desiredTop;

            if (Math.abs(delta) > 0) {
                window.scrollTo({
                    top: window.scrollY + delta,
                    behavior: 'smooth'
                });
            }
        } else {
            firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

if (projectFilterButtons.length && projectItems.length) {
    projectFilterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeProjectFilter = button.dataset.filter;
            projectFilterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });

            applyProjectFilters();
            updateProjectToolbarState();
        });
    });

    applyProjectFilters();
    updateProjectToolbarState();
}

window.addEventListener('scroll', updateProjectToolbarState, { passive: true });
window.addEventListener('resize', updateProjectToolbarState);
