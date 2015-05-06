'use strict';

var gulp = require('gulp');

var amdOptimize = require("amd-optimize");
var amdclean = require('gulp-amdclean');
var concat = require('gulp-concat');
var uglyfly = require('gulp-uglyfly');
var rename = require("gulp-rename");
var rm = require('gulp-rm');
var wrap = require("gulp-wrap");
var fs = require('fs');
var replace = require('gulp-replace');

gulp.task("default", ["clean:tmp"], function () {});

gulp.task("scripts:pre-build", function () {

    return gulp.src("./src/**/*.js")
        .pipe(amdOptimize("xCookie"))
        .pipe(concat("xCookie.js"))
        .pipe(gulp.dest("tmp"));
});

gulp.task("scripts:build", ["scripts:pre-build"], function () {
    return gulp.src("./tmp/xCookie.js")
        .pipe(amdclean.gulp({'prefixMode': 'standard'}))
        .pipe(replace(/^;\(function\(\) \{/, ''))
        .pipe(replace(/\}\(\)\)\;$/, ''))
        .pipe(wrap(fs.readFileSync('./.build-wrapper.tpl', 'utf8')))
        .pipe(gulp.dest('./dist'))
        .pipe(uglyfly())
        .pipe(concat("xCookie.min.js"))
        .pipe(gulp.dest("dist"));
})

gulp.task("test:sync", ["scripts:build"], function () {
    return gulp.src("./dist/xCookie.min.js")
        .pipe(gulp.dest("tests/dist"));
});

gulp.task("demo:sync", ["test:sync"], function () {
    return gulp.src("./dist/xCookie.min.js")
        .pipe(gulp.dest("./demo/dist"));
});

gulp.task("clean:tmp", ["demo:sync"], function () {
    return gulp.src("./tmp/**/*", {read: true})
        .pipe(rm({async: false}))
})


gulp.task("test:mocha", ["test:sync"], function () {
    return gulp
        .src("./tests/phantomjs.html")
        .pipe(mochaPhantomJS());
});