var boxes;
var focusedElement = {
  box: null,
  position: null
};

var pressedKey = false;
var targetElement;

var keyCodes = {
  9 : "tab",
  37 : "left-arrow",
  38 : "up-arrow",
  39 : "right-arrow",
  40 : "down-arrow"
};

//var day = {"sun", "mon", "tue", "wed", "thu", "fri", "sat"};

/*
var focusedElementInfo = {
  box: focusedElement,
  position: getPosition(focusedElement)
};
*/

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;

  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

function getNextFocusableElement(direction){
  if(direction == 37) {
    getLeftElement();
  } else if(direction == 38) {
    getUpElement();
  } else if(direction == 39) {
    getRightElement();
  } else if(direction == 40) {
    getDownElement()
  }

  //console.log("x: "+focusedElement.position.x+", y: "+focusedElement.position.y);
}

function getUpElement(){
  console.log("Up");
  //if Nearest Element

  //else if Projection Element


  //else if Direction Element

}

function getDownElement(){
  console.log("Down");

  //if Nearest Element

  //else if Projection Element

  //else if Direction Element
}

function getLeftElement(){
  console.log("Left");

  //if Nearest Element

  //else if Projection Element

  //else if Direction Element
}

function getRightElement(){
  console.log("Right");

  //if Nearest Element

  //else if Projection Element

  //else if Direction Element

}

/*

function getNearestElement(){

}

function getProjectionElement(){

}

function getDirectionElement(){

}
*/

function setFocus(){
  targetElement.focus();
}

function getPressedKey(){
  document.querySelector('body').onkeydown = function (e) {
    if ( !e.metaKey ) {
      e.preventDefault();
    }

    pressedKey = e.keyCode;
    getNextFocusableElement(e.keyCode);
  };
}

function init() {
  boxes = new Array();

  document.querySelector('body').onfocus = function (e) {
    focusedElement.box = document.activeElement;
    focusedElement.position = getPosition(focusedElement.box);

    console.log();
  };

  getPressedKey();
}

window.onload = init;