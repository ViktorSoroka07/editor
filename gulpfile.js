var gulp = require('gulp'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    comments = require('path'),
    path = require('path');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('less', function () {
    gulp.src('./editor/markup/less/**/style.less')
        .pipe(less())
        .pipe(minify({}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./editor/markup/css'));
    gulp.src('./editor/markup/less/**/preview.less')
        .pipe(less())
        .pipe(minify({}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./editor/markup/editor/css'));
    gulp.src('./editor/markup/less/**/iframe-style.less')
        .pipe(less())
        .pipe(minify({}))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./editor/markup/editor/css'));
});