var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var nodeAnnotation = require('node-annotation');

var fs = require('fs');
var Path = require('path');

nodeAnnotation.setLogger(true);
    // nodeAnnotation.configurePath(Path.join(cwd, 'src', 'webApp', 'resource'));
nodeAnnotation.start([
    Path.join(__dirname, 'src'), 
    Path.join(__dirname, 'node_modules', 'node-annotation-extend', 'src')
    ], function() {
    var app = express();

    app.set('views', Path.join(__dirname, '/src/views'));
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(Path.join(__dirname, 'public')));
    app.use('/prd', express.static(Path.join(__dirname, 'prd')));
    nodeAnnotation.app(app);
    //初始化数据库
    var sequelizeDB = require("./src/js/dao/mysql/common/sequelizeDB.js");
    var server = app.listen(3939, function() {
        console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    });
});
