var gulp = require('gulp');
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var less = require('gulp-less-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');


// compile and concat less
// gulp.task('aboutLESS', function() {
//     gulp.src('./common/Less/UeberUns.less')
//     .pipe(less({
//         sourceMap: {
//             sourceMapRoothpath: './common/Less/'
//         }
//     }))

//     .pipe(gulp.dest('./common/stylesheets/'));
// });

gulp.task('js', function() {
    es.merge(
        getTemplateStream(),
        gulp.src('./src/**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

function getTemplateStream() {

    // preCompile angularTemplates and write them to $templateCache
    // for better performance
    return gulp.src('./src/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: 'CompiledTemplates'
        }));
}

gulp.task('default', function() {
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.html', ['js']);
});
