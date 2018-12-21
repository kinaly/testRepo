module.exports = function (gulp, plugins, paths) {
  return function () {
  	var stream = 
	    gulp.src(paths.src.html + '/templates/views/**/*')
	    .pipe(plugins.nunjucks.precompile())
  	  .pipe(gulp.dest(paths.build.baseDir + '/views'));
  	  return stream;
  };
};