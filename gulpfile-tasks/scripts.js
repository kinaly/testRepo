module.exports = function (gulp, browserSync,  paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.js)
  	  .pipe(gulp.dest(paths.build.js))
    	.pipe(browserSync.stream());
    	return stream;
  };
};