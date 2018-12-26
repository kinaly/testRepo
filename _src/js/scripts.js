// custom scripts here
const env = nunjucks.configure('/views', {
    autoescape: true
});






// Utilities
// /////////

// Create a HTML tag (tag) with class (tagClass) with some content (tagContent)
function addMarkup(tag,tagClass,tagContent) {
	let markup = document.createElement(tag);

	if (tagClass != null) {
		markup.className = tagClass;
	}

	if (tagContent != null) {
		markup.innerHTML = tagContent;
	}

	return markup;
}



// Create an array of color following a gradient from colour 1 to colour 2
function newChromaScale(color01,color02,colorSteps, mode) {
	var colorDomain = mode ? mode : 'lab';
  var colorScale = chroma.scale([color01, color02]).mode(colorDomain).colors(colorSteps);
  return colorScale;
}



// Get the contrast ratio between 2 colours rounded at 2 decimals
function getContrast(color01, color02) {
	var contrast = Math.floor(chroma.contrast(color01, color02) * 100) / 100;
	return contrast;
}



// Create a swatch object with details I may use in templates
function getSwatchDetails(colour) {
	var hslHue = Math.floor(chroma(colour).get('hsl.h'));
	var hslSaturation = Math.floor(chroma(colour).get('hsl.s') * 100);
	var hslLuminosity = Math.floor(chroma(colour).get('hsl.l') * 100);

	var hsvHue = Math.floor(chroma(colour).get('hsv.h'));
	var hsvSaturation = Math.floor(chroma(colour).get('hsv.s') * 100);
	var hsvValue = Math.floor(chroma(colour).get('hsv.v') * 100);

	var swatchDetails = {
		'display': {
			'hex': chroma(colour).hex(),
			'hsl': 'hsl(' + hslHue.toString() + ',' + hslSaturation.toString() + '%,' + hslLuminosity.toString() + '%)',
			'hsv': 'hsv(' + hsvHue.toString() + ',' + hsvSaturation.toString() + ',' + hsvValue.toString() + ')',
			'rgb': chroma(colour).css()
		},
		'hslHue': chroma(colour).get('hsl.h'),
		'hslSaturation': chroma(colour).get('hsl.s') * 100,
		'hslLuminosity': chroma(colour).get('hsl.l') * 100,
		'contrastToWhite': getContrast(colour, '#ffffff')
	};

	return swatchDetails;
}



// Create an array for a colour scale
function colourScaleArray(colour) {
	var colourScale = [];
	
	var colourLuminosity = getSwatchDetails(colour).hslLuminosity;

	var lightStep = (100 - colourLuminosity) / 5;
	var darkStep = colourLuminosity / 5;

	var lightScale = newChromaScale(colour, '#ffffff', 6);
	var darkScale = newChromaScale(colour, '#000000', 6);

	for (var i = 4 - 1; i >= 0; i--) {
		var lum = colourLuminosity + (i+1) * lightStep;
		var col1 = chroma(colour).set('hsl.l', lum/100);
		var col2 = lightScale[i+1];

		var col = chroma.mix(col1, col2, 0.2, 'hsl');

		colourScale.push(col);
	}

	colourScale.push(chroma(colour));

	for (var i = 0; i < 4; i++) {
		var lum = colourLuminosity - (i+1) * darkStep;
		var col1 = chroma(colour).set('hsl.l', lum/100);
		var col2 = darkScale[i+1];

		var col = chroma.mix(col1, col2, 0.2, 'hsl');
		colourScale.push(col);
	}

	return colourScale;
}






// Drawer functions
// ////////////////

// To add event to a drawer trigger
function addDrawerEvent(elem) {
	elem.addEventListener(
		'click',
		function(e) {
			event.preventDefault();

			var drawer = document.querySelector(event.target.hash);
			if (!drawer) return;

			toggleDrawer(drawer, this);
		},
	false);
}


// Toggle drawer and insert content
function toggleDrawer(drawer, trigger) {
	if (drawer.classList.contains('-is-open')) {
		closeDrawer(drawer);
		return;
	}

	openDrawer(drawer);
}

function openDrawer(drawer) {
	drawer.classList.add('-is-open');
}

function closeDrawer(drawer) {
	drawer.classList.remove('-is-open');
}






// Layout functions
// ////////////////

// Insert a swatch based on swatch.html
function insertSwatch(swatchDetails, container) {
	let swatchTemplate = env.render('swatch.html', { swatch: swatchDetails }),
			swatch = addMarkup('div', 'swatch', swatchTemplate);

	if (swatchDetails.contrastToWhite > 4.54) {
		swatch.classList.add('-reverse');
	}

	if (swatchDetails.contrastToWhite > 4.54 && swatchDetails.contrastToWhite < 4.66) {
		swatch.classList.add('-highlight');
	}

	container.appendChild(swatch);

	return swatch;
}



// insert a radio swatch
function insertRadioSwatch(colour, name) {
	let gradientSteps = colourScaleArray(colour);
	let gradientString = 'linear-gradient(to right,';

	for (var i = 0; i < gradientSteps.length; i++) {
		gradientString = gradientString + chroma(gradientSteps[i]).hex() + ' ' + (i+1) * 10 + '%,';
	}

	gradientString = gradientString + '#000)';

	let swatchInfo = getSwatchDetails(colour);
	swatchInfo['radioName'] = name;
	swatchInfo['cssGradient'] = gradientString;

	let radioSwatchTemplate = env.render('swatch-radio.html', {swatch: swatchInfo});

	return radioSwatchTemplate;
}



// insert a colour card
function insertColourCard(bgColour, textColour) {
	let colourCardInfo = {
		'bgColour': bgColour,
		'textColour': textColour,
		'contrastRatio': getContrast(bgColour, textColour),
		'additionalClasses': getContrast(bgColour, textColour) < 4.5 ? '-optional' : ''
	}

	let colourCardTemplate = env.render('colour-card.html', {colourCard: colourCardInfo});

	return colourCardTemplate;
}



// display a custom hue scale
function displayScaleIn(parent, colour) {
	parent.innerHTML = '';

	var scale = colourScaleArray(colour);

	for (var i = 0; i < scale.length; i++) {
		var swatch = insertSwatch(getSwatchDetails(scale[i]), parent);
		swatch.classList.add('colour-scale__swatch');

		if (i == 4) {
			swatch.classList.add('-main');
		}
	}

	parent.dataset.colour = colour;
	parent.style.backgroundColor = colorInputs[0].value;

	var remove = addMarkup('div', 'colour-scale__remove', 'x');
	parent.appendChild(remove);

	// a bit brittle as it relies on HTML structure
	remove.addEventListener('click', function(e) {
		var el = this.parentNode;
		el.parentNode.removeChild(el);
	});
}



// display a hue matrix based on a range of contrast ratio between 2 colours
function displayHueMatrixIn(parent, mainColour, secondaryColour, contrastRange) {

	var hue = isNaN(getSwatchDetails(mainColour).hslHue) ? 0 : getSwatchDetails(mainColour).hslHue;
	
	var saturation = getSwatchDetails(mainColour).hslSaturation;
	var saturationRange = [saturation - 5, saturation + 10 <= 100 ? saturation + 10 : 100];


	var currentRow = [];

	parent.innerHTML = '';

	for (var lum = 0; lum < 100; lum++) {
		for (var sat = saturationRange[0]; sat < saturationRange[1]; sat++) {
			var col = 'hsl(' + hue + ',' + sat + '%,' + lum +'%)';
			currentRow.push(getSwatchDetails(col));
			
		}


		var match = currentRow.filter(function(item) {
			var contrast = getContrast(item.display.hex, secondaryColour);
			return contrast > contrastRange[0] && contrast < contrastRange[1];
		});

		if (match.length > 0) {
			for (var i = 0; i < currentRow.length; i++) {
				var swatch = insertSwatch(currentRow[i], parent);

				var constrastScore = swatch.querySelectorAll('.swatch__contrast')[0];
				constrastScore.innerHTML = getContrast(currentRow[i].display.hex, colorInputs[1].value);

				swatch.classList.add('hue-matrix__swatch');
				swatch.style.width = (100 / (saturationRange[1] - saturationRange[0])) + '%';
				swatch.dataset.hex = currentRow[i].display.hex;

				// should probably be in a function
				swatch.addEventListener('click', function(e) {
					var scale = addMarkup('div', 'colour-scale', null);
					if (colourScalesBox.childNodes.length > 0) {
						colourScalesBox.insertBefore(scale, colourScalesBox.childNodes[0]);
					} else {
						colourScalesBox.appendChild(scale);
					}
					displayScaleIn(scale, this.dataset.hex);
				});
			}
		}

		currentRow = [];
	}
}



// set the contrast score between both inputs
// could totally be more re-usable
function setInputsContrast() {
	var contrast = getContrast(colorInputs[0].value, colorInputs[1].value);
	inputsContrast.innerHTML = contrast;

	if (contrast > 4.6) {
		inputsContrast.classList.add('-reverse');
	} else {
		inputsContrast.classList.remove('-reverse');
	}
}



// set up the colour switches in cards drawer
function setupColourSwitch() {
	var scales = colourScalesBox.childNodes;

	var colours = []

	var bgSwitch = cardsPage.querySelector('.colour-cards__bg-switch');
	var colourSwitch = cardsPage.querySelector('.colour-cards__colour-switch');

	for (var i = 0; i < scales.length; i++) {
		var colourArray = colourScaleArray(scales[i].dataset.colour);

		colours.push(colourArray);
	}


	bgSwitch.innerHTML = '';
	colourSwitch.innerHTML = '';

	for (var i = 0; i < colours.length; i++) {
		var radioSwatchBg = insertRadioSwatch(colours[i][4], 'bgCards');
		var radioSwatchColour = insertRadioSwatch(colours[i][4], 'colourCards');
		bgSwitch.innerHTML = bgSwitch.innerHTML + radioSwatchBg;
		colourSwitch.innerHTML = colourSwitch.innerHTML + radioSwatchColour;
	}
	var textSwatch = colourSwitch.querySelectorAll('.swatch-radio');
	for (var i = 0; i < textSwatch.length; i++) {
		textSwatch[i].classList.add('-clip-text');
	}

	bgSwitch.querySelector('.swatch-radio__input').checked = true;
	colourSwitch.querySelector('.swatch-radio__input').checked = true;

	var inputs = cardsPage.querySelectorAll('.swatch-radio__input');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', function(e) {
			setupCards();
		});
	}
}



// set up the cards
function setupCards() {
	var box = cardsPage.querySelector('.colour-cards__box');
	box.innerHTML = '';

	var inputs = [].slice.call(cardsPage.querySelectorAll('.swatch-radio__input'));
	var checked = inputs.filter(function(input) {
		return input.checked == true;
	});

	var coloursArray = [];

	for (var i = 0; i < checked.length; i++) {
		coloursArray.push(colourScaleArray(checked[i].dataset.colour));
	}

	var cs = coloursArray[0];
	var bgs = coloursArray[1];

	bgs.push(chroma('#000000'));
	cs.push(chroma('#000000'));

	bgs.splice(0, 0, chroma('#ffffff'));
	cs.splice(0, 0, chroma('#ffffff'));
	
	for (var i = 0; i < bgs.length; i++) {
		for (var j = 0; j < cs.length; j++) {
			var currentBg = getSwatchDetails(bgs[i]).display.hex;
			var currentColor = getSwatchDetails(cs[j]).display.hex;
			
			if (currentBg !== currentColor) {
				var card = insertColourCard(bgs[i], cs[j]);
				box.innerHTML = box.innerHTML + card;
			}
		}
	}
}






// Initialise stuff
// ////////////////
var colorInputs = document.querySelectorAll('.color-input');
var hueMatrixes = document.querySelectorAll('.hue-matrix');
var coloredContainer = document.querySelectorAll('.colour-study')[0];
var colourScalesBox = document.querySelectorAll('.colour-scales')[0];
var inputsContrast = document.querySelectorAll('.inputs-contrast-score')[0];
var drawerTriggers = document.querySelectorAll('.js-toggle-drawer');
var cardsTrigger = document.querySelectorAll('.js-set-cards')[0];
var cardsPage = document.getElementById('cards-drawer');



displayHueMatrixIn(hueMatrixes[0], colorInputs[0].value, colorInputs[1].value, [4.2,5.2]);

coloredContainer.style.backgroundColor = colorInputs[0].value;

setInputsContrast();




// drawer events
for (var i = 0; i < drawerTriggers.length; i++) {
	addDrawerEvent(drawerTriggers[i]);
}

// Input colour event
for (var i = 0; i < colorInputs.length; i++) {
	colorInputs[i].addEventListener('change', function(e) {
		if (chroma.valid(this.value)) {
			coloredContainer.style.backgroundColor = colorInputs[0].value;

			displayHueMatrixIn(hueMatrixes[0], colorInputs[0].value, colorInputs[1].value, [4.2,5.2]);

			setInputsContrast();

		}
	});
};

// generate cards event
cardsTrigger.addEventListener('click', function(e) {
	setupColourSwitch();
	setupCards();
});
