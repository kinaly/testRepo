// custom scripts here
const env = nunjucks.configure('/views', {
    autoescape: true
});

var colorInputs = document.querySelectorAll('.color-input');
var toneScales = document.querySelectorAll('.tone-scale');
var contrastResult = document.querySelectorAll('.pair__contrast')[0];



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



function newChromaScale(color01,color02,colorSteps) {
  var colorScale = chroma.scale([color01, color02]).mode('lab').colors(colorSteps);
  return colorScale;
}



function getContrast(color01, color02) {
	var contrast = Math.floor(chroma.contrast(color01, color02) * 100) / 100;
	return contrast;
}






function insertSwatch(dataObject, container) {
	let swatchTemplate = env.render('swatch.html', { swatch: dataObject }),
			swatch = addMarkup('div', 'tone-scale__swatch swatch', swatchTemplate);
	
	container.appendChild(swatch);
}



function setSwatchDetails(colour) {
	var hue = chroma(colour).get('hsl.h');
	var swatchDetails = {
		'hex': chroma(colour).hex(),
		'hue': hue.toString() + '˚',
		'contrastToWhite': getContrast(colour, '#ffffff')
	};

	return swatchDetails;

}



function generateToneScaleIn(parent,colour) {	
	parent.innerHTML = '';

	var mainHue = chroma(colour).get('hsl.h');
	
	var darkScale = newChromaScale(colour, '#000000', 6);

	for (var i = darkScale.length - 1; i >= 2; i--) {
		var adjustedHue = chroma(darkScale[i-1]).set('hsl.h', mainHue);
		var swatchDetails = setSwatchDetails(adjustedHue);

		insertSwatch(swatchDetails, parent);
	}


	insertSwatch(setSwatchDetails(colour), parent);


	var lightScale = newChromaScale(colour, '#ffffff', 6);

	for (var i = 0; i < (lightScale.length - 2); i++) {
		var adjustedHue = chroma(lightScale[i+1]).set('hsl.h', mainHue);
		var swatchDetails = setSwatchDetails(adjustedHue);

		insertSwatch(swatchDetails, parent);
	}

}




generateToneScaleIn(toneScales[0], colorInputs[0].value);


colorInputs[0].addEventListener('change', function(e) {
	if (chroma.valid(this.value)) {
		generateToneScaleIn(toneScales[0], this.value);
	}
});
