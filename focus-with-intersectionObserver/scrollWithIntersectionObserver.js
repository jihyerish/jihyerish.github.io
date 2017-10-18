var scrollBox;
var boxes;
var inlineValue = 'nearest', blockValue = 'nearest';
var targetId;
var targetElement;
var prevElement;
var statusBox;
let observer;

// number of boxes
var numBoxes = 18;
var display = 'block';
var behavior;

document.getElementById('displayType').addEventListener('change', function(){
	getDisplayOptions();
	
	if(display == 'block') {		
		scrollBox.setAttribute('class', 'block-scrollBox');
		   
		for(var i=0; i < boxes.length; i++){
		  boxes[i].style.display='block';
		  boxes[i].style.margin='1em auto';
		}
	}
	else {
	   scrollBox.setAttribute('class', 'inline-scrollBox');
	   
	   for(var i=0; i < boxes.length; i++){
		   boxes[i].style.display='inline-block';
		   boxes[i].style.margin='auto 1em';
	   }
	}
});

document.getElementById('selectElement').addEventListener('change', function(){
	getTargetElement();
});

document.getElementById('positionOptions').addEventListener('change', function(){
	var pOption = document.getElementById('positionOptions').options[document.getElementById('positionOptions').selectedIndex].value;
	
	console.log('position option: '+pOption);
	
	if (display == 'block')
		blockValue = pOption;
	else 
		inlineValue = pOption;
});

document.getElementById('manual').addEventListener('click', function() {
	targetElement.focus();	
	
	if (statusBox.className == 'partial') {
		handlePartialElement();
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
	
	/* This custom threshold invokes the handler whenever:
	   1. The target begins entering the viewport (0 < ratio < 1).
	   2. The target fully enters the viewport (ratio >= 1).
	   3. The target begins leaving the viewport (1 > ratio > 0).
	   4. The target fully leaves the viewport (ratio <= 0).
   */
	observer = new IntersectionObserver(handler, {
	  threshold: [0, 1]
	});
	
	getDisplayOptions();
	getTargetElement();
	
	statusBox = document.getElementById('statusBox');
}

function handler(entries, observer) {
  for (entry of entries) {	    
    let intersectionRatio = entry.intersectionRatio;

    document.getElementById('ratio').textContent = intersectionRatio;

    if (intersectionRatio >= 1) {
     statusBox.className = 'yes';
     document.getElementById('statusText').textContent = 'entirely in the view';
    } else if (intersectionRatio <= 0) {
      statusBox.className = 'no';
      document.getElementById('statusText').textContent = 'entirely out of the view';
    } else {
      statusBox.className = 'partial';
      document.getElementById('statusText').textContent = 'partialy in the view';
    }
  }
}

function getDisplayOptions() {
	display = document.getElementById('displayType').options[document.getElementById('displayType').selectedIndex].value;
	console.log('display: '+ display);
}

function getTargetElement() {
	if (targetId){
		prevElement = document.getElementById(targetId);
		targetElement.setAttribute('class', 'box');
	}	
	
	targetId = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
	targetElement = document.getElementById(targetId);
	targetElement.setAttribute('class', 'targetBox');
	
	observer.observe(targetElement);
}

function handlePartialElement() {
  console.log('Move the partialy viewed element!' + targetElement);
	
  var behavior = 'smooth';
		
  targetElement.scrollIntoView({
    behavior: behavior,
    inline: inlineValue,
    block: blockValue
  });
}

window.onload = init;