let scrollBox;
let boxes;
let inlineValue = 'nearest', blockValue = 'nearest';
let positionOption;
let targetId = "1";
let targetElement;
let prevElement;
let statusBox;
let observer;

// number of boxes
const numBoxes = 18;
let display = 'block';
let behavior;
let scrollBarFlag = false;

var lastX, lastY;

document.getElementById('selectElement').addEventListener('change', function(){
	getTargetElement();
});

const init = () => {
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
		boxes[i].style.margin='1em auto';
		scrollBox.appendChild(boxes[i]);
	}

	getTargetElement();

	scrollBox.addEventListener('scroll', function(event){
		console.log('scrolling : x: '+ this.scrollLeft+ ', y: '+this.scrollTop);

		if (!scrollBarFlag){
			if (positionOption == 'none' && statusBox.className == 'partial'){
				scrollBox.scrollTo(lastX, lastY);
				console.log('prevent scroll');
			}
		}

	});

	statusBox = document.getElementById('statusBox');

	const observer = new IntersectionObserver((entries) => {
		event.innerHTML = '';
		entries
			.filter(entry => entry.isIntersecting)
			.forEach(entry => document.getElementById('ratio').textContent = (entry.target.id + ': ' + entry.intersectionRatio));
	}, {
		root: scrollBox,
		threshold: new Array(101).fill(0).map((zero, index) => {
			return index * 0.01;
		})
	});

	
}



/* This custom threshold invokes the handler whenever:
	   1. The target begins entering the viewport (0 < ratio < 1).
	   2. The target fully enters the viewport (ratio >= 1).
	   3. The target begins leaving the viewport (1 > ratio > 0).
	   4. The target fully leaves the viewport (ratio <= 0).
  
	observer = new IntersectionObserver(handler, {
	  threshold: [0, 1]
	});


function handler(entries, observer) {
  for (entry of entries) {
    let intersectionRatio = entry.intersectionRatio;

    document.getElementById('ratio').textContent = intersectionRatio;

    if (intersectionRatio >= 1) {
     statusBox.className = 'yes';
     document.getElementById('statusText').textContent = ' entirely in the view ';
    } else if (intersectionRatio <= 0) {
      statusBox.className = 'no';
      document.getElementById('statusText').textContent = ' entirely hidden ';
    } else {
      statusBox.className = 'partial';
      document.getElementById('statusText').textContent = ' partialy hidden ';
    }
  }
} */

window.addEventListener("load", function() {
  init();
});
