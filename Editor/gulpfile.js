var gulp = require('gulp'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    path = require('path'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    removeLogs = require('gulp-removelogs'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass');

gulp.task('connect', function () {
    connect.server({
        root: '../',
        port: 8000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['./markup/index.html'], ['html']);
    gulp.watch(['./markup/editor/js/uncompressed/libs/uncompressed/*.js'], ['libJs']);
    gulp.watch(['./markup/editor/js/uncompressed/editor-main.js'], ['editorJs']);
    gulp.watch(['./markup/editor/scss/iframe-style.scss'], ['scssIframe','html']);
    gulp.watch(['./markup/editor/scss/preview.scss'], ['scssPreview']);
});

gulp.task('html',['scssIframe'], function () {
    return gulp.src('./markup/index.html')
        .pipe(connect.reload());
});

gulp.task('scssPreview', function () {
    gulp.src('./markup/editor/scss/preview.scss')
        .pipe(compass({
            project: path.join(__dirname, './markup/editor/'),
            css: 'css',
            sass: 'scss'
        }))
        .pipe(minify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./markup/editor/css/'))
        .pipe(connect.reload());
});

gulp.task('scssIframe', function () {
    return gulp.src('./markup/editor/scss/iframe-style.scss')
        .pipe(compass({
            project: path.join(__dirname, './markup/editor/'),
            css: 'css',
            sass: 'scss'
        }))
        .pipe(minify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./markup/editor/css/'))
        .pipe(connect.reload());
});

gulp.task('url', function(){
    var options = {
        url: 'http://localhost:8000/Editor/markup/',
        app: 'chrome'
    };
    gulp.src('./markup/index.html')
        .pipe(open('', options));
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

gulp.task('default', ['scssIframe', 'scssPreview', 'libJs', 'editorJs', 'html', 'url', 'connect', 'watch']);