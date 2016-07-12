var Path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');

/**************************
 *          webpack       *
 **************************/
gulp.task('webpack', function() {
    var webpackConfig = require('./webpack.config');
    var gulpWebpack = require('gulp-webpack');
    var dir = Path.join('static', 'build');

    return gulp
        .src(dir)
        .pipe(clean())
        .pipe(gulpWebpack(webpackConfig))
        .pipe(dir);
});
/**************************
 *    webpack-dev-server  *
 **************************/
gulp.task('webpack-dev-server', function() {
    //start webpack develop server
    var webpackConfig = require('./webpack.dev.config');
    var WebpackDevServer = require('webpack-dev-server');
    var webpack = require('webpack');

    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        noInfo: false,
        historyApiFallback: true,
        proxy: [{
            path: /^\/f\//,
            ignorePath: true,
            target: 'http://127.0.0.1:3000/html/index.html'
        }]
    }).listen(3000, 'localhost', function(err, result) {
        if (err) console.log(err);
        console.log('Listening at localhost:3000');
    });
});
/**************************
 *  webpack build libs    *
 **************************/
gulp.task('webpack-build-libs', function() {
    var webpackConfig = require('./webpack.libs');
    var gulpWebpack = require('gulp-webpack');
    var dir = Path.join(__dirname, 'static', 'libs');

    return gulp
        .src(dir)
        .pipe(clean())
        .pipe(gulpWebpack(webpackConfig))
        .pipe(dir);
});
/**************************
 *      copy profiles     *
 **************************/
gulp.task('copyProfile', function() {
    var allowEnv = ['dev', 'beta', 'prod'];
    var env = process.argv[2] || allowEnv[0];
    if (allowEnv.indexOf(env) === -1) {
        env = allowEnv[0];
    }
    return gulp.src(Path.join(__dirname, 'src', 'profiles', env, '*'))
               .pipe(gulp.dest(Path.join(__dirname, 'resource')));
});
/**************************
 *          Main          *
 **************************/
gulp.task('default', function() {
    console.info('demo');
});
gulp.task('dev', ['copyProfile', 'webpack-dev-server']);
gulp.task('libs', ['webpack-build-libs']);
gulp.task('beta', ['webpack']);
gulp.task('prod', ['webpack']);
