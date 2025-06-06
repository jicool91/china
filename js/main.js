console.log('MandarinWays loaded');

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// уменьшение шапки при прокрутке
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

// появление секций при скролле
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-section').forEach(sec => observer.observe(sec));

// переключатель темы
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// загрузка маршрутов и фильтры
const routesContainer = document.getElementById('routes-container');
let routesData = [];
if (routesContainer) {
    fetch('data/routes.json')
        .then(r => r.json())
        .then(data => {
            routesData = data;
            renderRoutes(data);
        });

    const typeF = document.getElementById('type-filter');
    const daysF = document.getElementById('days-filter');
    const priceF = document.getElementById('price-filter');

    document.getElementById('filters').addEventListener('change', () => {
        const filtered = routesData.filter(r => {
            return (!typeF.value || r.type === typeF.value) &&
                   (!daysF.value || r.days == daysF.value) &&
                   (!priceF.value || r.price <= +priceF.value);
        });
        renderRoutes(filtered);
    });
}

function renderRoutes(data) {
    routesContainer.innerHTML = '';
    data.forEach(r => {
        const art = document.createElement('article');
        art.innerHTML = `
            <img src="${r.image}" alt="${r.title}" loading="lazy">
            <h3>${r.title}</h3>
            <p>${r.description}</p>
            <p class="details">Цена: от ${r.price}$ · ${r.days} дн. · Лучший сезон: ${r.season}</p>
        `;
        routesContainer.appendChild(art);
    });
}

// отзывы
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('review-name').value.trim();
        const text = document.getElementById('review-text').value.trim();
        const rating = document.getElementById('review-rating').value;
        if (!name || !text) return;
        const art = document.createElement('article');
        art.className = 'review';
        art.innerHTML = `<p>"${text}" — ${name}, рейтинг ${rating}/5</p>`;
        reviewForm.before(art);
        reviewForm.reset();
    });
}

// переключение языка
const translations = {
    en: {
        menu: ['About', 'Features', 'Goal', 'Routes', 'Places', 'Reviews', 'FAQ', 'Status'],
        heroTitle: 'Travel China on your own',
        heroText: 'Beautiful itineraries for the perfect holiday'
    },
    zh: {
        menu: ['关于', '特色', '目标', '路线', '地点', '评价', 'FAQ', '状态'],
        heroTitle: '自助游中国',
        heroText: '为完美假期准备的精彩行程'
    },
    ru: {
        menu: ['О проекте', 'Особенности', 'Цель', 'Маршруты', 'Места', 'Отзывы', 'FAQ', 'Статус'],
        heroTitle: 'Путешествуйте по Китаю самостоятельно',
        heroText: 'Красивые и продуманные маршруты для вашего идеального отпуска'
    }
};
const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
    let current = localStorage.getItem('lang') || 'ru';
    applyLang(current);
    langBtn.addEventListener('click', () => {
        current = current === 'ru' ? 'en' : current === 'en' ? 'zh' : 'ru';
        applyLang(current);
        localStorage.setItem('lang', current);
    });
}

function applyLang(lang) {
    const t = translations[lang];
    const menuItems = document.querySelectorAll('.menu li a');
    menuItems.forEach((a, i) => {
        a.textContent = t.menu[i];
    });
    document.querySelector('.hero h2').textContent = t.heroTitle;
    document.querySelector('.hero p').textContent = t.heroText;
    if (lang === 'ru') {
        langBtn.textContent = 'EN';
    } else if (lang === 'en') {
        langBtn.textContent = '中文';
    } else {
        langBtn.textContent = 'RU';
    }
}
