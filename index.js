const express = require("express");
const hb = require("hbs");
var exphbs = require('express-handlebars');
var path = require("path");
var product = require('./routes/product');
var chating = require('./routes/chating');
var user= require('./routes/user');
const passport= require("passport");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const expresssession = require("express-session");
const csrf=require("csurf");
const flash=require("connect-flash");
const { Socket } = require("dgram");
var helpers = require('handlebars-helpers')();
const app =express();

var hbs= exphbs.create({
  extname:'.hbs',
  defaultLayout:null ,
  layoutsDir:path.join(__dirname + '/views/layouts'),
  helpers: helpers,
  partialsDir:[
    path.join(__dirname + '/views/layouts')
  ],

})

const urlencoded = bodyParser.urlencoded({extended : true});
app.use(bodyParser.json());
app.use(urlencoded);
//passport config
require("./config/passportlocal")(passport);

//port config
const port =process.env.port || 8000;

app.use(express.static('views/assets')); 

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
//for auth and csrf token
app.use(cookieparser("randomKey"));
app.use(expresssession({
  secret:"randomKey",
  resave:true,
  saveUninitialized: true,
  maxAge :24*60*60*1000,//milli second
}));
app.use(csrf({cookie: false,}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
  res.locals.error =req.flash("error");
next();
});

//router config
app.use('/product',product);
app.use('/user',user);
app.use('/chating',chating);


app.get('/',(req,res)=>{
 
    
	res.render("index",{
    name:"User Login",
    crfToken:req.csrfToken(),
  });
})

//for app listner
var server=app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//socket code

var io = require('socket.io')(server);
io.on('connection', (Socket) => {
   console.log("Socket server connected..");
   Socket.on('message',(msg)=>{
    console.log(msg);
    Socket.broadcast.emit('message',msg);
   })

  
  });
