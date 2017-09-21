var method;
var behavior;
var direction;
var position;
var selectedBox;


document.getElementById('function').addEventListener('change', function(){
	method = document.getElementById('function').options[document.getElementById('function').selectedIndex].value;
	
	if(method != "scrollIntoView") {		
		document.getElementById('scrollIntoViewOptions').style.visibility = "hidden";
	}
});

document.getElementById('manual').addEventListener('click', function() {
  getOptions();
	
	if(method == "scrollIntoView"){
		document.getElementById(selectedBox).scrollIntoView({
        behavior: behavior,
        direction: position
      });
	}
	else {
		document.getElementById(selectedBox).focus();
	}
});

function getOptions() {
	
	if(method == "scrollIntoView"){
		behavior = document.getElementById('behavior').options[document.getElementById('behavior').selectedIndex].value;
		direction = document.getElementById('flowDirection').options[document.getElementById('flowDirection').selectedIndex].value;
		position = document.getElementById('logicalPosition').options[document.getElementById('logicalPosition').selectedIndex].value;
	}
	
	selectedBox = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
}