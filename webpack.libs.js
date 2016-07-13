/**
 * configuration description
 * https://github.com/webpack/docs/wiki/configuration#configuration-object-content
 * webpack document
 * http://webpack.github.io/docs/
 */
'use strict'
var webpack = require('webpack');
var Path = require('path');

//提取css独立成文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractSCSS = new ExtractTextPlugin('[name].min.css');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var libsPath = Path.join(__dirname, 'static', 'libs');

module.exports = {
    //生成sourcemap,便于开发调试
    devtool: "source-map",
    //获取项目入口js文件
    entry: {
        'react': libsPath + '/react.js',
        'react-dom': libsPath + '/react-dom.js',
        'react-router': libsPath + '/react-router.js',
        'antd': libsPath + '/antd.js'
    },
    output: {
        //文件输出目录
        path: Path.join(__dirname, 'static', 'libs'),
        //根据入口文件输出的对应多个文件名
        filename: '[name].min.js'
    },
    resolve: {
        extensions: ['', '.js', '.scss', '.json', '.jsx', '.css']
    },
    //各种加载器，即让各种文件格式可用require引用
    module: {
        loaders: [
            //.js 或 .jsx 文件使用 babel-loader 来编译处理
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'],
                include: [Path.join(__dirname, 'static', 'libs')]
            },
            //.css 文件使用 style-loader、 css-loader 和 autoprefixer-loader 来处理
            // style-loader:将css插入到页面的style标签,由于使用该loader会报错，故不用
            // css-loader:处理css文件中的url()等
            {
                test: /\.css$/,
                loader: 'css!autoprefixer'
            },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            //.scss 文件使用 style-loader、css-loader、autoprefixer 和 sass-loader 来编译处理
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader:  extractSCSS.extract('css!autoprefixer!sass?sourceMap')
            }
        ]
    },
    plugins: [
        new ProgressPlugin(function(percentage, msg) {
            console.log(parseInt(percentage * 100) + '%', msg);
        }),
        extractSCSS,
        //js文件的压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
