const trigger = document.querySelector('#nav-trigger-end') || document.querySelector('#nav-trigger');
const nav = document.querySelector('nav');

// Small debounce/hysteresis to avoid rapid toggles when near the threshold
const TOGGLE_MIN_MS = 120; // milliseconds
let lastToggle = 0;
const SCROLL_THRESHOLD = 80; // px - fallback initial threshold

function setNavInitialState() {
    if (!nav) return;
    if (window.scrollY > SCROLL_THRESHOLD) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
}

if (trigger && nav) {
    const navObserver = new IntersectionObserver(([entry]) => {
        const shouldBeScrolled = !entry.isIntersecting;
        const now = Date.now();
        if (now - lastToggle < TOGGLE_MIN_MS) return;
        if ((nav.classList.contains('nav-scrolled')) === shouldBeScrolled) return;
        // Apply toggle on next frame for smoother paint
        window.requestAnimationFrame(() => {
            nav.classList.toggle('nav-scrolled', shouldBeScrolled);
            lastToggle = Date.now();
        });
    }, { threshold: 0, rootMargin: '-10% 0px 0px 0px' });

    navObserver.observe(trigger);

    // Ensure initial state is correct on load/restore
    setNavInitialState();
    window.addEventListener('load', setNavInitialState);
    window.addEventListener('pageshow', setNavInitialState);
    window.addEventListener('resize', setNavInitialState);
}

// Ensure nav becomes pill when scrolled to very top — handle manual scrolls
(() => {
    if (!nav) return;
    const TOP_PILL_THRESHOLD = 8; // px — how close to top counts as "top"
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            const y = window.scrollY || window.pageYOffset;
            // If we're essentially at the top, ensure pill state
            if (y <= TOP_PILL_THRESHOLD && nav.classList.contains('nav-scrolled')) {
                nav.classList.remove('nav-scrolled');
                lastToggle = Date.now();
            }
            // If we've scrolled further than the main threshold, ensure scrolled state
            else if (y > SCROLL_THRESHOLD && !nav.classList.contains('nav-scrolled')) {
                nav.classList.add('nav-scrolled');
                lastToggle = Date.now();
            }
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();


/* Reveal timeline items as they enter the viewport (staggered) */
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((el, i) => el.style.setProperty('--delay', `${i * 80}ms`));

const timelineObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.20, rootMargin: '0px 0px -5% 0px' });

timelineItems.forEach(el => timelineObserver.observe(el));

// reveal project table rows as they enter
// reveal project table rows as they enter
// select actual table rows inside the project table
const projectRows = document.querySelectorAll('#projectTable tr');

const rowObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.20, rootMargin: '0px 0px -5% 0px' });

projectRows.forEach((el, i) => {
    // stagger each row using the same --delay approach
    el.style.setProperty('--delay', `${i * 80}ms`);
    rowObserver.observe(el);
});