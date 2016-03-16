var gulp = require('gulp'),
    del = require('del'),
    wiredep = require('wiredep').stream,
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver'),
    notify = require("gulp-notify"),
    imageop = require('gulp-image-optimization'),
    htmlmin = require('gulp-htmlmin'),
    minify = require('gulp-minify'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');


gulp.task('clean', function () {
    del.sync(['./www/**']);
});


gulp.task('build', ['clean'], function (){
////COPY_REST///////////////////////////////////////////////////////////////////////////////////////////////////////////
    gulp.src(['!./src/scss/**', '!./src/js/**', '!./src/**/*.html', './src/**'])
        .pipe(gulp.dest('./www/'));
////BOWER///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gulp.src('./src/**/*.html')
        .pipe(plumber({errorHandler: reportError}))
        .pipe(wiredep({directory: './src/bower/'}))
        .pipe(gulp.dest('./src/'));
////STYLE///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gulp.src(['./src/scss/all.scss'])
        .pipe(plumber({errorHandler: reportError}))
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./www/css/'))
        .pipe(postcss([
            autoprefixer,cssnano
        ]))
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest('./www/css/'));
////JS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gulp.src(['./src/js/main.js', './src/js/**/*.js'])
        .pipe(plumber({errorHandler: reportError}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./www/js/'))
        .pipe(minify())
        .pipe(gulp.dest('./www/js/'));
////HTML_MIN////////////////////////////////////////////////////////////////////////////////////////////////////////////
    gulp.src('./src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./www/'));
});


gulp.task('imin', function() {
    gulp.src('./src/i/**/*.*')
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })).pipe(gulp.dest('./src/imin/')).on('end').on('error');
});


gulp.task('webserver', function () {
    gulp.src('./www/')
        .pipe(webserver({
                livereload: true,
                port: 11111,
                open: 'index.html',
                directoryListing: {
                    enable: true,
                    path: './www/'
                }
            })
        )
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


gulp.task('default', function () {
    gulp.run(['clean', 'build', 'webserver']);

    gulp.watch('./src/**/*.*', ['build']);
});

//======================================================================================================================

var reportError = function (error) {
    notify({
        title: 'Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());

    this.emit('end');
};
