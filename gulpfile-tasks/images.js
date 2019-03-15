module.exports = function (gulp, plugins, paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.img)
	    .pipe(plugins.imagemin())
	    .on('error', plugins.util.log)
	    .pipe(gulp.dest(paths.build.img));
	    return stream;
 	 };
};