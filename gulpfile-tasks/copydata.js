module.exports = function (gulp, paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.html + '/data/**/*')
  	  .pipe(gulp.dest(paths.build.baseDir + '/data'));
  	  return stream;
  };
};