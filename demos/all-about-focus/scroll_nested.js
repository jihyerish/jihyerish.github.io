/* eslint-disable no-tabs */
(function () {

	let scrollBox;
	let boxes;
	let selectedBox;

	// number of boxes
	let numBoxes = 18;
	let method = 'focus';
	let inlineValue = 'nearest';
	let blockValue = 'start';
	let behavior;

	const displayOption = document.getElementById('displayType');
	const functionOption = document.getElementById('functionType');
	const preventScroll = document.getElementById('preventScroll');

	if (displayOption) {
		document.getElementById('displayType').addEventListener('change', () => {
			if (displayOption && (displayOption.value === 'inline')) {
				document.getElementById('inlinePositionOptions').style.display = 'inline';
				document.getElementById('blockPositionOptions').style.display = 'none';

				scrollBox.setAttribute('class', 'inline-scrollBox');

				for(let i = 0; i < boxes.length; i++) {
					boxes[i].style.display = 'inline-block';
					boxes[i].style.margin = 'auto 1em';
				}

			}
			else {
				document.getElementById('inlinePositionOptions').style.display = 'none';
				document.getElementById('blockPositionOptions').style.display = 'inline';

				scrollBox.setAttribute('class', 'block-scrollBox');

				for(let i = 0; i < boxes.length; i++) {
					boxes[i].style.display = 'block';
					boxes[i].style.margin = '1em auto';
				}
			}
		});
	}

	if (functionOption) {
		functionOption.addEventListener('change', () => {
			if(functionOption.value === 'focus') {
				document.getElementById('scrollIntoViewOptions').style.display = 'none';
			}
			else {
				document.getElementById('scrollIntoViewOptions').style.display = 'inline';
			}
		});
	}

	document.getElementById('manual').addEventListener('click', () => {
		getOptions();

		if(method === 'scrollIntoView') {
			document.getElementById(selectedBox).scrollIntoView({
				behavior,
				inline: inlineValue,
				block: blockValue
			});
		}
		else {
			if (preventScroll.checked)
				document.getElementById(selectedBox).focus({preventScroll: true});
			else
				document.getElementById(selectedBox).focus({preventScroll: false});
		}
	});

	function init() {
		boxes = [];
		scrollBox = document.querySelector('#scrollBox');
		scrollBox.setAttribute('class', 'block-scrollBox');
		getOptions();
	}

	function getOptions() {
		if (functionOption)
			method = document.getElementById('functionType').value;

		if(method === 'scrollIntoView') {
			behavior = document.getElementById('behavior').value;
			inlineValue = document.getElementById('inlinePosition').value;
			blockValue = document.getElementById('blockPosition').value;
		}
		selectedBox = document.getElementById('selectElement').value;
	}

	window.addEventListener('load', () => {	init(); });

})();
