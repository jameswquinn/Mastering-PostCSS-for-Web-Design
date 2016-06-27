'use strict';
var gulp     = require('gulp');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var pleeease = require('gulp-pleeease');
var sourcemaps = require('gulp-sourcemaps');
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');

var pleeeaseOptions = {
    optimizers: { minifier: true }
};

var stylerules = {
  "color-no-invalid-hex": 2,
  "declaration-colon-space-before": [2, "never"],
  "indentation": [2, 2],
  "number-leading-zero": [2, "always"]
};

var renameFunction = function (path) {
  path.extname = ".min.css";
  return path;
};

var sourceMapLocation = ['dest/*.css', '!dest/*.min.css'];

gulp.task('styles', function () {
  return gulp.src('src/*.css')
    .pipe(pleeease(pleeeaseOptions))
    .pipe(gulp.dest('dest/'));
});

gulp.task('lint', ['styles'], function() {
  return gulp.src("dest/*.css")
    .pipe(postcss([ stylelint({ "rules": stylerules }), 
    reporter({ clearMessages: true })
  ]))
});

gulp.task('sourcemap', ['rename'], function () {
  return gulp.src(sourceMapLocation)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('maps/', {
      sourceMappingURLPrefix: 'https://www.mydomain.com/'
    }))
    .pipe(gulp.dest("dest/"));
});

gulp.task('rename', ['lint'], function () {
  return gulp.src('dest/*.css')
    .pipe(rename(renameFunction))
    .pipe(gulp.dest("dest/"));
});

gulp.task('default', ['styles', 'lint', 'rename', 'sourcemap']);

var watcher = gulp.watch('src/*.css', ['styles', 'lint', 'rename', 'sourcemap']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});