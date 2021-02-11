const headDiv = document.querySelector('.header');
const navDiv = document.querySelector('.nav');

observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio <= 0) {
      navDiv.classList.add('sticky');
    } else {
      navDiv.classList.remove('sticky');
    }
  });
});

observer.observe(headDiv);
