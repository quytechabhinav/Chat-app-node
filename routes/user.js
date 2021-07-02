var express = require("express");

var router = express.Router();
const bcrypt = require('bcrypt');
require("../config/md-connect");
const user = require("../models/users");
const passport=require("passport");
const User = require("../models/users");
require('../config/passportlocal')(passport);
const app = express();

// /user/singhup
router.get('/login',(req,res)=>{
	res.render("index",{
		name:"User Login",
		crfToken:req.csrfToken(),
	  });
});

router.get('/singhup',(req,res)=>{
    res.render('user/singhup',{
        name:'Sign up',
		crfToken:req.csrfToken(),
    });
});

router.post('/singhup',async(req,res)=>{
	const {username,email,mobile,password}=req.body;
	if(!email || !username || !mobile ||!password){
		res.render('user/singhup',{
					 valid:"All fields are required !",
					 crfToken:req.csrfToken(),
					});
	}
	else{
		var userdata=await User.findOne({
			$or:[{email:req.body.email},{mobile:req.body.mobile},{username:req.body.username}]
		});
		if(userdata){
			res.render('user/singhup',{
				valid:"Email Or Mobile No or User Name already exit !",
				crfToken:req.csrfToken(),
			   });
		}
		else{
				try{
				const hashedpassword = await bcrypt.hash(req.body.password,10);
				const adduser = new user({
					username : req.body.username,
					email : req.body.email,
					mobile : req.body.mobile,
					password :hashedpassword
				})
				const savedata = await adduser.save();
				res.redirect('/');
			}
			catch(e) {
				console.log(e);
			}
		}
	}			
});

//login handling
router.post('/passportlogin',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect:'get_all_users',
		failureRedirect:'/'	,
		failureFlash:true,	
	})(req,res,next);
	});
	//logout
	router.get('/logout',(req,res)=>{
		req.logOut();
		req.session.destroy((error)=>{
			res.redirect('/');
		})
	})
	//auth for check user is login or not
	function checkAuth(req,res,next){
		if(req.isAuthenticated()){
			res.set(
				'Cache-Control', 'private, no-cache, no-store, must-revalidate,post-cache=0,pre-cache=0'
			);
			next();
		}
		else{
			res.redirect('/');
		}
	}
//get all user list
router.get('/get_all_users',checkAuth,async(req,res,next)=>{
	var userlist=await User.find().lean();
	res.render("user/users_list",{
		name:"All User",
		userdata:userlist,
		crfToken:req.csrfToken(),
	  });
});



//wild card roughting
router.get('*',(req,res)=>{
	var reqobj={
		"status" : 400,
		"message" : "URL Not Found for ,Get request"
	}
res.send(reqobj);
});
router.post('*',(req,res)=>{
var reqobj={
		"status" : 400,
		"message" : "URL Not Found for ,Get request"
	}
res.send(reqobj);});
module.exports=router;