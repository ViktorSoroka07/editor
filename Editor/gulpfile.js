var gulp = require('gulp'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    comments = require('path'),
    path = require('path'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    jshint = require('gulp-jshint'),
    removeLogs = require('gulp-removelogs'),
    uglify = require('gulp-uglify');

gulp.task('connect', function () {
    connect.server({
        root: './markup',
        port: 8000,
        livereload: true
    });
});

gulp.task('libJs', function () {
    return gulp.src(['./markup/editor/js/uncompressed/libs/uncompressed/rangy-core.js', './markup/editor/js/uncompressed/libs/uncompressed/rangy-classapplier.js'])
        .pipe(concat('lib.min.js'))
        .pipe(removeLogs())
        .pipe(uglify())
        .pipe(gulp.dest('./markup/editor/js/uncompressed/libs/'))
        .pipe(connect.reload());
});

gulp.task('editorJs', function () {
    return gulp.src('./markup/editor/js/uncompressed/*.js')
        .pipe(removeLogs())
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./markup/editor/js/'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src('./markup/index.html')
        .pipe(connect.reload());
});

gulp.task('lessPreview', function () {
    gulp.src('./markup/editor/less/preview.less')
        .pipe(less())
        .pipe(minify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./markup/editor/css/'))
        .pipe(connect.reload());
});

gulp.task('lessIframe', function () {
    gulp.src('./markup/editor/less/iframe-style.less')
        .pipe(less())
        .pipe(minify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./markup/editor/css/'))
        .pipe(connect.reload());
});

gulp.task('url', function(){
    var options = {
        url: 'http://localhost:8000',
        app: 'chrome'
    };
    gulp.src('./markup/index.html')
        .pipe(open('', options));
});

gulp.task('watch', function () {
    gulp.watch('./markup/index.html', ['html']);
    gulp.watch('./markup/editor/js/uncompressed/libs/uncompressed/*.js', ['libJs']);
    gulp.watch('./markup/editor/js/uncompressed/editor-main.js', ['editorJs']);
    gulp.watch('./markup/editor/less/iframe-style.less', ['lessIframe']);
    gulp.watch('./markup/editor/less/preview.less', ['lessPreview']);
});

gulp.task('default', ['lessIframe', 'lessPreview', 'libJs', 'editorJs', 'connect', 'url', 'watch']);