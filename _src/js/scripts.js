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



// display a custom hue scale
function displayCustomHueScaleIn(parent, colour) {
	var colourLuminosity = getSwatchDetails(colour).hslLuminosity;

	var lightStep = (100 - colourLuminosity) / 5;
	var darkStep = colourLuminosity / 5;

	var lightScale = newChromaScale(colour, '#ffffff', 6);
	var darkScale = newChromaScale(colour, '#000000', 6);

	parent.innerHTML = '';

	for (var i = 4 - 1; i >= 0; i--) {
		var lum = colourLuminosity + (i+1) * lightStep;
		var col1 = chroma(colour).set('hsl.l', lum/100);
		var col2 = lightScale[i+1];

		var col = chroma.mix(col1, col2, 0.2, 'hsl');

		var swatchDetails = getSwatchDetails(col);
		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}

	var mainSwatch = insertSwatch(getSwatchDetails(colour), parent);
	mainSwatch.classList.add('tone-scale__swatch');

	for (var i = 0; i < 4; i++) {
		var lum = colourLuminosity - (i+1) * darkStep;
		var col1 = chroma(colour).set('hsl.l', lum/100);
		var col2 = darkScale[i+1];

		var col = chroma.mix(col1, col2, 0.2, 'hsl');

		var swatchDetails = getSwatchDetails(col);
		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}

	parent.dataset.colour = colour;

	var remove = addMarkup('div', 'tone-scale__remove', 'x');
	parent.appendChild(remove);
}



// display a hue matrix
function displayHueMatrixIn(parent, colour, saturationSteps, luminositySteps) {

	var hue = getSwatchDetails(colour).hslHue;
	
	parent.innerHTML = '';
			
	for (var j = 1; j < (luminositySteps); j++) {
		var luminosity = 100 / luminositySteps * j;
		for (var i = 1; i < (saturationSteps + 1); i++) {
			var saturation = 100 / saturationSteps * i;
			var newColour = 'hsl(' + hue + ',' + saturation + '%,' + luminosity +'%)';
			var swatchDetails = getSwatchDetails(newColour);
			var swatch = insertSwatch(swatchDetails, parent);

			swatch.classList.add('hue-matrix__swatch');
			swatch.style.width = (100 / (saturationSteps)) + '%';
		}	
	}
}



// display a reduced hue matrix based on a range of contrast ratio between a colour based on main colour and white
function displayPartialHueMatrixIn(parent, mainColour, parameter, contrastRange) {

	var hue = getSwatchDetails(mainColour).hslHue;
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
			return item[parameter] > contrastRange[0] && item[parameter] < contrastRange[1];
		});

		if (match.length > 0) {
			for (var i = 0; i < currentRow.length; i++) {
				var swatch = insertSwatch(currentRow[i], parent);

				swatch.classList.add('hue-matrix__swatch');
				swatch.style.width = (100 / (saturationRange[1] - saturationRange[0])) + '%';
				swatch.dataset.hex = currentRow[i].display.hex;

				// should probably be in a function
				swatch.addEventListener('click', function(e) {
					var scale = addMarkup('div', 'tone-scale', null);
					comparisonBox.appendChild(scale);
					displayCustomHueScaleIn(scale, this.dataset.hex);
				});
			}
		}

		currentRow = [];
	}
}






// Initialise stuff
// ////////////////
var colorInputs = document.querySelectorAll('.color-input');
var hueMatrixes = document.querySelectorAll('.hue-matrix');
var coloredContainer = document.querySelectorAll('.colour-study')[0];
var comparisonBox = document.querySelectorAll('.comparison-box')[0];

displayPartialHueMatrixIn(hueMatrixes[0], colorInputs[0].value, 'contrastToWhite', [4.2,5.2]);

coloredContainer.style.backgroundColor = colorInputs[0].value;



// Input colour event
colorInputs[0].addEventListener('change', function(e) {
	if (chroma.valid(this.value)) {
		coloredContainer.style.backgroundColor = colorInputs[0].value;

		displayPartialHueMatrixIn(hueMatrixes[0], this.value, 'contrastToWhite', [4.2,5.2]);

		comparisonBox.innerHTML = '';
	}
});
