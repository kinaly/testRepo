var del = require('del');

module.exports = function (paths) {
  return function () {
  	var customCleanList = [
  		paths.build.baseDir + '*.html',
  		paths.build.baseDir + '/colour-contrast-explorer',
  		paths.build.styles,
  		paths.build.js,
  		paths.build.baseDir + '/views',
  		paths.build.img
  	];

  	var cleanList = paths.build.baseDir == "./" ? customCleanList : paths.build.baseDir;
  	var stream =
	    del(
	    	cleanList, 
	    	{force: true});
	    return stream;
	  };
};