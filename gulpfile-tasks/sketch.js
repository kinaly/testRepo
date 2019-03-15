// it seems that the sketch plugin is not working anymore, something to check on

module.exports = function (gulp, plugins, paths) {
  return function () {
    var stream = 
      gulp.src(paths.src.baseDir + '/*.sketch')
      .pipe(plugins.sketch({
        export: 'slices',
        format: 'png',
        saveForWeb: true,
        scales: 1.0,
        trimmed: false
      }))
      .on('error', gutil.log);
      .pipe(gulp.dest(paths.build.img));
      return stream;
  };
};