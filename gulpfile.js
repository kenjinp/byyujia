//include gulp
var gulp = require('gulp');

//include plug-ins
var jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('gulp-browserify'),
    mocha = require('gulp-mocha'),
    scsslint = require('gulp-scss-lint');


//JS hint task
gulp.task('jshint', function() {
  gulp.src([
    './src/scripts/*.js',
     './src/scripts/spec/*.js',
     './src/scripts/spec/modules/*.js',
     './src/scripts/spec/integration/*.js',
     './src/scripts/spec/integration/modules*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//scss lint
gulp.task('scss-lint', function() {
  gulp.src('./src/styles/*.scss')
    .pipe(scsslint());
})

//minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

//minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

//JS concat, strip debugging then minify
gulp.task('scripts', function() {
  var scriptSrc = ['./src/scripts/signup.js'],
      scriptDst = './build/scripts';
  gulp.src(scriptSrc)
    .pipe(browserify())
    .pipe(concat('scripts.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest('./build/scripts'));
});

//CSS sass, concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./src/styles/normalize.css','./src/styles/style.scss'])
    .pipe(sass())
    .pipe(concat('syles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'));
});

//dalek browser testing
gulp.task('test', function() {
  gulp.src('./src/scripts/spec/test.js')
    .pipe(mocha({reporter: 'spec'}));
});

//default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles'], function() {
  //watch for HTMl changes
  gulp.watch('./src/*.html', ['htmlpage']);
  //watch for JS changes
  gulp.watch('./src/scripts/*.js' ['jshint', 'scripts']);
  //watch for CSS changes
  gulp.watch('./src/styles/*.scss', ['styles']);
});
