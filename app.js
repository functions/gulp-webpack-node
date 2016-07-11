var path = require('path');
var express = require('express');
var app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(8888, function () {
  var port = server.address().port;
  console.log('Example app listening at http://127.0.0.1:' + port);
});
