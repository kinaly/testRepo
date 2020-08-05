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
	const colorDomain = mode ? mode : 'lab';
  const colorScale = chroma.scale([color01, color02]).mode(colorDomain).colors(colorSteps);
  return colorScale;
}



// Get an object containing the contrast ratio between 2 colours rounded at 2 decimals and the rating of the score
function getContrastScore(color01, color02) {
	const contrast = Math.floor(chroma.contrast(color01, color02) * 100) / 100;
	let rating;

	if (contrast < 3) {
		rating = '👎';
	} else if (contrast >= 3 && contrast < 4.5) {
		rating = 'AA Large';
	} else if (contrast >= 4.5 && contrast < 7) {
		rating = 'AA';
	} else {
		rating = 'AAA'
	}

	const contrastScore = {
		'score': contrast,
		'rating': rating
	}
	return contrastScore;
}



// Create a swatch object with details I may use in templates
function getSwatchDetails(colour) {
	const hslHue = Math.floor(chroma(colour).get('hsl.h'));
	const hslSaturation = Math.floor(chroma(colour).get('hsl.s') * 100);
	const hslLuminosity = Math.floor(chroma(colour).get('hsl.l') * 100);

	const hsvHue = Math.floor(chroma(colour).get('hsv.h'));
	const hsvSaturation = Math.floor(chroma(colour).get('hsv.s') * 100);
	const hsvValue = Math.floor(chroma(colour).get('hsv.v') * 100);

	const swatchDetails = {
		'display': {
			'hex': chroma(colour).hex(),
			'hsl': 'hsl(' + hslHue.toString() + ',' + hslSaturation.toString() + '%,' + hslLuminosity.toString() + '%)',
			'hsv': 'hsv(' + hsvHue.toString() + ',' + hsvSaturation.toString() + ',' + hsvValue.toString() + ')',
			'rgb': chroma(colour).css()
		},
		'hslHue': chroma(colour).get('hsl.h'),
		'hslSaturation': chroma(colour).get('hsl.s') * 100,
		'hslLuminosity': chroma(colour).get('hsl.l') * 100,
		'contrastToWhite': getContrastScore(colour, '#ffffff').score,
		'contrastToBlack': getContrastScore(colour, '#000000').score
	};

	return swatchDetails;
}



// Create an array of tones for a colour
function colourScaleArray(colour, steps) {
	const finalSteps = isNaN(steps) ? 9 : steps;
	const halfSteps = Math.floor(finalSteps / 2);
	const colourScale = [];
	
	const colourLuminosity = getSwatchDetails(colour).hslLuminosity;

	const lightStep = (100 - colourLuminosity) / (halfSteps + 1);
	const darkStep = colourLuminosity / (halfSteps + 1);

	const lightScale = newChromaScale(colour, '#ffffff', (halfSteps + 2));
	const darkScale = newChromaScale(colour, '#000000', (halfSteps + 2));

	for (let i = halfSteps - 1; i >= 0; i--) {
		const lum = colourLuminosity + (i+1) * lightStep;
		const col1 = chroma(colour).set('hsl.l', lum/100);
		const col2 = lightScale[i+1];

		const col = chroma.mix(col1, col2, 0.2, 'hsl');

		colourScale.push(col);
	}

	colourScale.push(chroma(colour));

	for (let i = 0; i < halfSteps; i++) {
		const lum = colourLuminosity - (i+1) * darkStep;
		const col1 = chroma(colour).set('hsl.l', lum/100);
		const col2 = darkScale[i+1];

		const col = chroma.mix(col1, col2, 0.2, 'hsl');
		colourScale.push(col);
	}

	return colourScale;
}



// change CSS property of an element
function changeCssProperty(el, property, value) {
	if (Array.isArray(el) || NodeList.prototype.isPrototypeOf(el)) {
		for (let i = 0; i < el.length; i++) {
			el[i].style[property] = value;
		}
	} else {
		el.style[property] = value;
	}
}






// Drawer functions
// ////////////////

// To add event to a drawer trigger
function addDrawerEvent(elem) {
	elem.addEventListener(
		'click',
		function(event) {
			event.preventDefault();

			const drawer = document.querySelector(event.target.hash);
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

	swatch.dataset.hex = swatchDetails.display.hex;

	if (swatchDetails.contrastToWhite > 4.54) {
		swatch.classList.add('-reverse');
	}

	container.appendChild(swatch);

	return swatch;
}



// insert a radio swatch
function insertRadioSwatch(colour, name) {
	let gradient = colourScaleArray(colour, 3);
	let gradientString = 'linear-gradient(to right,';

	for (var i = 0; i < gradient.length; i++) {
		if (i < gradient.length - 1) {
			gradientString = gradientString + chroma(gradient[i]).hex() + ', ';
		} else {
			gradientString = gradientString + chroma(gradient[i]).hex();
		}
	}

	gradientString = gradientString + ')';

	let swatchInfo = getSwatchDetails(colour);
	swatchInfo['radioName'] = name;
	swatchInfo['cssGradient'] = gradientString;

	let radioSwatchTemplate = env.render('swatch-radio.html', {swatch: swatchInfo});

	return radioSwatchTemplate;
}



// insert a colour card
function insertColourCard(bgColour, textColour) {
	const contrast = getContrastScore(bgColour, textColour);
	let colourCardInfo = {
		'bgColour': bgColour,
		'textColour': textColour,
		'contrastRatio': contrast.score,
		'contrastRating': contrast.rating,
		'additionalClasses': contrast.score < 3 ? '-optional' : ''
	}

	let colourCardTemplate = env.render('colour-card.html', {colourCard: colourCardInfo});

	return colourCardTemplate;
}



// display a custom hue scale
function displayScaleIn(parent, colour, steps) {
	parent.innerHTML = '';

	const scaleSteps = isNaN(colourScalesStepsInput.value) ? 9 : colourScalesStepsInput.value;

	const scale = colourScaleArray(colour, scaleSteps);

	for (let i = 0; i < scale.length; i++) {
		const swatch = insertSwatch(getSwatchDetails(scale[i]), parent);
		swatch.classList.add('colour-scale__swatch');

		if (i == Math.floor(scaleSteps/2)) {
			swatch.classList.add('-main');
		}
	}

	parent.dataset.colour = colour;

	const remove = addMarkup('div', 'colour-scale__remove', 'x');
	parent.appendChild(remove);

	// a bit brittle as it relies on HTML structure
	remove.addEventListener('click', function(e) {
		const el = this.parentNode;
		el.parentNode.removeChild(el);
		updateAddToneBtns();
	});
}



// add colour scale
function addColourScale(parent, colour, steps) {
	let currentColours =[]

	if (parent.childNodes.length > 0) {
		for (let i = 0; i < parent.childNodes.length; i++) {
			currentColours.push(chroma(parent.childNodes[i].dataset.colour).hex());
		}
	}

	// check if new colour is part of current colours
	const match = currentColours.filter(function(item) {
		return chroma(item).hex() == chroma(colour).hex();
	});

	if (match.length < 1) {
		const scale = addMarkup('div', 'colour-scale', null);

		if (parent.childNodes.length > 0) {
			parent.insertBefore(scale, parent.childNodes[0]);
		} else {
			parent.appendChild(scale);
		}
		displayScaleIn(scale, colour, steps);
	}
}



// display a hue matrix based on a range of contrast ratio between 2 colours
function displayHueMatrixIn(parent, mainColour, secondaryColour, contrastRange) {

	const colourDetails = getSwatchDetails(mainColour);

	const startingLum = colourDetails.hslLuminosity % 1;

	const hue = isNaN(colourDetails.hslHue) ? 0 : colourDetails.hslHue;
	
	const saturation = colourDetails.hslSaturation;
	const saturationRange = [saturation - 5, saturation + 10 <= 100 ? saturation + 10 : 100];


	let currentRow = [];

	parent.innerHTML = '';
	parent.style.backgroundColor = chroma(mainColour);

	for (let lum = startingLum; lum < 100; lum++) {
		for (let sat = saturationRange[0]; sat < saturationRange[1]; sat++) {
			const col = 'hsl(' + hue + ',' + sat + '%,' + lum +'%)';
			currentRow.push(getSwatchDetails(col));
			
		}


		const match = currentRow.filter(function(item) {
			const contrast = getContrastScore(item.display.hex, secondaryColour);
			return contrast.score > contrastRange[0] && contrast.score < contrastRange[1];
		});

		if (match.length > 0) {
			for (let i = 0; i < currentRow.length; i++) {
				const swatch = insertSwatch(currentRow[i], parent);

				// const contrastScoreBox = swatch.querySelectorAll('.swatch__contrast')[0];
				const contrastScore = getContrastScore(currentRow[i].display.hex, chroma('#ffffff'));
				// contrastScoreBox.innerHTML = contrastScore.score;

				if (contrastScore.score >= contrastRange[0] && contrastScore.score <= contrastRange[1]) {
					swatch.classList.add('-highlight');
				}

				swatch.classList.add('hue-matrix__swatch');
				swatch.style.width = (100 / (saturationRange[1] - saturationRange[0])) + '%';

				if (colourDetails.display.hex == currentRow[i].display.hex) {
					swatch.classList.add('-highlight');
				}

				// should probably be in a function
				swatch.addEventListener('click', function(e) {
					addColourScale(colourScalesBox[0], this.dataset.hex, colourScalesStepsInput.value);
				});
			}
		}

		currentRow = [];
	}
}



// set the contrast score between both inputs
// could totally be more re-usable
function setInputsContrast() {
	const contrast = getContrastScore(colorInputs[0].value, colorInputs[1].value);
	contrastInputs.innerHTML = contrast.score;
	contrastInputsRating.innerHTML = contrast.rating;
}



// set up the colour switches in cards drawer
function setupColourSwitch() {
	const scales = colourScalesBox[0].childNodes;

	const bgSwitch = cardsPage.querySelector('.colour-cards__bg-switch');
	const colourSwitch = cardsPage.querySelector('.colour-cards__colour-switch');
	const switches = [bgSwitch, colourSwitch];


	bgSwitch.innerHTML = '';
	colourSwitch.innerHTML = '';

	for (let i = 0; i < scales.length; i++) {
		for (let j = 0; j < switches.length; j++) {
			const inputName = (j == 0) ? 'bgCards' : 'textCards';
			
			const swatch = insertRadioSwatch(scales[i].dataset.colour, inputName);
			switches[j].innerHTML += swatch;

			if (inputName == 'textCards') {
				switches[j].childNodes[i].classList.add('-clip-text');
			}
		}		
	}

	bgSwitch.querySelector('.swatch-radio__input').checked = true;
	colourSwitch.querySelector('.swatch-radio__input').checked = true;

	const inputs = cardsPage.querySelectorAll('.swatch-radio__input');
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('change', function(e) {
			setupCardsIn(colourCardsBox);
		});
	}
}



// update colour scales when input steps change
function updateColourScales(scalesParent, inputSteps) {
	if (scalesParent.children.length > 0) {
		const adjustedSteps = (inputSteps % 2) > 0 ? parseInt(inputSteps) : parseInt(inputSteps) + 1;
		// identify first colour scale to figure out how many steps it contains
		const scaleReference = scalesParent.children[0];
		const scaleReferenceSteps = scaleReference.querySelectorAll('.swatch').length;

		let currentColours =[]

		if (scaleReferenceSteps != adjustedSteps) {
			for (let i = 0; i < scalesParent.children.length; i++) {
				currentColours.push(scalesParent.children[i].dataset.colour);
			}

			scalesParent.innerHTML = '';
			for (let i = currentColours.length - 1; i >= 0; i--) {
				addColourScale(scalesParent, currentColours[i], adjustedSteps);
			}
		}
	}
}



// set up the cards
function setupCardsIn(parent) {
	parent.innerHTML = '';

	const inputs = [].slice.call(cardsPage.querySelectorAll('.swatch-radio__input'));
	const checked = inputs.filter(function(input) {
		return input.checked == true;
	});

	let coloursArray = [];

	for (let i = 0; i < checked.length; i++) {
		coloursArray.push(colourScaleArray(checked[i].dataset.colour, parseInt(colourScalesStepsInput.value)));
	}

	const cs = coloursArray[0];
	const bgs = coloursArray[1];

	bgs.push(chroma('#000000'));
	cs.push(chroma('#000000'));

	bgs.splice(0, 0, chroma('#ffffff'));
	cs.splice(0, 0, chroma('#ffffff'));
	
	for (let i = 0; i < bgs.length; i++) {
		for (let j = 0; j < cs.length; j++) {
			const currentBg = getSwatchDetails(bgs[i]).display.hex;
			const currentColor = getSwatchDetails(cs[j]).display.hex;
			
			if (currentBg !== currentColor) {
				let card = insertColourCard(bgs[i], cs[j]);
				parent.innerHTML = parent.innerHTML + card;
			}
		}
	}
}



// update colour matrix when input changes
function updateHueMatrix() {
	const inputs = [].slice.call(matrixTypeInputs);
	const checked = inputs.filter(function(input) {
		return input.checked == true;
	});

	let otherInput = (lastInputColorChange == colorInputs[0]) ? colorInputs[1] : colorInputs[0];

	let contrastRange = [4.54,4.66];
	let secondaryColour = '#ffffff';
	let contrastBase = getContrastScore(chroma(lastInputColorChange.value), chroma(otherInput.value));

	if (checked.length == 1 && checked[0].value == 'similar') {
		contrastRange = [(contrastBase.score - .2), (contrastBase.score + .2)];
		secondaryColour = otherInput.value;
	}

	displayHueMatrixIn(hueMatrixes[0], lastInputColorChange.value, secondaryColour, contrastRange);
}



function updateAddToneBtns() {
	let currentColours =[]

	if (colourScalesBox[0].childNodes.length > 0) {
		for (let i = 0; i < colourScalesBox[0].childNodes.length; i++) {
			currentColours.push(chroma(colourScalesBox[0].childNodes[i].dataset.colour).hex());
		}
	}

	for (let i = addScaleBtns.length - 1; i >= 0; i--) {
		// check if new colour is part of current colours
		const match = currentColours.filter(function(item) {
			return chroma(item).hex() == chroma(colorInputs[i].value).hex();
		});

		if (match.length > 0) {
			addScaleBtns[i].classList.add('-disabled');
		} else {
			addScaleBtns[i].classList.remove('-disabled');
		}
	}
}






// Initialise stuff
// ////////////////
const colorInputs = document.querySelectorAll('.color-picks__input');
const hueMatrixes = document.querySelectorAll('.hue-matrix');
const bgColor01Elements = document.querySelectorAll('.bg-color-01');
const bgColor02Elements = document.querySelectorAll('.bg-color-02');
const txtColor01Elements = document.querySelectorAll('.txt-color-01');
const txtColor02Elements = document.querySelectorAll('.txt-color-02');

const colourScalesBox = document.querySelectorAll('.colour-scales');
const colourScalesStepsInput = document.querySelector('.colour-scale-steps-input');
const addScaleBtns = document.querySelectorAll('.color-picks__add-scale');
const contrastInputs = document.querySelectorAll('.inputs-contrast-score')[0];
const contrastInputsRating = document.querySelectorAll('.inputs-contrast-score-rating')[0];
const drawerTriggers = document.querySelectorAll('.js-toggle-drawer');
const cardsTrigger = document.querySelectorAll('.js-set-cards')[0];
const cardsPage = document.getElementById('cards-drawer');
const colourCardsBox = cardsPage.querySelector('.colour-cards__box');
const matrixTypeInputs = document.querySelectorAll('input[name="hue-matrix-type"]');

let lastInputColorChange = colorInputs[0];

updateHueMatrix();

changeCssProperty(bgColor01Elements, 'backgroundColor', colorInputs[0].value);
changeCssProperty(bgColor02Elements, 'backgroundColor', colorInputs[1].value);
changeCssProperty(txtColor01Elements, 'color', colorInputs[0].value);
changeCssProperty(txtColor02Elements, 'color', colorInputs[1].value);

setInputsContrast();

updateAddToneBtns();




// drawer events
for (let i = 0; i < drawerTriggers.length; i++) {
	addDrawerEvent(drawerTriggers[i]);
}

// Input colour event
for (let i = 0; i < colorInputs.length; i++) {
	colorInputs[i].addEventListener('change', function(e) {
		lastInputColorChange = this;

		if (chroma.valid(this.value)) {
			changeCssProperty(bgColor01Elements, 'backgroundColor', chroma(colorInputs[0].value).hex());
			changeCssProperty(bgColor02Elements, 'backgroundColor', chroma(colorInputs[1].value).hex());
			changeCssProperty(txtColor01Elements, 'color', chroma(colorInputs[0].value).hex());
			changeCssProperty(txtColor02Elements, 'color', chroma(colorInputs[1].value).hex());

			updateHueMatrix();

			setInputsContrast();

			updateAddToneBtns();
		}
	});

	colorInputs[i].addEventListener('focus', function(e) {
		lastInputColorChange = this;

		updateHueMatrix();
	});
};

for (let i = 0; i < matrixTypeInputs.length; i++) {
	matrixTypeInputs[i].addEventListener('change', function(e) {
		updateHueMatrix();
	});
};

for (let i = 0; i < addScaleBtns.length; i++) {
	addScaleBtns[i].addEventListener('click', function(e) {
		addColourScale(colourScalesBox[0], colorInputs[i].value, colourScalesStepsInput.value);
		updateAddToneBtns();
	});
};




// generate cards event
cardsTrigger.addEventListener('click', function(e) {
	setupColourSwitch();
	setupCardsIn(colourCardsBox);
});


colourScalesStepsInput.addEventListener('change', function(e) {
	updateColourScales(colourScalesBox[0], this.value);
});
