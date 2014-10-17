var express = require('express');
var api = require('./api');
var users = require('./accounts')
var app = express();

app
  .use(express.static('./public'))
  .use(users)
  .use('/api', api)
  .get('*', function (req, res) {
    if (!req.user) {
      return res.redirect('/login')
    } else {
      return res.sendfile('public/main.html');
    }
  })
  .listen(3000);
