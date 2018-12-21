'use strict';

var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		fs = require('fs'),
		plugins = require('gulp-load-plugins')({
  		pattern: ['gulp-*', 'gulp.*'],
  		replaceString: /\bgulp[\-.]/,
  		lazy: true
  	});

var paths = {
	src: {
		baseDir: './_src',
		html: './_src/html',
		js: './_src/js/*.js',
		img: './_src/img/*.{png,jpg,jpeg,gif,svg}',
		styles: './_src/less/**/*.less',
		libs: './_src/lib',
		fonts: './_src/fonts/**/*'
	},
	build: {
		baseDir: './',
		js: './js',
		img: './img',
		styles: './css',
		fonts: './css/fonts'
	}
}

var defaultTasks = ['styles', 'js', 'copyLib', 'images', 'nunjucks'/*, 'copyData'*/];



gulp.task('clean', require('./gulpfile-tasks/clean')(paths));

gulp.task('styles', require('./gulpfile-tasks/styles')(gulp, browserSync, plugins, paths));

gulp.task('js', require('./gulpfile-tasks/scripts')(gulp, browserSync, paths));

gulp.task('copyLib', require('./gulpfile-tasks/libraries')(gulp, paths));

gulp.task('images', require('./gulpfile-tasks/images')(gulp, plugins, paths));

gulp.task('fonts', require('./gulpfile-tasks/fonts')(gulp, paths));

gulp.task('nunjucks', require('./gulpfile-tasks/html')(gulp, plugins, paths, fs));


// not in the default tasks
gulp.task('copyData', require('./gulpfile-tasks/copydata')(gulp, paths));



// it seems that the sketch plugin is not working anymore, something to check on
// gulp.task('sketch', require('./gulpfile-tasks/sketch')(gulp, plugins, paths));



gulp.task('serve', function(done) {
	browserSync({
		server: {
			baseDir: paths.build.baseDir
		}
	})
	done();
});


// Default task
gulp.task('default', gulp.series('clean', gulp.parallel(defaultTasks), 'serve', function watcher(done) {
		gulp.watch(paths.src.html + '/**/*', gulp.parallel(['nunjucks'/*,'copyData'*/]));
		gulp.watch(paths.src.styles, gulp.parallel('styles'));
		gulp.watch(paths.src.js, gulp.parallel('js'));
		gulp.watch(paths.src.img, gulp.parallel('images'));
		gulp.watch([paths.build.baseDir + '**/*', !paths.src.baseDir + '**/*']).on('change', browserSync.reload);
   })
);