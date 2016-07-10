var Path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');

/**************************
 *          webpack       *
 **************************/
gulp.task('webpack', function() {
    var webpackConfig = require('./webpack.config');
    var gulpWebpack = require('gulp-webpack');

    return gulp
        .src('build')
        .pipe(clean())
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest('./build'));
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
gulp.task('beta', ['webpack']);
gulp.task('prod', ['webpack']);
