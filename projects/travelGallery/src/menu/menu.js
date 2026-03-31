(function() {
  window.addEventListener('load', () => {
    document.querySelector('.menu_btn').addEventListener('click', () => {
      if (document.getElementById('menu_layout').classList.contains('menu_hide')) {
        document.getElementById('menu_layout').classList.replace('menu_hide', 'menu_show');
      } else {
        document.getElementById('menu_layout').classList.replace('menu_show', 'menu_hide');
      }
    });

    document.querySelectorAll('.menu_item').forEach((btn) => { 
      btn.addEventListener('click', (e) => {
        if (e.target.id === 'map_btn') {
          window.location = 'mapSection.html';
        } else if (e.target.id === 'info_btn') {
          window.location = 'infoSection.html';
        } else if (e.target.id === 'home_btn') {
          window.location = 'index.html';
        }
      });
    });
  });
})();
