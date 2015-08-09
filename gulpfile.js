var gulp = require('gulp');

// auto-load gulp-* plugins
var $ = require('gulp-load-plugins')();

//
// all others
var del = require('del');
var autoprefixer = require('autoprefixer-stylus');
var assemble = require('assemble');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var merge = require('merge2');
var runSequence = require('run-sequence');

var config = require('./config.json');
var paths = config.paths;
var production = $.util.env.p || $.util.env.prod;

// autoprefixer settings
var Browsers = config.browsers;

var templateData = require('./data.json');

var stylusOptions = {
    use: [autoprefixer({browsers: Browsers})],
    paths: [paths.css.src],
    import: ['_vars'],
    compress: !!production
};


//
// styles
gulp.task('styles', function () {
    return gulp.src([ paths.css.src + '/main.styl' ])
        .pipe($.plumber())
        .pipe($.stylus(stylusOptions))
        .pipe(gulp.dest(paths.css.dest));
});


//
// inline styles

// inline
gulp.task('inject', function () {
    return gulp.src('./public/*.html')
        .pipe($.inlineCss({
            removeStyleTags: false,
            applyStyleTags: false
        }))
        .pipe(gulp.dest('public/'));
});

// full task
gulp.task('inline', ['inject'], function(cb){
    return del([
        paths.css.dest
    ], cb);
});


//
// compile hbs templates

// assemble setup
assemble.layouts('./templates/layouts/*.hbs');
assemble.partials('./templates/partials/*.hbs');

// render
gulp.task('render', function () {
    gulp.src('./templates/email/*.hbs')
        .pipe($.assemble(assemble, {
            layout: 'default'
        }))
        .pipe($.extname())
        .pipe(gulp.dest('public/'));
});


//
// images
gulp.task('images', function(){
    return gulp.src(paths.img.src + '/**')
        .pipe(gulp.dest(paths.img.dest));
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
gulp.task('clean', function(cb){
    return del([
//        'public/*.json'
        'public/*.html',
        paths.css.dest,
        paths.img.dest
    ], cb);
});


//
// build
gulp.task('build', ['clean'], function(){
    runSequence(
        'render',
        'styles',
        'images',
        'inline'
    );
});


//
// build
gulp.task('dev', ['clean'], function(){
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
//            gulp.watch('./src/*.html', ['html']);
//            gulp.watch('./data.json', ['bs-reload']);
            gulp.watch('./templates/**/*.*', ['render']);
            gulp.watch('./' + paths.css.src + '/**/*.styl', ['styles']);
        });
});
