var scrollBox;
var boxes;
var inlineValue = 'nearest', blockValue = 'nearest';
var positionOption;
var targetId;
var targetElement;
var prevElement;
var statusBox;
let observer;

// number of boxes
var numBoxes = 18;
var display = 'block';
var behavior;
var scrollBarFlag = false;

var lastX, lastY;

document.getElementById('selectElement').addEventListener('change', function(){
	getTargetElement();
});

function init() {
	boxlist = document.querySelectorAll(".boxes");

	/* This custom threshold invokes the handler whenever:
	   1. The target begins entering the viewport (0 < ratio < 1).
	   2. The target fully enters the viewport (ratio >= 1).
	   3. The target begins leaving the viewport (1 > ratio > 0).
	   4. The target fully leaves the viewport (ratio <= 0).
   */
	var options = {
		root: document.querySelector('content'),
		rootMargin: '0px',
		threshold: [0, 1]
	}

	observer = new IntersectionObserver(handler, options);

	getTargetElement();

	statusBox = document.getElementById('statusBox');
}

function handler(entries, observer) {
  for (entry of entries) {
    document.getElementById('ratio').textContent = entry.intersectionRatio;
		document.getElementById('rect').textContent = entry.intersectionRect;
		document.getElementById('is').textContent = entry.isIntersecting;

		console.log(entry.intersectionRect);

    if (entry.intersectionRatio >= 1) {
     statusBox.className = 'yes';
     document.getElementById('statusText').textContent = ' entirely in the view ';
    } else if (entry.intersectionRatio <= 0) {
      statusBox.className = 'no';
      document.getElementById('statusText').textContent = ' entirely hidden ';
    } else {
      statusBox.className = 'partial';
      document.getElementById('statusText').textContent = ' partialy hidden ';
    }
  }
}

function getTargetElement() {
	if (targetId){
		prevElement = document.getElementById(targetId);
		targetElement.setAttribute('class', 'box');
	}

	targetId = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
	targetElement = document.getElementById(targetId);
	targetElement.setAttribute('class', 'targetBox');
	document.getElementById('idText').textContent = targetId;

	observer.observe(targetElement);
}

window.onload = init;
