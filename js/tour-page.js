document.addEventListener('DOMContentLoaded', () => {
  fetch('data/tourText.json')
    .then(r => r.json())
    .then(data => {
      document.getElementById('hero-title').textContent = data.heroTitle;
      document.getElementById('hero-subtitle').textContent = data.heroSubtitle;
      document.getElementById('about-text').textContent = data.aboutText;
      const faqContainer = document.getElementById('faq-container');
      data.faq.forEach(item => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = item.q;
        const p = document.createElement('p');
        p.textContent = item.a;
        details.appendChild(summary);
        details.appendChild(p);
        faqContainer.appendChild(details);
      });
    });

  const form = document.getElementById('request-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert('Заявка отправлена!');
      form.reset();
    });
  }
});
