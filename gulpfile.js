const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const htmlMini = require('gulp-html-minify')
const browserSync = require('browser-sync').create()

gulp.task('compile-js', function (cb) {
    gulp.src('src/**/*.js', {
            sourcemaps: true
        })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist', {
            sourcemaps: '.'
        }))
        .on('error', err => {
            console.log('Error catched at compile-js phase, detail: ')
            console.log(err)
        })
    cb()
})

gulp.task('compile-scss', function (cb) {
    gulp.src('src/**/*.scss', {
            sourcemaps: true
        })
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(postcss([autoprefixer]))
        .pipe(gulp.dest('dist', {
            sourcemaps: '.'
        }))

        .on('error', err => {
            console.log("Error catched at compile-scss phase, detail: ")
            console.log(err)
        })
    cb()
})

gulp.task('transform-html', function (cb) {
    gulp.src('src/**/*.html')
        .pipe(htmlMini())
        .pipe(gulp.dest('dist'))
    cb()
})

gulp.task('reload', function (cb) {
    browserSync.reload();
    cb();
})

gulp.task('build', gulp.series([
    gulp.parallel('compile-js', 'compile-scss', 'transform-html')
]))

gulp.task('default', gulp.series('build', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })

    gulp.watch(['src/**/*.js'], gulp.series(['compile-js', 'reload']))
    gulp.watch(['src/**/*.scss'], gulp.series(['compile-scss', 'reload']))
    gulp.watch(['src/**/*.html'], gulp.series(['transform-html', 'reload']))
}))