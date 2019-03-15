module.exports = function (gulp, paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.libs + '/**/*')
  	  .pipe(gulp.dest(paths.build.js));
  	  return stream;
  };
};