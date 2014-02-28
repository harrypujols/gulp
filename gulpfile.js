var gulp        = require('gulp'),
    open        = require("gulp-open"),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    uglify      = require('gulp-uglify'),
    coffee      = require('gulp-coffee'),
    jade        = require('gulp-jade'),
    concat      = require('gulp-concat'),
    rename      = require("gulp-rename"),
    flatten     = require('gulp-flatten'),
    marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    notify      = require("gulp-notify"),
    livereload  = require('gulp-livereload'),
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    server      = tinylr(),
    _if         = require('gulp-if'),
    isWindows   = /^win/.test(require('os').platform());
 
// --- Compass ---
gulp.task('compass', function() {
    gulp.src('./dev/styles/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: './build/css',
            sass: './dev/styles',
            image: './build/img'
        }))
        .pipe(gulp.dest('./build/css'))
        .pipe(livereload(server))
        .pipe(_if(!isWindows, notify('Compass compile successful')));
});

// --- Normalize ---
gulp.task('rename', function() {
    gulp.src('bower_components/**/normalize.css')
      .pipe(rename('_normalize.scss'))
      .pipe(gulp.dest('./dev/styles'));
});

// --- Scripts ---
gulp.task('js', function() {
  return gulp.src('./dev/scripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe( gulp.dest('./build/js'))
    .pipe(livereload(server))
    .pipe(_if(!isWindows, notify('Coffeescript compile successful')));
});

// --- Vendor ---
gulp.task('vendor', function() {
  return gulp.src('bower_components/**/modernizr.js')
      .pipe(flatten())
      .pipe( uglify() )
      // .pipe( concat('vendor.js'))
      .pipe(gulp.dest('build/js'));
});

// --- Jade --- 
gulp.task('templates', function() {
  return gulp.src('./dev/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./build'))
    .pipe(livereload(server))
    .pipe(_if(!isWindows, notify('Jade compile successful')));
});

// --- Server --- 
gulp.task('server', function() {
  app.use(require('connect-livereload')());
  app.use(express.static(path.resolve('./build')));
  app.listen(4000);
  gutil.log('Listening on localhost:4000');
});

// --- Open ---
gulp.task('open', function(){
  return gulp.src('./build/index.html')
      .pipe(open('', {url:'http://localhost:4000'}));
});

// --- Watch --- 
gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }
    gulp.watch('./dev/styles/*.scss',['compass']);
    gulp.watch('./dev/scripts/*.coffee',['js']);
    gulp.watch('./dev/*.jade',['templates']);
  });
});
 
// --- Default task --- 
gulp.task('default', ['js','vendor','rename','compass','templates','server','watch', 'open']);
