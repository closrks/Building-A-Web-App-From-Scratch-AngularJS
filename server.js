var express = require('express');
var api = require('./api');
var app = express();

app
  .use(express.static('./public'))
  .use('/api', api)
  .get('*', function (req, res) {
    return res.sendfile('public/main.html');
  })
  .listen(3000);
