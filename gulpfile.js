const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer')
const postcss = require('gulp-postcss')
const htmlMini = require('gulp-html-minify')
const browserSync = require('browser-sync').create()
const imageMin = require('gulp-imagemin')
const combiner = require('stream-combiner2')
const gutil = require('gulp-util')

const handleError = function (err) {
    const colors = gutil.colors
    
    console.log()
    console.log(colors.red('------- Error -------'))
    console.log('file: ' + colors.yellow(err.file))
    console.log('line: ' + colors.yellow(err.line))
    console.log('message: ' + colors.yellow(err.messageFormatted))
    console.log('plugin: ' + colors.yellow(err.plugin))
    console.log(colors.red('---------------------'))
    console.log()
}

gulp.task('compile-js', function (cb) {
    let combined = combiner.obj([
        gulp.src('src/**/*.js', {
            sourcemaps: true
        }),
        babel({
            presets: ['@babel/preset-env']
        }),
        uglify(),
        gulp.dest('dist', {
            sourcemaps: '.'
        })
    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('compile-scss', function (cb) {

    let combined = combiner.obj([
        gulp.src('src/**/*.scss', {
            sourcemaps: true
        }),
        sass(),
        cleanCSS(),
        postcss([autoprefixer]),
        gulp.dest('dist', {
            sourcemaps: '.'
        }),


    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('transform-html', function (cb) {
    let combined = combiner.obj([
        gulp.src('src/**/*.html'),
        htmlMini(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

// todo 压缩率比较低 ｜ 图片格式暂时先试了一下png
gulp.task('transform-image', function (cb) {
    let combined = combiner.obj([
        gulp.src('src/**/*.png'),
        imageMin(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('reload', function (cb) {
    browserSync.reload();
    cb()
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