/// <binding beforebuild="process:less"></binding>
var gulp = require('gulp'),
    less = require('gulp-less'),
    ts = require('gulp-typescript'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    del = require('del');

var paths = {
    styles: {
        src: 'Styles/**/*.less',
        dest: './wwwroot//css'
    },
    scripts: {
        src: 'Scripts/**/*.js',
        dest: './wwwroot//scripts'
    },
    typescript: {
        src: 'Scripts/Typescript/**/*.ts',
        dest: 'Scripts/'
    }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['assets']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function typescript() {
    return gulp.src(paths.typescript.src, { sourcemaps: true })
        .pipe(ts({
            strict: true,
            noImplicitAny: true,
            noEmitOnError: true,
            removeComments: true
        }))
        .pipe(gulp.dest(paths.typescript.dest));
}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.typescript.src, typescript);
    gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts, typescript));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.typescript = typescript;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;