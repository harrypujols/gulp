var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    uglify      = require('gulp-uglify'),
    coffee      = require('gulp-coffee'),
    swig        = require('gulp-swig'),
    marked      = require('swig-marked'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    connect     = require('gulp-connect'),
    open        = require('gulp-open'),
    port        = 1337,
    deploy      = require('gulp-gh-pages');
 
// --- Compass ---
gulp.task('compass', function() {
    gulp.src('./dev/styles/*.scss')
    	.pipe(plumber())
        .pipe(compass({
            config_file: './config.rb',
            css: './build/css',
            sass: './dev/styles',
            image: './build/img'
        }))
		.on('error', notify.onError({
			title: 'Fail',
			message: 'Compass error'
		}))
		.on('error', function (err) {
			return console.log(err);
		})
        .pipe(gulp.dest('./build/css'))
        .pipe(connect.reload())
        .pipe(notify({
          title: 'Sucess',
          message: 'Compass compiled'
        }))
});

// --- Scripts ---
gulp.task('js', function() {
  return gulp.src('./dev/scripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./build/js'))
    .pipe(connect.reload())
    .pipe(notify({
      title: 'Sucess',
      message: 'Coffeescript compiled'
    }))
});

// --- Vendor ---
gulp.task('vendor', function() {
  gulp.src('./dev/scripts/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(connect.reload())
});

// --- Templates --- 
gulp.task('templates', function() {
  gulp.src('./dev/*.html')
    .pipe(plumber())
    .pipe(swig({
      defaults: { 
          cache: false,
          locals: require('./dev/data/data.json')
      },
      load_json: true,
      json_path: './dev/data',
      setup: function(swig){ marked.useTag(swig, 'markdown'); }
    }))
    .on('error', notify.onError({
      title: 'Fail',
      message: 'Something fucked up'
    }))
    .on('error', function (err) {
      return console.log(err);
    })
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload())
    .pipe(notify({
      title: 'Sucess',
      message: 'Templates compiled'
    }))
});

// --- Watch --- 
gulp.task('watch', function() {
    gulp.watch(['./dev/*.html', './dev/**/*.html', './dev/data/*', './dev/partials/*'],['templates']);
    gulp.watch('./dev/styles/*.scss',['compass']);
    gulp.watch('./dev/scripts/*.coffee',['js']);
});

// --- Server ---
gulp.task('server', function() {
  connect.server({
    root: './build',
    port: port,
    livereload: true
  });
});

// --- Open ---
gulp.task('open', function(){
  return gulp.src('./build/index.html')
      .pipe(open('', {url:'http://localhost:' + port/*,  app: 'Google Chrome' */}));
});

// --- Deploy ---
gulp.task('deploy', function () {
    gulp.src('./build/**/*')
        .pipe(deploy('https://github.com/harrypujols/gulp', 'origin'));
});
 
// --- Default task --- 
gulp.task('default', ['js','vendor','compass','templates','watch','server', 'open']);
