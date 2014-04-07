var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    compass     = require('gulp-compass'),
    uglify      = require('gulp-uglify'),
    coffee      = require('gulp-coffee'),
    swig        = require('gulp-swig'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    _if         = require('gulp-if'),
    isWindows   = /^win/.test(require('os').platform()),
    browsersync = require('browser-sync');
 
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
        .pipe(_if(!isWindows, notify({
          title: 'Sucess',
          message: 'Compass compiled'
        })));
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
    .pipe(gulp.dest('./build/js'))
    .pipe(_if(!isWindows, notify({
      title: 'Sucess',
      message: 'Coffeescript compiled'
    })));
});

// --- Templates --- 
gulp.task('templates', function() {
  gulp.src('./dev/*.html')
    .pipe(plumber())
    .pipe(swig({
      load_json: true,
      json_path: './dev/data'
    }))
    .on('error', notify.onError({
      title: 'Fail',
      message: 'Something fucked up'
    }))
    .on('error', function (err) {
      return console.log(err);
    })
    .pipe(gulp.dest('./build'))
    .pipe(_if(!isWindows, notify({
      title: 'Sucess',
      message: 'Templates compiled'
    })));
});

// --- Watch --- 
gulp.task('watch', function() {
    gulp.watch('./dev/styles/*.scss',['compass']);
    gulp.watch('./dev/scripts/*.coffee',['js']);
    gulp.watch(['./dev/*.html', './dev/**/*.html', './dev/data/*.json'],['templates']);
});

// --- Server --- 
gulp.task('server', function() {  
    browsersync.init(['./build/*.*', './build/**/*.*'], {
        server: {
            baseDir: './build'
        }
    });
});
 
// --- Default task --- 
gulp.task('default', ['js','rename','compass','templates','watch', 'server']);
