var method = "focus";
var behavior;
var inlineValue, blockValue;
var selectedBox;


document.getElementById('function').addEventListener('change', function(){
	method = document.getElementById('function').options[document.getElementById('function').selectedIndex].value;

	if(method == "focus") {
		document.getElementById('scrollIntoViewOptions').style.display="none";
	}
	else {
    document.getElementById('scrollIntoViewOptions').style.display="inline";
  }
});

document.getElementById('manual').addEventListener('click', function() {
  getOptions();

	if(method == "scrollIntoView"){
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

function getOptions() {

	if(method == "scrollIntoView"){
		behavior = document.getElementById('behavior').options[document.getElementById('behavior').selectedIndex].value;
		inlineValue = document.getElementById('inlinePosition').options[document.getElementById('inlinePosition').selectedIndex].value;
		blockValue = document.getElementById('blockPosition').options[document.getElementById('blockPosition').selectedIndex].value;

		console.log("block: "+ blockValue + ", inline: "+ inlineValue);
	}

	selectedBox = document.getElementById('selectElement').options[document.getElementById('selectElement').selectedIndex].value;
}