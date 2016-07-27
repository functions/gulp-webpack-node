var Path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var config = require('./resource/config.json');

/**************************
 *          webpack       *
 **************************/
gulp.task('webpack', function() {
    var webpackConfig = require('./webpack.config');
    var gulpWebpack = require('gulp-webpack');
    var dir = Path.join('static', 'build');

    return gulp.src(dir)
               .pipe(clean())
               .pipe(gulpWebpack(webpackConfig))
               .pipe(gulp.dest(dir));
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
        contentBase: config.devServerUrl,
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        noInfo: false,
        historyApiFallback: true,
        proxy: { '*': config.devServerUrl }
    }).listen(3000, 'localhost', function(err) {
        if (err) console.log(err);
        console.log('Listening at localhost:3000');
        open('http://127.0.0.1:3000/webpack-dev-server/');
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
    return gulp.src(Path.join(__dirname, 'profiles', env, '*'))
               .pipe(gulp.dest(Path.join(__dirname, 'resource')));
});
/**************************
 *          Main          *
 **************************/
gulp.task('dev', ['copyProfile', 'webpack-dev-server']);
gulp.task('beta', ['webpack']);
gulp.task('prod', ['webpack']);
