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

// project cards
const projectData = {
    googleAnsatz: {
        images: ["images/googleAnsatzImages/mainImage.png"],
        title: 'Automated Ansatz Generation Using Neural Networks for Fermi-Hubbard Simulation',
        description: 'Proposed and conducted research on using neural networks to automate quantum circuit design to estimate molecular ground-state energies with VQE at Google Quantum AI.',
        tools: ['VQE', 'Qiskit-Python', 'Quantum Machine Learning'],
        link: '#'
    },
    ntfsFile: {
        images: ["images/NTFSFileImages/mainpage.png"],
        title: 'Resident and Non-Resident File Management in NTFS',
        description: 'Conducted research on the NTFS Master File Table (MFT) to evaluate data recovery and justify differences in resident and non-resident file persistence after user actions on SSDs and HDDs.',
        tools: ['Python', 'FTK Imager', 'Windows'],
        link: 'Projects/wiu.html'
    },
    soundscribe: {
        images: ["images/SoundScribeImages/soundscribeMain.png", "images/SoundScribeImages/second.png", "images/SoundScribeImages/third.png", "images/SoundScribeImages/fourth.png"],
        title: 'SoundScribe',
        // description: 'An intelligent audio-to-transcription application leveraging deep learning models to convert speech to text with high accuracy.',
        description: "Every beginner musician has had the dream to play the song stuck in their head for hours, but resources to find sheet music is limited. SoundScribe is a tool to help you decipher the notes to any audio file, whether it be a published song or just a tune you heard online.\n\nAfter wanting to play Bollywood songs on guitar for over 8 years, I realized tutorials to some of my favorite songs simply were not available. Many apps with guitar tabs didn't offer a wide enough variety, so I built SoundScribe. SoundScribe uses a custom neural network to clasisfy notes in small time intervals.<br><br>While it isn't the most accurate, many of SoundScribe's limitations come from a small dataset used for training, leading to small discrepencies between the frequency of notes played and notes given.",
        tools: ['Python', 'PyTorch', 'Flask'],
        link: 'Projects/SoundScribe.html'
    },
    strum: {
        images: ["images/strumLogo.png"],
        title: 'S.T.R.U.M. - Software-Translated Runtime Utility for Music',
        description: 'A comprehensive system that translates musical input through software to control hardware instruments in real-time.',
        tools: ['C++', 'Java', 'Arduino'],
        link: 'Projects/strum.html'
    },
    teamup: {
        images: ["images/TeamUpImages/mainPic.png", "images/TeamUpImages/createForm.png", "images/TeamUpImages/email.png", "images/TeamUpImages/signUp.png"],
        title: 'TeamUp',
        description: 'A collaborative platform connecting team members and simplifying project coordination with integrated scheduling and communication tools.',
        tools: ['PHP', 'MySQL', 'Google API'],
        link: 'Projects/TeamUp.html'
    },
    blankslate: {
        images: ["images/BlankSlateImages/MainPic.png", "images/BlankSlateImages/second.png", "images/BlankSlateImages/third.png"],
        title: 'BlankSlate',
        description: 'An innovative web application designed to help users discover and plan activities in their local area.',
        tools: ['PHP', 'MySQL', 'Google Maps'],
        link: 'Projects/BlankSlate.html'
    },
    nandbug: {
        images: ["images/VMStack.png"],
        title: 'Nandbug',
        description: 'A debugging tool for the Jack virtual machine, providing comprehensive stack visualization and memory introspection capabilities.',
        tools: ['Python', 'CLI', 'Jack'],
        link: 'Projects/vmStackVisualizer.html'
    },
    ravage: {
        images: ["images/ravage.png"],
        title: 'RAVAGE: Quadruped Robot',
        description: 'A four-legged robotic platform developed in collaboration with advanced locomotion and autonomous control systems.',
        tools: ['C++', 'Python', 'Arduino'],
        link: 'https://dpandaman.github.io/#projects'
    }
};
let currentIndex = 0;
let currentImages = [];
function openModal(projectKey) {
    const data = projectData[projectKey];

    // text content
    if (data.images.length > 1) {
        document.getElementById("prevBtn").style.visibility = "visible";
        document.getElementById("nextBtn").style.visibility = "visible";
    }
    else {
        document.getElementById("prevBtn").style.visibility = "hidden";
        document.getElementById("nextBtn").style.visibility = "hidden";
    }
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalLink').href = data.link;

    //show tools
    const toolsContainer = document.getElementById('modalTools');
    toolsContainer.innerHTML = '';
    data.tools.forEach(tool => {
        const tag = document.createElement('span');
        tag.className = 'modal-tool-tag';
        tag.textContent = tool;
        toolsContainer.appendChild(tag);
    });

    // create slideshow
    currentImages = data.image || data.images || [];
    currentIndex = 0;
    updateImage();

    modal.classList.add('active');
}

function updateImage() {
    const img = document.getElementById('modalImg');

    if (currentImages.length > 0) {
        img.src = currentImages[currentIndex];
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }
}

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentImages.length === 0) return;

    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImage();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentImages.length === 0) return;

    currentIndex =
        (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImage();
});

// Modal functionality
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');

// Close modal
function closeModal() {
    modal.classList.remove('active');
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});




// Handle project card clicks
document.querySelectorAll('.projDiv').forEach(proj => {
    proj.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(proj.id);
    });
});