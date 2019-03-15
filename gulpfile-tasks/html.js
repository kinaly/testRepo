module.exports = function (gulp, plugins, paths, fs) {
  return function () {
    var stream = 
      // Gets .html and .nunjucks files in pages
      gulp.src(paths.src.baseDir + '/html/pages/**/*.html')
      // Adding data to Nunjucks
      .pipe(plugins.data(function() {
        return JSON.parse(fs.readFileSync(paths.src.html + '/data/data.json'));
      }))
      .on('error', plugins.util.log)
      // Renders template with nunjucks
      .pipe(plugins.nunjucksRender({
          path: [paths.src.baseDir + '/html/templates']
        }))
      .on('error', plugins.util.log)
      // output files in app folder
      .pipe(gulp.dest(paths.build.baseDir));
      return stream;
  };
};