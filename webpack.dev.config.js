/**
 * configuration description
 * https://github.com/webpack/docs/wiki/configuration#configuration-object-content
 * webpack document
 * http://webpack.github.io/docs/
 */
'use strict'
var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var Path = require('path');

var webpackHMR = [
    'webpack-dev-server/client?http://127.0.0.1:3000',
    'webpack/hot/dev-server'
];

module.exports = {
    //生成sourcemap,便于开发调试
    devtool: "source-map",
    //获取项目入口js文件
    entry: {
        //添加入口，以及HMR inline
        app: webpackHMR.concat('./static/js/app.js')
    },
    output: {
        //文件输出目录
        path: Path.join(__dirname, 'prd'),
        //用于配置文件发布路径，如CDN或本地服务器
        publicPath: '/prd/',
        //根据入口文件输出的对应多个文件名
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'style': Path.join(__dirname, 'static', 'style')
        },
        extensions: ['', '.js', '.scss', '.json', '.jsx', '.css']
    },
    //各种加载器，即让各种文件格式可用require引用
    module: {
        loaders: [
            //.js 或 .jsx 文件使用 babel-loader 来编译处理
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'],
                include: [Path.join(__dirname, 'static', 'js')]
            },
            //.css 文件使用 style-loader、 css-loader 和 autoprefixer-loader 来处理
            // style-loader:将css插入到页面的style标签,由于使用该loader会报错，故不用
            // css-loader:处理css文件中的url()等
            {
                test: /\.css$/,
                loader: 'style!css!autoprefixer'
            },
            {
                test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
                loader: 'url-loader?limit=100000'
            },
            //.scss 文件使用 style-loader、css-loader、autoprefixer 和 sass-loader 来编译处理
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ["style", "css?sourceMap", "autoprefixer", "sass?sourceMap"]
            },
            //.json 文件使用json-loader 来编译处理
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new ProgressPlugin(function(percentage, msg) {
            console.log(parseInt(percentage * 100) + '%', msg);
        }),
        //提取公共脚本，默认只有一个入口时可以不用，否则需要额外引入common.js
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        //增加公共头部
        new webpack.BannerPlugin(),
        //增加HMR(模块热插拔)
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
