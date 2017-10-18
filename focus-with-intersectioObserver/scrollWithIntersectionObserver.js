var scrollBox;
var boxes;
var inlineValue = 'nearest', blockValue = 'nearest';
var target;
var statusText;
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

document.getElementById('manual').addEventListener('click', function() {
	document.getElementById(target).focus();	
	
	if (statusBox.className == "partial") {
		
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
	
	statusBox = document.getElementById("statusBox");
	statusText = document.getElementById("statusText");
}

function handler(entries, observer) {
  for (entry of entries) {
    console.log(entry);
	    
    let intersectionRatio = entry.intersectionRatio;

    statusText.textContent = intersectionRatio;

    if (intersectionRatio >= 1) {
     statusBox.className = "yes";
    } else if (intersectionRatio <= 0) {
      statusBox.className = "no";
    } else {
      statusBox.className = "partial";
    }
  }
}

function getDisplayOptions() {
	display = document.getElementById('displayType').options[document.getElementById('displayType').selectedIndex].value;
	console.log('display: '+ display);
}

function getTargetElement() {
	target = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
	document.getElementById(target).setAttribute('id', 'target');
	
	// how to remove #target when untargetted?
	
	observer.observe(document.getElementById(target));
}

function handlePartialElement() {
  var behavior = 'smooth';
		
  document.getElementById(target).scrollIntoView({
    behavior: behavior,
    inline: inlineValue,
    block: blockValue
  });
}

window.onload = init;