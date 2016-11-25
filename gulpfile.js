'use strict';

// Plugins
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    maps = require('gulp-sourcemaps'),
    del = require('del');

// Scripts
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
    .pipe(gulp.dest('docs/js'));
});

gulp.task('minify-scripts', ['concat-scripts'], function() {
    return gulp.src('docs/js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('docs/js'));
});

// CSS
gulp.task('concat-css', function() {
    return gulp.src([
        'src/css/normalize.css',
        'src/css/nebula.css',
        'src/css/main.css'
     ])
    .pipe(maps.init())
    .pipe(concat('stylesheet.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('docs/css'));
});

gulp.task('minify-css', ['concat-css'], function() {
    return gulp.src('docs/css/stylesheet.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulp.dest('docs/css'));
});

// Watch Files
gulp.task('watchFiles', function() {
    gulp.watch('src/js/*.js', 'src/css/*.css' ['concat-scripts','concat-css']);
});

// Clean
gulp.task('clean', function() {
    del(['docs', 'src/js/app*.js*','src/css/stylesheet*.css*']);
});

// Build
gulp.task('build', ['minify-scripts', 'minify-css'], function() {
    return gulp.src(['src/index.html', 'src/config.xml', 'src/img/**', 'src/fonts/**'], { base: './src/' })
    .pipe(gulp.dest('docs/'))

});

gulp.task('serve', ['watchFiles']);

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});