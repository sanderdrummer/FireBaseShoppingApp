var gulp = require('gulp');
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var less = require('gulp-less-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

// compile and concat less
gulp.task('less', function() {
    gulp.src('./less/main.less')
        .pipe(less({
            sourceMap: {
                sourceMapRoothpath: './less/'
            }
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist'));
});

gulp.task('lib', function(){
    gulp.src([
        './lib/advocatRouter.js',
        './lib/angular.min.js',
        './lib/firebase.js',
        './lib/angularfire.min.js',
        './lib/modules.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
    es.merge(
        getTemplateStream(),
        gulp.src('./src/**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
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
            moduleName: 'CompiledTemplates',
            declareModule: false
        }));
}

gulp.task('default', function() {
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.html', ['js']);
    gulp.watch('./less/**/*.less', ['less']);
});
