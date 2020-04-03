var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{
  User.findOne({username: req.body.username})
  .then((user)=>{
    if(user){
      var err =new Error('username already exist .');
      res.statusCode = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password 
      })
      .then((user)=>{
        res.statusCode=200;
        res.setHeader('content-type','application/json');
        res.json({status:'registration succesfully',user: user});
      })
      .catch((err)=>next(err))
    }
  })
  .catch((err)=> next(err));
});

router.post('/login',(req,res,next)=>{ console.log(req.session);
  if(!req.session.user){
    var authHeader = req.headers.authorization;
    if(!authHeader){
      var err = new Error('You are not authenticated');
  
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
  
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: req.body.username})
    .then((user)=>{
      if(!user){
        var err =new Error('username do not exist .');
        res.statusCode = 403;
        return next(err);
      }
      else {
        if(user.password === password){
          req.session.user = 'authenticated';
          res.statusCode=200;
          res.setHeader('content-type','text/plain');
          res.end('you are authenticated');
        }
        else{
          var err = new Error('password not match');
          err.status = 403;
          return next(err);
        }
      }
    })
    .catch((err)=>next(err));
  }
  else{
    res.statusCode=200;
    res.setHeader('content-type','text/plain');
    res.end('you are already authenticated');
  }
});

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('you are not login');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
