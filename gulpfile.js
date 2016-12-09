'use strict';

// Plugins
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    maps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    del = require('del');

// Concat Scripts
gulp.task('concat-scripts', function() {
    return gulp.src([
        'src/js/customization.js',
        'src/js/startup.js',
        'src/js/menus.js',
        'src/js/build_lists.js',
        'src/js/build_levels.js',
        'src/js/build_math.js',
        'src/js/monster_manual.js',
        'src/js/spawn_enemies.js',
        'src/js/enemy_abilities.js',
        'src/js/movement_enemy.js',
        'src/js/movement_player.js',
        'src/js/attack_player.js',
        'src/js/tutorial.js',
        'src/js/death.js',
        'src/js/utilities.js'
        ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

// Minify Scripts
gulp.task('minify-scripts', ['concat-scripts'], function() {
    return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

// Concat CSS
gulp.task('concat-css', function() {
    return gulp.src([
        'src/css/normalize.css',
        'src/css/nebula.css',
        'src/css/main.css'
     ])
    .pipe(maps.init())
    .pipe(concat('stylesheet.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

// Autoprefix and Minify CSS
gulp.task('minify-css', ['concat-css'], function() {
    return gulp.src('css/stylesheet.css')
    .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulp.dest('css'));
});

// Watch Files
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', 'src/css/*.css' ['concat-scripts','concat-css']);
});

// Clean
gulp.task('clean', function() {
    del(['src/js/app*.js*','src/css/stylesheet*.css*','css','js']);
});

// Build
gulp.task('build', ['minify-scripts', 'minify-css'], function() {
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});