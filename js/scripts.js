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
function setSwatchDetails(colour) {
	var hue = Math.floor(chroma(colour).get('hsl.h'));
	var saturation = Math.floor(chroma(colour).get('hsl.s') * 100);
	var luminosity = Math.floor(chroma(colour).get('hsl.l') * 100);

	var hue2 = Math.floor(chroma(colour).get('hsv.h'));
	var saturation2 = Math.floor(chroma(colour).get('hsv.s') * 100);
	var value = Math.floor(chroma(colour).get('hsv.v') * 100);

	var swatchDetails = {
		'hex': chroma(colour).hex(),
		'hue': hue,
		'saturation': saturation,
		'luminosity': luminosity,
		'hue2': hue2,
		'saturation2': saturation2,
		'value': value,
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
function generateToneScaleIn(parent,colour) {	
	parent.innerHTML = '';

	var mainHue = chroma(colour).get('hsl.h');
	
	var lightScale = newChromaScale(colour, '#ffffff', 6);

	for (var i = lightScale.length - 1; i >= 2; i--) {
		var adjustedHue = chroma(lightScale[i-1]).set('hsl.h', mainHue);
		var swatchDetails = setSwatchDetails(adjustedHue);

		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}


	var mainSwatch = insertSwatch(setSwatchDetails(colour), parent);
	mainSwatch.classList.add('tone-scale__swatch');

	var darkScale = newChromaScale(colour, '#000000', 6);

	for (var i = 0; i < (darkScale.length - 2); i++) {
		var adjustedHue = chroma(darkScale[i+1]).set('hsl.h', mainHue);
		var swatchDetails = setSwatchDetails(adjustedHue);

		var swatch = insertSwatch(swatchDetails, parent);
		swatch.classList.add('tone-scale__swatch');
	}
}



function generateHueMatrixIn(parent, colour, saturationSteps, luminositySteps) {

	var currentChildCount = parent.childElementCount;
	var matrixSize = saturationSteps * luminositySteps - saturationSteps;

	var hue = Math.floor(chroma(colour).get('hsl.h'));
	
	parent.innerHTML = '';
			
	for (var j = 1; j < (luminositySteps); j++) {
		var luminosity = 100 / luminositySteps * j;
		for (var i = 1; i < (saturationSteps + 1); i++) {
			var saturation = 100 / saturationSteps * i;
			var newColour = 'hsl(' + hue + ',' + saturation + '%,' + luminosity +'%)';
			var swatchDetails = setSwatchDetails(newColour);
			var swatch = insertSwatch(swatchDetails, parent);

			swatch.classList.add('hue-matrix__swatch');
			swatch.style.width = (100 / (saturationSteps)) + '%';
		}	
	}
}






// Initialise stuff
// ////////////////
generateToneScaleIn(toneScales[0], colorInputs[0].value);

// reference
var referenceColours = ['#0d7fa5','#007fa9', '#548200', '#dd3402', '#268464', '#757575'];
var referenceContainer = document.querySelectorAll('.reference')[0];

for (var i = 0; i < referenceColours.length; i++) {
	var toneScale = addMarkup('div', 'tone-scale', null);
	referenceContainer.appendChild(toneScale);
	generateToneScaleIn(toneScale, referenceColours[i])
}

generateHueMatrixIn(hueMatrixes[0], colorInputs[0].value, 10, 20);


colorInputs[0].addEventListener('change', function(e) {
	if (chroma.valid(this.value)) {
		generateToneScaleIn(toneScales[0], this.value);
		generateHueMatrixIn(hueMatrixes[0], this.value, 10, 20);
	}
});
