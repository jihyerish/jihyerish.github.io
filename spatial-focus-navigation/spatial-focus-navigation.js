var boxes;
var focusedElement;
var pressedKey = false;

var keyCodes = {
  9 : "tab",
  37 : "left-arrow",
  38 : "up-arrow",
  39 : "right-arrow",
  40 : "down-arrow"
};

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
}

function getUpElement(){

  console.log("Up");
}

function getDownElement(){
  console.log("Down");
}

function getLeftElement(){

  console.log("Left");
}

function getRightElement(){
  console.log("Right");

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

  focusedElement = document.activeElement;

  getPressedKey();

  //if(!pressedKey){

  //}
}

window.onload = init;