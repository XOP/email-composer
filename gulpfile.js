var fs = require('fs');
var gulp = require('gulp');

// auto-load gulp-* plugins
var $ = require('gulp-load-plugins')();

//
// all others
var getTplData = require('./getTplData');
var del = require('del');
var browserSync = require('browser-sync');

var reload = browserSync.reload;
var runSequence = require('run-sequence');
var config = require('./config.json');

var paths = config.paths;
var production = $.util.env.p || $.util.env.prod;

// postcss settings
var autoprefixer = require('autoprefixer');
var Browsers = config.browsers;


//
// styles
gulp.task('styles', function () {
    return gulp.src(paths.css.src + '/main.scss')
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.postcss([
            autoprefixer({ browsers: Browsers })
        ]))
        .pipe(gulp.dest(paths.css.dest));
});


//
// replace in styles
gulp.task('replace', function (){
   return gulp.src('./build/**/*.css')
       .pipe($.plumber())
       .pipe($.replaceTask({
           patterns: [
               {
                   match: 'margin',
                   replacement: 'Margin'
               }
           ],
           usePrefix: false // off the @@ prefix rule
       }))
       .pipe(gulp.dest(paths.css.dest));
});


//
// inline styles

// inline
gulp.task('inject', function () {
    return gulp.src('./build/*.html')
        .pipe($.inlineCss({
            removeStyleTags: false,
            applyStyleTags: false
        }))
        .pipe(gulp.dest('build/'));
});

// full task
gulp.task('inline', ['inject'], function(cb){
    return del([
        paths.css.build
    ], cb);
});


//
// compile hbs templates
gulp.task('render', function () {
    var templateData = getTplData('./example-data/emails/default');

    return gulp.src('./templates/layouts/default.hbs')
        .pipe($.compileHandlebars(templateData, {
            batch: ['./templates/partials']
        }))
        .pipe($.extname('html'))
        .pipe(gulp.dest('public/'));
});


//
// images
gulp.task('images', function(){
    return gulp.src(paths.img.src + '/**')
        .pipe(gulp.dest(paths.img.dest));
});


//
// html minify
gulp.task('minify', function(){
    return gulp.src('./build/*.html')
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build/'));
});

//
// browser sync
gulp.task('sync', function(){
    browserSync.init({
        server: {
            baseDir: "./public",
            index: paths.index
        },
        files: ["public/**/*.*"],
        port: config.port
//        , logLevel: "debug"
    });
});

gulp.task('bs-reload', function(){
    reload();
});


//
// cleanup

// dev
gulp.task('clean-dev', function(cb){
    return del([
        'public/*.html',
        paths.css.dest,
        paths.img.dest
    ], cb);
});

// build
gulp.task('clean-build', function(cb){
    return del([
        'build/'
    ], cb);
});


//
// copy dev to build
gulp.task('copy', function(){
    return gulp.src('./public/**/*.*')
        .pipe(gulp.dest('build/'))
});


//
// build
gulp.task('build', ['clean-build'], function(){
    runSequence(
        'copy',
        'replace',
        'inline',
        'minify'
    );
});


//
// dev
gulp.task('dev', ['clean-dev'], function(){
    runSequence(
        'render',
        'styles',
        'images'
    );
});


//
// publish
gulp.task('publish', function(){
    gulp.src([
//            '!./public/exclude.me',
            './public/**'
        ])
        .pipe($.zip('project.zip'))
        .pipe(gulp.dest('./'));
});


//
// default
gulp.task('default', ['dev'], function(){
    runSequence(
        'sync',
        function(){
            gulp.watch('./templates/**/*.hbs', ['render']);
            gulp.watch('./data/**/*.json', ['render']);
            gulp.watch('./' + paths.img.src + '/**/*.*', ['images']);
            gulp.watch('./' + paths.css.src + '/**/*.styl', ['styles']);
        });
});
