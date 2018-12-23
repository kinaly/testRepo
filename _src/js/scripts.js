// custom scripts here
const env = nunjucks.configure('/views', {
    autoescape: true
});

var colorInputs = document.querySelectorAll('.color-input');
var toneScales = document.querySelectorAll('.tone-scale');
var hueMatrixes = document.querySelectorAll('.hue-matrix');






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
		'hex': chroma(colour).hex(),
		'hslHue': hslHue,
		'hslSaturation': hslSaturation,
		'hslLuminosity': hslLuminosity,
		'hsvHue': hsvHue,
		'hsvSaturation': hsvSaturation,
		'hsvValue': hsvValue,
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


// Insert a mini swatch based on mini-swatch.html
function insertMiniSwatch(swatchDetails, container) {
	let swatchTemplate = env.render('mini-swatch.html', { swatch: swatchDetails }),
			swatch = addMarkup('div', 'swatch -mini', swatchTemplate);

	if (swatchDetails.contrastToWhite > 4.54) {
		swatch.classList.add('-reverse');
	}

	if (swatchDetails.contrastToWhite > 4.54 && swatchDetails.contrastToWhite < 4.66) {
		swatch.classList.add('-highlight');
	}

	container.appendChild(swatch);

	return swatch;
}



// generate a tone scale
function displayToneScaleIn(parent,colour) {	
	parent.innerHTML = '';

	var mainHue = chroma(colour).get('hsl.h');
	
	var lightScale = newChromaScale(colour, '#ffffff', 6);

	for (var i = lightScale.length - 1; i >= 2; i--) {
		var adjustedHue = chroma(lightScale[i-1]).set('hsl.h', mainHue);
		var swatchDetails = getSwatchDetails(adjustedHue);

		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}


	var mainSwatch = insertSwatch(getSwatchDetails(colour), parent);
	mainSwatch.classList.add('tone-scale__swatch');

	var darkScale = newChromaScale(colour, '#000000', 6);

	for (var i = 0; i < (darkScale.length - 2); i++) {
		var adjustedHue = chroma(darkScale[i+1]).set('hsl.h', mainHue);
		var swatchDetails = getSwatchDetails(adjustedHue);

		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}
}



// display a luminosity scale
function displayLuminosityScaleIn(parent, colour) {
	var colourLuminosity = getSwatchDetails(colour).hslLuminosity;

	var lightStep = (100 - colourLuminosity) / 5;
	var darkStep = colourLuminosity / 5;

	parent.innerHTML = '';

	for (var i = 4 - 1; i >= 0; i--) {
		var lum = colourLuminosity + (i+1) * lightStep;
		var col = chroma(colour).set('hsl.l', lum/100);

		var swatchDetails = getSwatchDetails(col);
		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}

	var mainSwatch = insertSwatch(getSwatchDetails(colour), parent);
	mainSwatch.classList.add('tone-scale__swatch');

	for (var i = 0; i < 4; i++) {
		var lum = colourLuminosity - (i+1) * darkStep;
		var col = chroma(colour).set('hsl.l', lum/100);

		var swatchDetails = getSwatchDetails(col);
		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}
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
			}
		}

		currentRow = [];
	}
}






// Initialise stuff
// ////////////////
displayToneScaleIn(toneScales[0], colorInputs[0].value);

displayCustomHueScaleIn(toneScales[1], colorInputs[0].value);

displayLuminosityScaleIn(toneScales[2], colorInputs[0].value);


// reference
var referenceColours = ['#017ea7', '#548200', '#dd3402', '#268464', '#757575'];
var referenceContainer = document.querySelectorAll('.reference')[0];

for (var i = 0; i < referenceColours.length; i++) {
	var toneScale = addMarkup('div', 'tone-scale', null);
	referenceContainer.appendChild(toneScale);
	displayToneScaleIn(toneScale, referenceColours[i]);

	var customHueScale = addMarkup('div', 'tone-scale', null);
	referenceContainer.appendChild(customHueScale);
	displayCustomHueScaleIn(customHueScale, referenceColours[i]);

	var luminosityScale = addMarkup('div', 'tone-scale', null);
	referenceContainer.appendChild(luminosityScale);
	displayLuminosityScaleIn(luminosityScale, referenceColours[i]);

}

displayPartialHueMatrixIn(hueMatrixes[0], colorInputs[0].value, 'contrastToWhite', [4.2,5.2]);

// displayHueMatrixIn(hueMatrixes[1], colorInputs[0].value, 20, 50);


colorInputs[0].addEventListener('change', function(e) {
	if (chroma.valid(this.value)) {
		displayToneScaleIn(toneScales[0], this.value);
		displayCustomHueScaleIn(toneScales[1], this.value);
		displayLuminosityScaleIn(toneScales[2], this.value);
		// displayHueMatrixIn(hueMatrixes[0], this.value, 10, 20);
		displayPartialHueMatrixIn(hueMatrixes[0], this.value, 'contrastToWhite', [4.2,5.2])
	}
});
