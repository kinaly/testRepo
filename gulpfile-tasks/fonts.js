module.exports = function (gulp, paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.fonts)
  	  .pipe(gulp.dest(paths.build.fonts));
  	  return stream;
  };
};