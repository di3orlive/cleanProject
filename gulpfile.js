var gulp = require('gulp'),
    connect = require('gulp-connect'),
    wiredep = require('wiredep').stream,
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    notify = require("gulp-notify"),
    imageop = require('gulp-image-optimization'),
    htmlmin = require('gulp-htmlmin'),
    minify = require('gulp-minify'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    changed = require('gulp-changed'),
    clean = require('gulp-clean'),
    cssnano = require('cssnano');



gulp.task('copy_rest', function() {
    gulp.src(['./src/bower']).pipe(gulp.dest('./www/'));
});

gulp.task('bower', function() {
    gulp.src('./src/**/*.html')
        .pipe(plumber({errorHandler: reportError}))
        .pipe(wiredep({directory: './src/bower/'}))
        .pipe(gulp.dest('./src/'));
});

gulp.task('scss', function() {
    gulp.src(['./src/scss/all.scss'])
        .pipe(plumber({errorHandler: reportError}))
        .pipe(changed('./www/css/'))
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./www/css/'))
        .pipe(postcss([
            autoprefixer({ browsers: ['last 5 versions'] }),cssnano
        ]))
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest('./www/css/'));
});

gulp.task('js', function() {
    gulp.src(['./src/js/main.js', './src/js/**/*.js'])
        .pipe(plumber({errorHandler: reportError}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./www/js/'))
        .pipe(minify())
        .pipe(gulp.dest('./www/js/'));
});

gulp.task('html', function() {
    gulp.src('./src/**/*.html')
        .pipe(plumber({errorHandler: reportError}))
        .pipe(changed('./www/'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./www/'));
});

gulp.task('imin', function() {
    gulp.src('./src/i/**')
        .pipe(changed('./www/i/'))
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('./www/i/'));
});

gulp.task('webserver', function() {
    connect.server({
        port: 55555,
        root: 'www',
        livereload: false
    });
});

gulp.task('release', function () {
    var number = gutil.env.number;
    //gulp release --number 0.1
    if (fs.existsSync('./releae/' + number)){
        return console.error('Number ' + number + ' already exists')
    }
    console.log('Making release ' + number + ' ');
    gulp.src('./www/**/*.*')
        .pipe(gulp.dest("./releases/" + number + '/'));
});




gulp.task('cleaning', function() {
    gulp.src('./www/', { read: false })
        .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch('./src/bower/**/*.*', ['copy_rest']);
    gulp.watch('./src/scss/**/*.*', ['scss']);
    gulp.watch('./src/js/**/*.*', ['js']);
    gulp.watch('./src/**/*.html', ['html']);

    gulp.watch('./src/i/**/*.*', ['imin']);
    gulp.watch('.bowerrc', ['bower']);
});

gulp.task('build', function() {
    gulp.start('copy_rest','imin','scss','js','html','webserver','watch');
});

gulp.task('default', ['cleaning', 'build']);

//======================================================================================================================

var reportError = function (error) {
    notify({
        title: 'Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());

    this.emit('end');
};