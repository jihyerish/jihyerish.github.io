let randomElements;
let wrapElement;

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createElement() {
    const newDiv = document.createElement('div');
    newDiv.className = 'randomColor';
    newDiv.style.background = getRandomColor();
    return newDiv;
}

function init() {
  wrapElement = document.querySelector('.wrap');
  var obj = new Array(100);
  if ('number' == typeof obj.length) {
      for (var index = 0, l = obj.length; index < l; index++) {
        var val = obj[index];
        wrapElement.appendChild(createElement());
      }
  }

  randomElements = document.querySelectorAll(".randomColor");

  for (var index = 0, l = randomElements.length; index < l; index++) {
    (index % 2 == 0) ? randomElements[index].classList.add("visible") : randomElements[index].classList.add("hidden");
  }

}

window.onload = init;
