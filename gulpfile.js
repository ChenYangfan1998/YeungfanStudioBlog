const gulp = require('gulp')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const htmlMini = require('gulp-html-minify')
const browserSync = require('browser-sync').create()
const imageMin = require('gulp-imagemin')
const combiner = require('stream-combiner2')
const gutil = require('gulp-util')
const del = require('del')

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

gulp.task('clean', function (cb) {
    del(['/dist/**/*'])
    cb()
})

gulp.task('js', function (cb) {
    gulp.src('src/**/*.js', )
        .pipe(gulp.dest('dist'))

    cb()
})

gulp.task('scss', function (cb) {

    let combined = combiner.obj([
        gulp.src(['src/**/*.scss', '!src/**/*.dev.scss'], {
            sourcemaps: true
        }),
        sass(),
        cleanCSS(),
        autoprefixer({
            cascade: false
        }),
        gulp.dest('dist', {
            sourcemaps: '.'
        }),
    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('html', function (cb) {
    let combined = combiner.obj([
        gulp.src('src/**/*.html'),
        htmlMini(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

// todo 压缩率比较低 ｜ 图片格式暂时先试了一下png
gulp.task('image', function (cb) {
    let combined = combiner.obj([
        gulp.src('src/**/*.png'),
        imageMin(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('reload', function (cb) {
    browserSync.reload()
    cb()
})

gulp.task('build', gulp.series([
    'clean',
    gulp.parallel('js', 'scss', 'html')
]))

gulp.task('default', gulp.series('build', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })

    gulp.watch(['src/**/*.js'], gulp.series(['clean', 'js', 'reload']))
    gulp.watch(['src/**/*.scss'], gulp.series(['clean', 'scss', 'reload']))
    gulp.watch(['src/**/*.html'], gulp.series(['clean', 'html', 'reload']))
}))