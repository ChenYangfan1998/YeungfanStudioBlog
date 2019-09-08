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
const markdown = require('gulp-markdown')
const mdToBlog = require('./utils/md-to-blog')
const configToHomePage = require('./utils/config-to-home-page')


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
    gulp.src(['src/**/*.js', '!src/**/*.config.js'], )
        .pipe(gulp.dest('dist'))

    cb()
})

gulp.task('scss', function (cb) {

    const combined = combiner.obj([
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
    const combined = combiner.obj([
        gulp.src(['src/**/*.html', '!src/**/*.template.html', '!src/index.html']),
        htmlMini(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

gulp.task('md', function (cb) {
    const combined = combiner.obj([
        gulp.src('src/**/*.md'),
        markdown(),
        mdToBlog(),
        gulp.dest('dist')
    ])

    combined.on('error', handleError)
    cb()
})

// todo 压缩率比较低 ｜ 图片格式暂时先试了一下png
gulp.task('image', function (cb) {
    const combined = combiner.obj([
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

gulp.task('build-index-page', function (cb) {
    // const combined = combiner.obj([
    //     gulp.src('src/index.html'),
    //     configToHomePage(),
    //     gulp.dest('dist')
    // ])
    //
    // combined.on('error', handleError)
    // cb()

    gulp.src('src/index.html')
        .pipe(configToHomePage())
        .pipe(gulp.dest('dist'))
    cb()
})

gulp.task('build', gulp.series([
    'clean',
    gulp.parallel('js', 'scss', 'md', 'html', 'image'),
    'build-index-page'
]))

gulp.task('default', gulp.series('build', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })

    gulp.watch(['src/**/*.js'], gulp.series(['clean', 'js', 'reload']))
    gulp.watch(['src/**/*.scss'], gulp.series(['clean', 'scss', 'reload']))
    gulp.watch(['src/**/*.html', '!src/index.html'], gulp.series(['clean', 'html', 'reload']))
    gulp.watch(['src/**/*.md'], gulp.series(['clean', 'md', 'reload']))
    gulp.watch(['src/**/*.png'], gulp.series(['clean', 'image', 'reload']))
    gulp.watch(['src/**/*.config.json'], gulp.series(['clean', 'build-index-page', 'reload']))
    gulp.watch(['src/index.html'], gulp.series(['clean', 'build-index-page', 'reload']))

}))