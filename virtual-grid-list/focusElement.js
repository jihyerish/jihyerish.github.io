var selectedBox;
var anchorScrollTop;
var lastX, lastY;

var option = document.querySelector('input[value="noscroll"]');

for (var i=0; i < document.querySelectorAll('.box').length; i++){
  document.querySelectorAll('.box')[i].style.backgroundColor = "#"+ getRandomInt(0, 999) ;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function selectBox(element) {
  if (!element.classList.contains('box'))
    return;
  if (selectedBox)
    selectedBox.classList.remove('selected');

  selectedBox = element;
  selectedBox.classList.add('selected');
}

document.getElementById('scroller').addEventListener('focusin', function(e) {
  selectBox(e.target);
});

document.getElementById('scroller').addEventListener('mouseover', function(e) {
  anchorScrollTop = document.getElementById('scroller').scrollTop;

  // Ignore synthetic mouse events that occur while focusing by keydown event
  if (lastX != e.clientX || lastY != e.clientY) {
    lastX = e.clientX;
    lastY = e.clientY;

    e.target.focus();
  }
});

document.getElementById('scroller').addEventListener('mousewheel', function(e) {
  anchorScrollTop = null;
});

document.getElementById('scroller').addEventListener('scroll', function(e) {
  if (anchorScrollTop != null && option.checked)
    document.getElementById('scroller').scrollTop = anchorScrollTop;
});

document.getElementById('scroller').onkeydown = function(evt) {
  anchorScrollTop = null;

  var focusedBox = document.getElementsByClassName('selected')[0];
  var focusableBox;

  if (evt.keyCode == 40) { // Arrow Down
    if(!focusedBox.nextElementSibling)
      return;
    else {
      if(!focusedBox.nextElementSibling.nextElementSibling)
        return;
      else {
        if(!focusedBox.nextElementSibling.nextElementSibling.nextElementSibling)
          return;
        else {
          if(!focusedBox.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling)
            return;
          else {
            focusableBox = focusedBox.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
          }
        }
      }
    }
  } else if (evt.keyCode == 37) { // Arrow Left
    focusableBox = focusedBox.previousElementSibling;
  } else if (evt.keyCode == 39) { // Arrow Right
    focusableBox = focusedBox.nextElementSibling;
  } else if (evt.keyCode == 38) { // Arrow Up
    if(!focusedBox.previousElementSibling)
      return;
    else {
      if(!focusedBox.previousElementSibling.previousElementSibling)
        return;
      else {
        if(!focusedBox.previousElementSibling.previousElementSibling.previousElementSibling)
          return;
        else {
          if(!focusedBox.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling)
            return;
          else {
            focusableBox = focusedBox.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;
          }
        }
      }
    }
  }

  if(focusableBox)
    focusableBox.focus();
  else
    return;
};