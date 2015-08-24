/*
This Gulpfile was created based on this tutorial:
http://mindthecode.com/lets-build-an-angularjs-app-with-browserify-and-gulp/

Browserify-prod gulp task was created using this recipe
(it takes much longer than browserify-dev to run, but produces js about 10 times smaller):
https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md

Also, interesting workflow to consider:
https://quickleft.com/blog/setting-up-a-clientside-javascript-project-with-gulp-and-browserify/

For cleaning the public folder, check out this repo:
https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md

*/

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    gulpBrowserify = require('gulp-browserify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'); // not necessary, but adds prefixes for all browsers
var Server = require('karma').Server; // this is for testing using Karma
var mocha = require('gulp-mocha'); // this is for backend testing
var exit = require('gulp-exit');

var paths = {
  scripts: ['client/**/*.js'], // previously had: '!client/lib/**/*.js'
  styles: ['./client/assets/**/*.css', './client/assets/**/*.scss', './client/lib/**/*.css'],
  index: './client/index.html',
  partials: ['client/app/**/*.html', '!client/index.html'],
  images: ['client/assets/**/*.png', 'client/assets/**/*.jpg', 'client/assets/**/*.jpeg', 'client/assets/**/*.gif', 'client/assets/**/*.svg', 'client/**/*.ico'],
  backendTests: ['specs/server/**/*.js']
};


// JSHint task
gulp.task('lint', function() {
  gulp.src(['./client/**/*.js', '!./client/lib/**/*.js', '!./client/map.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});


// Clean task — cleans the contents of the public folder
gulp.task('clean', function (callback) {
  del([
    'public/**/*'
  ], callback);
});


// First browserify task — quickly produces large concatenated javascript
gulp.task('browserify-dev', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['./client/app.js'])
  .pipe(gulpBrowserify({
    insertGlobals: true,
    debug: true
  }))
  // Bundle to a single file
  .pipe(concat('app.bundle.js'))
  // Output it to the dist folder
  .pipe(gulp.dest('public/scripts'));
});


// Second browserify task — produces minified javascript

gulp.task('browserify-prod', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './client/app.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify({mangle: false}))
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/scripts'));
});

// Views task
gulp.task('views', function() {
  // Any other view files from app/views
  gulp.src(paths.partials)
  // Will be put in the public/views folder
  .pipe(gulp.dest('public/views/'));
});

// Images task — copy all images to public folder
gulp.task('images', function() {
  // Image files from app/assets
  gulp.src(paths.images)
  // will be put in the public/images folder
  .pipe(gulp.dest('public/images/'));
});

// Creates css files out of scss and puts them in public/styles folder
// (also copies css files from the client folder to public/styles folder)
gulp.task('styles', function() {
  gulp.src(paths.styles)
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(sass({onError: function(e) { console.log(e); } }))
  // Optionally add autoprefixer
  .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
  .pipe(gulp.dest('public/styles/'));
});

// Runs mocha tests for backend for the client side once and exits
gulp.task('test-backend',['test-client'], function () {
  return gulp.src(paths.backendTests, {read: false})
  // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({reporter: 'spec'})).pipe(exit());
});

// Runs tests for the client side once and exits
// see this repo for inspiration: https://github.com/karma-runner/gulp-karma
gulp.task('test-client', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', ['lint'], function() {
  // When script files change — run lint and browserify
  gulp.watch([paths.scripts],[
    'lint',
    'browserify-dev'
  ]);
  gulp.watch([paths.index, paths.partials], [
    'views'
  ]);
  gulp.watch([paths.styles], [
    'styles'
  ]);
  gulp.watch([paths.images], [
    'images'
  ]);
});

// gulp.task('test', ['test-backend', 'test-client']);
gulp.task('build', ['lint', 'browserify-prod', 'views', 'styles', 'images']);
gulp.task('build-heroku', ['browserify-prod', 'views', 'styles', 'images']);

gulp.task('test', ['test-backend']);

gulp.task('default', ['lint', 'browserify-dev', 'views', 'styles', 'images', 'watch']);
