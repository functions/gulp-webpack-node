var path = require('path');
var express = require('express');
var app = express();

// 静态资源目录；  TODO: 静态资源推荐走 CDN 
app.use('/static', express.static(path.join(__dirname, 'static')));

// 首页
app.get('/', require('server/js/controller/pageController').homepage);

var server = app.listen(8888, function () {
  var port = server.address().port;
  console.log('Example app listening at http://127.0.0.1:' + port);
});
