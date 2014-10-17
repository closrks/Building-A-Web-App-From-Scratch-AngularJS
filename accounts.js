var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var Bourne = require('bourne');
var crypto = require('crypto');

var router = express.Router();
var db = new Bourne('users.json');

function hash (password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router
  .use(bodyParser.urlencoded())
  .use(bodyParser.json())
  .use(session({ secret: 'doggyday' }))
  .get('/login', function (req, res) {
    res.sendfile('public/login.html');
  })
  .post('/login', function (req, res) {
    var user = {
      username: req.body.username,
      password: hash(req.body.password)
    };
    db.findOne(user, function (err, data) {
      if (data) {
        req.session.userId = data.id;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    });
  })
  .post('/signup', function (req, res) {
    var user = {
      username: req.body.username,
      password: hash(req.body.password),
      options: {}
    };

    db.find({ username: user.username }, function (err, data) {
      if (!data.length) {
        db.insert(user, function (err, data) {
          console.log('insert')
          req.session.userId = data.id;
          res.redirect('/');
        })
      } else {
        res.redirect('/login');
      }
    })
  })
  .get('/logout', function (req, res) {
    req.sesions.userId = null;
    res.redirect('/');
  })
  .use(function (req, res, next) {
    // quickest way to get user info
    if (req.session.userId) {
      db.findOne({ id: req.session.userId }, function (err, data) {
        req.user = data;
      });
    }
    next();
  });

module.exports = router;
