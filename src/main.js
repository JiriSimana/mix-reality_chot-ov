// Disposition sort order: 1+kk < 2+kk < 2+1 < 3+kk < 3+1
const DISPOZICE_ORDER = { "1+kk": 1, "2+kk": 2, "2+1": 3, "3+kk": 4, "3+1": 5 };

// Real property data from mixreality.eu listings in Chotěšov
// Photos sourced directly from the project's listing gallery
const PROJECT_IMAGES = {
    exterior1: "https://www.mixreality.eu/data/filecache/64/tn_zoom_filename_77533.jpg",
    exterior2: "https://www.mixreality.eu/data/filecache/8d/tn_zoom_filename_77532.jpg",
    interior1: "https://www.mixreality.eu/data/filecache/a0/tn_zoom_filename_77671.jpg",
    plan1:     "https://www.mixreality.eu/data/filecache/09/tn_zoom_filename_77598.jpg",
    plan2:     "https://www.mixreality.eu/data/filecache/b9/tn_zoom_filename_77594.jpg",
    plan3:     "https://www.mixreality.eu/data/filecache/00/tn_zoom_filename_77595.jpg",
};

const properties = [
    {
        id: 101,
        podlazi: 1,
        dispozice: "3+kk",
        orientace: "Jihovýchod",
        plocha: "87,39 m²",
        balkon: "6,20 m²",
        cena: "5 880 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.interior1, PROJECT_IMAGES.plan1],
        popis: "Prostorný byt 3+kk ve 2. nadzemním podlaží cihlového domu v centru Chotěšova, ul. Plzeňská. Byt disponuje obývacím pokojem s kuchyňským koutem, dvěma ložnicemi, koupelnou s WC a balkónem orientovaným na jihovýchod. Součástí je parkovací stání."
    },
    {
        id: 102,
        podlazi: 1,
        dispozice: "3+kk",
        orientace: "Severozápad",
        plocha: "78,20 m²",
        balkon: "—",
        cena: "5 075 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.interior1],
        popis: "Prostorný byt 3+kk v přízemí cihlového domu v centru Chotěšova, ul. Plzeňská. Celková výměra 78,20 m². Součástí je parkovací stání. Novostavba aktuálně ve fázi výstavby."
    },
    {
        id: 103,
        podlazi: 1,
        dispozice: "2+1",
        orientace: "Jihovýchod",
        plocha: "68,00 m²",
        balkon: "4,50 m²",
        cena: "5 530 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior2, PROJECT_IMAGES.interior1],
        popis: "Bytová jednotka 2+1 s balkónem v přízemí cihlového novostavby v centru Chotěšova. Podlahová plocha 68,00 m², balkón 4,50 m². Cihlová novostavba, parkovací stání v ceně."
    },
    {
        id: 104,
        podlazi: 1,
        dispozice: "2+kk",
        orientace: "Sever",
        plocha: "59,44 m²",
        balkon: "4,81 m²",
        cena: "4 000 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.plan1],
        popis: "Bytová jednotka 2+kk s balkónem v 1. nadzemním podlaží cihlového domu v centru Chotěšova, ul. Plzeňská. Celková výměra 59,44 m². Projekt ve fázi výstavby, předání plánováno 2026."
    },
    {
        id: 105,
        podlazi: 1,
        dispozice: "1+kk",
        orientace: "Východ",
        plocha: "52,86 m²",
        balkon: "3,20 m²",
        cena: "3 590 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.plan2, PROJECT_IMAGES.plan3],
        popis: "Prostorný byt 1+kk v přízemí cihlové novostavby v centru Chotěšova, ul. Plzeňská. Celková výměra 52,86 m². Dispozice: koupelna s WC, šatna, kuchyňský kout spojený s obývacím pokojem."
    },
    {
        id: 201,
        podlazi: 2,
        dispozice: "2+kk",
        orientace: "Jihozápad",
        plocha: "61,20 m²",
        balkon: "8,40 m²",
        cena: "5 600 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior2, PROJECT_IMAGES.interior1],
        popis: "Bytová jednotka 2+kk s balkónem v 2. nadzemním podlaží cihlového bytového domu, centrum Chotěšova. Výměra 61,20 m², balkón 8,40 m², orientace na jihozápad. Parkovací stání v ceně."
    },
    {
        id: 202,
        podlazi: 2,
        dispozice: "2+kk",
        orientace: "Sever",
        plocha: "58,50 m²",
        balkon: "—",
        cena: "5 075 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.plan1],
        popis: "Bytová jednotka 2+kk ve 2. nadzemním podlaží, centrum Chotěšova, ul. Plzeňská. Celková výměra 58,50 m². Cihlová novostavba, energeticky úsporné řešení, parkovací stání."
    },
    {
        id: 203,
        podlazi: 2,
        dispozice: "3+kk",
        orientace: "Jih",
        plocha: "80,00 m²",
        balkon: "5,50 m²",
        cena: "5 100 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.interior1],
        popis: "Prostorný byt 3+kk s balkónem ve 2. nadzemním podlaží, centrum Chotěšova. Výměra 80,00 m², balkón 5,50 m², orientace na jih. Součástí parkovací stání, celodřevěná výplň otvorů."
    },
    {
        id: 204,
        podlazi: 2,
        dispozice: "3+1",
        orientace: "Jihozápad",
        plocha: "112,40 m²",
        balkon: "12,0 m²",
        cena: "8 050 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior2, PROJECT_IMAGES.interior1, PROJECT_IMAGES.plan2],
        popis: "Reprezentativní byt 3+1 s velkou terasou (12 m²) v 2. nadzemním podlaží. Největší jednotka v projektu — 112,40 m². Dispozice: 3 místnosti, koupelna, WC, spíž, prostorná terasa s výhledem."
    },
    {
        id: 205,
        podlazi: 2,
        dispozice: "1+kk",
        orientace: "Východ",
        plocha: "48,90 m²",
        balkon: "3,20 m²",
        cena: "4 460 000 Kč",
        stav: "Volný",
        images: [PROJECT_IMAGES.exterior1, PROJECT_IMAGES.plan3],
        popis: "Bytová jednotka 1+kk s balkónem ve 2. nadzemním podlaží cihlové novostavby v centru Chotěšova. Výměra 48,90 m², balkón 3,20 m². Dobré dopravní spojení do Plzně (20 min)."
    },
];

let currentPropId = null;
let currentImageIndex = 0;

function renderProperties() {
    const tbody = document.getElementById('property-tbody');
    if (!tbody) return;

    const sorted = [...properties].sort((a, b) =>
        (DISPOZICE_ORDER[a.dispozice] || 99) - (DISPOZICE_ORDER[b.dispozice] || 99)
    );

    tbody.innerHTML = sorted.map((prop, index) => `
        <tr class="reveal property-row group cursor-pointer" style="transition-delay: ${index * 30}ms" onclick="openModal(${prop.id})">
            <td class="text-primary font-bold tabular-nums pl-6">${prop.id}</td>
            <td class="text-gray-500">${prop.podlazi}. patro</td>
            <td class="font-bold text-textDefault">${prop.dispozice}</td>
            <td class="text-gray-500 hidden md:table-cell">${prop.orientace}</td>
            <td class="text-gray-500">${prop.plocha}</td>
            <td class="text-gray-500 hidden sm:table-cell">${prop.balkon}</td>
            <td class="text-primary font-bold whitespace-nowrap">${prop.cena}</td>
            <td>
                <span class="inline-flex items-center gap-1.5 text-success font-medium text-sm">
                    <span class="w-2 h-2 rounded-full bg-success inline-block flex-shrink-0"></span>
                    Volný
                </span>
            </td>
            <td class="text-right">
                <button class="w-10 h-10 rounded-md border border-gray-200 hover:border-primary hover:bg-primary hover:text-white text-gray-400 inline-flex items-center justify-center transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function openModal(id) {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    currentPropId = id;
    currentImageIndex = 0;

    document.getElementById('modal-title').textContent = `Byt č. ${prop.id} — ${prop.dispozice}`;
    document.getElementById('modal-cena').textContent = prop.cena;
    document.getElementById('modal-dispozice').textContent = prop.dispozice;
    document.getElementById('modal-plocha').textContent = prop.plocha;
    document.getElementById('modal-podlazi').textContent = `${prop.podlazi}. patro`;
    document.getElementById('modal-orientace').textContent = prop.orientace;
    document.getElementById('modal-balkon').textContent = prop.balkon;
    document.getElementById('modal-popis').textContent = prop.popis;

    // Render image gallery
    renderModalGallery(prop);

    document.getElementById('modal-interested-btn').onclick = () => {
        closeModal();
        setTimeout(() => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('messageInput').value = `Dobrý den, mám zájem o byt č. ${prop.id} (${prop.dispozice}, ${prop.plocha}, ${prop.cena}). Prosím o více informací a případné sjednání prohlídky.`;
        }, 300);
    };

    const modal = document.getElementById('property-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Close when clicking the backdrop (outside the white panel)
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    setTimeout(() => {
        modal.classList.add('modal-visible');
    }, 10);
}

function renderModalGallery(prop) {
    const main = document.getElementById('modal-main-image');
    const thumbs = document.getElementById('modal-thumbs');
    
    main.src = prop.images[currentImageIndex] || '';
    
    thumbs.innerHTML = prop.images.map((img, i) => `
        <button onclick="switchImage(${i})" class="w-20 h-14 rounded overflow-hidden border-2 transition-colors ${i === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'}">
            <img src="${img}" class="w-full h-full object-cover">
        </button>
    `).join('');
}

function switchImage(index) {
    const prop = properties.find(p => p.id === currentPropId);
    if (!prop) return;
    currentImageIndex = index;
    document.getElementById('modal-main-image').src = prop.images[index];
    // Refresh thumbs to update active state
    renderModalGallery(prop);
}

function closeModal() {
    const modal = document.getElementById('property-modal');
    modal.classList.remove('modal-visible');
    document.body.style.overflow = '';
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Scroll Progress Bar ──────────────────────────────────────────
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (window.scrollY / max * 100) + '%';
    }, { passive: true });
}

// ── Section Dots ─────────────────────────────────────────────────
function initSectionDots() {
    const SECTIONS = ['hero', 'projekt', 'byty', 'harmonogram', 'contact'];
    const dots = document.querySelectorAll('#section-dots button');

    // Click → scroll to section
    dots.forEach(btn => {
        btn.addEventListener('click', () => {
            const sec = btn.dataset.section;
            const el = sec === 'hero'
                ? document.querySelector('header')
                : document.getElementById(sec);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active dot on scroll
    const sectionEls = SECTIONS.map(id =>
        id === 'hero' ? document.querySelector('header') : document.getElementById(id)
    );
    const updateDots = () => {
        const mid = window.scrollY + window.innerHeight * 0.4;
        let current = 0;
        sectionEls.forEach((el, i) => {
            if (el && el.offsetTop <= mid) current = i;
        });
        dots.forEach((btn, i) => btn.classList.toggle('active', i === current));
    };
    window.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
}

// ── Navbar Scroll Effect ─────────────────────────────────────────
function initNavbar() {
    const nav = document.getElementById('navbar');
    const logoImg = document.querySelector('.logo-img');
    const navLinks = document.querySelector('.nav-links');

    const setScrolled = (scrolled) => {
        if (scrolled) {
            nav.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100');
            nav.classList.add('scrolled');
            if (logoImg) logoImg.style.filter = 'none';
            if (navLinks) { navLinks.classList.remove('text-white/90'); navLinks.classList.add('text-gray-700'); }
        } else {
            nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-100', 'scrolled');
            if (logoImg) logoImg.style.filter = 'brightness(0) invert(1)';
            if (navLinks) { navLinks.classList.add('text-white/90'); navLinks.classList.remove('text-gray-700'); }
        }
    };

    window.addEventListener('scroll', () => setScrolled(window.scrollY > 80), { passive: true });
    setScrolled(window.scrollY > 80);
}

// ── Parallax Hero ────────────────────────────────────────────────
function initParallax() {
    const heroImg = document.getElementById('hero-bg');
    if (!heroImg) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    }, { passive: true });
}

// ── Fix "Načtečí" dot label ───────────────────────────────────────
function fixDotLabels() {
    const hero = document.querySelector('#section-dots button[data-label="Načtečí"]');
    if (hero) hero.setAttribute('data-label', 'Nahoru');
}

document.addEventListener('DOMContentLoaded', () => {
    renderProperties();
    setTimeout(initScrollAnimations, 100);
    initScrollProgress();
    initSectionDots();
    initNavbar();
    initParallax();
    fixDotLabels();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});

