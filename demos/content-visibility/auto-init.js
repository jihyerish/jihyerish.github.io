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
    newDiv.className = 'solidColor';
    // newDiv.style.background = getRandomColor();
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

  elements = document.querySelectorAll(".solidColor");

  for (let element of elements) {
    element.classList.add("auto");
  }

}

window.onload = init;
