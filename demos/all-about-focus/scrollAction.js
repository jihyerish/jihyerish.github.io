var scrollBox;
var boxes;
var selectedBox;

// number of boxes
var numBoxes = 18;
var method = 'focus';
var display = 'block';
var inlineValue = 'nearest';
var blockValue = 'start';
var behavior;

document.getElementById('displayType').addEventListener('change', function(){
	display = document.getElementById('displayType').options[document.getElementById('displayType').selectedIndex].value;
	
	if(display == 'block') {
		document.getElementById('inlinePositionOptions').style.display='none';
		document.getElementById('blockPositionOptions').style.display='inline';
		
		scrollBox.setAttribute('class', 'block-scrollBox');
		   
		for(var i=0; i < boxes.length; i++){
		  boxes[i].style.display='block';
		  boxes[i].style.margin='1em auto';
		}
	}
	else {
	   document.getElementById('inlinePositionOptions').style.display='inline';
	   document.getElementById('blockPositionOptions').style.display='none';
	   
	   scrollBox.setAttribute('class', 'inline-scrollBox');
	   
	   for(var i=0; i < boxes.length; i++){
		   boxes[i].style.display='inline-block';
		   boxes[i].style.margin='auto 1em';
	   }
	}
});

document.getElementById('functionType').addEventListener('change', function(){
	method = document.getElementById('functionType').options[document.getElementById('functionType').selectedIndex].value;
	
	if(method == 'focus') {
		document.getElementById('scrollIntoViewOptions').style.display='none';
	}
	else {
      document.getElementById('scrollIntoViewOptions').style.display='inline';
    }
});

document.getElementById('manual').addEventListener('click', function() {
	getOptions();
	
  	if(method == 'scrollIntoView'){
		document.getElementById(selectedBox).scrollIntoView({
        behavior: behavior,
        inline: inlineValue,
        block: blockValue
      });
	}
	else {
		document.getElementById(selectedBox).focus();
	}
});

function init() {
	boxes = new Array();
	scrollBox = document.querySelector('#scrollBox');
	scrollBox.setAttribute('class', 'block-scrollBox');
		
	for(var i=0; i < numBoxes; i++){
		boxes.push(document.createElement('div'));
		boxes[i].appendChild(document.createTextNode(i+1));
		boxes[i].setAttribute('class', 'box');
		boxes[i].setAttribute('id', i+1);
		boxes[i].setAttribute('tabindex', 1);
		boxes[i].style.display='block';
		scrollBox.appendChild(boxes[i]);
	}
	
	console.log('box num: '+boxes.length);
	
	getOptions();
}

function getOptions() {
	method = document.getElementById('functionType').options[document.getElementById('functionType').selectedIndex].value;
	display = document.getElementById('displayType').options[document.getElementById('displayType').selectedIndex].value;
	
	console.log('display: '+ display + ', fuction: ' + method);
	
	if(method == 'scrollIntoView'){
		behavior = document.getElementById('behavior').options[document.getElementById('behavior').selectedIndex].value;
		inlineValue = document.getElementById('inlinePosition').options[document.getElementById('inlinePosition').selectedIndex].value;
		blockValue = document.getElementById('blockPosition').options[document.getElementById('blockPosition').selectedIndex].value;

		console.log('block: '+ blockValue + ', inline: '+ inlineValue);
	}
	else {
		console.log('block: '+ blockValue + ', inline: '+ inlineValue);
	}

	selectedBox = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
	
	console.log('Id of the selected element: '+ selectedBox);
}

window.onload = init;
