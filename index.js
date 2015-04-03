var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./models');
var Hashids = require('hashids');

app.use(express.static(__dirname + '/public'));

var hashids = new Hashids('this is my salt');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
  res.render('index');
})

app.post('/urls',function(req,res){
  var userInput = (req.body);
  db.link.create({url:userInput.url}).then(function(user){
    var userHash;
    var clicks = 0;
    userHash = hashids.encode(user.id);
    user.updateAttributes({hash:userHash});
    user.updateAttributes({click:clicks});
    res.render('urls/show',{hash:userHash});
  });
})

app.get('/urls/list',function(req,res){
  db.link.findAll().then(function(links){
    res.render('urls/list',{linkKey:links});
  })
})

app.get('/:userhash',function(req,res){
  db.link.find({where: {hash:req.params.userhash}}).then(function(user){
    user.click += 1;
    user.save().then(function(){
      res.redirect(user.url);
    })
  })
})

app.listen(process.env.PORT || 3000,function(){
  console.log('Server is listening at port 3000')
})