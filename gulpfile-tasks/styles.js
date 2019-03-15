var autoprefixerOptions = { browsers: ['last 3 versions', '> 5%', 'Firefox ESR'] };

module.exports = function(gulp, browserSync, plugins, paths) {
  return function () {
    var stream =
        gulp.src(paths.src.baseDir + '/less/[!_]*.less')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.autoprefixer(autoprefixerOptions))
        .pipe(plugins.sourcemaps.write('../css'))
        .pipe(gulp.dest(paths.build.styles))
        .pipe(browserSync.stream())
        .on('error', plugins.util.log);
        return stream;
      };
};
