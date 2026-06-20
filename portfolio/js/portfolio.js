(() => {
  const toggle = document.querySelector('.language-toggle');
  const labels = [...document.querySelectorAll('[data-en][data-ko]')];
  const html = document.documentElement;
  const setLanguage = (language) => {
    html.lang = language === 'ko' ? 'ko' : 'en';
    labels.forEach((element) => { element.innerHTML = element.dataset[language]; });
    toggle.setAttribute('aria-label', language === 'ko' ? '언어를 영어로 변경' : 'Switch language to Korean');
    toggle.querySelector('span:first-child').style.color = language === 'ko' ? 'var(--plum)' : 'var(--muted)';
    toggle.querySelector('span:last-child').style.color = language === 'en' ? 'var(--plum)' : 'var(--muted)';
    localStorage.setItem('portfolio-language', language);
  };
  setLanguage(localStorage.getItem('portfolio-language') || 'ko');
  toggle.addEventListener('click', () => setLanguage(html.lang === 'en' ? 'ko' : 'en'));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
