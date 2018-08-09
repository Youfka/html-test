'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'), 
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    del = require('del'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;


var path = {
    build: { 
        html: 'build/',
        css: 'build/css/',
        images: 'build/images/'
    },
    src: { 
        html: 'src/**/*.html', 
        css: 'src/css/main.scss',
        images: ['!src/images/sprite.svg','src/images/**/*.*'], 
        svg: 'src/images/svg/*.svg'
    },
    watch: { 
        html: 'src/**/*.html',
        css: 'src/css/**/*.scss',
        images: 'src/images/**/*.*',
        svg: 'src/images/svg/*.svg'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Test"
};

gulp.task('html:build', function buildHTML() {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
    gulp.src(path.src.css)
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        }).on('error', sass.logError))
        .pipe(autoprefixer()) 
        .pipe(csso())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('images:build', function() {
    gulp.src(path.src.images)
    	.pipe(imagemin([
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
        .pipe(gulp.dest(path.build.images))
});


gulp.task('build', [
	'html:build',
    'css:build',
    'images:build'
]);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.images], function(event, cb) {
        gulp.start('images:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    del(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);