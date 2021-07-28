var express = require("express");

var router = express.Router();
const bcrypt = require('bcrypt');
require("../config/md-connect");
const user = require("../models/users");
const passport=require("passport");
const User = require("../models/users");
require('../config/passportlocal')(passport);
const multer = require('multer');
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
				//console.log(e);
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
		successFlash: 'Welcome!',
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
//edit users 
router.get('/edit_users/:id/edit',checkAuth,async(req,res,next)=>{
var data=await User.findOne({"_id":req.params.id});
const edit_data=({
	_id:data.id,
	username:data.username,
	email:data.email,
	mobile:data.mobile,
});
    res.render('user/edit_profile', {
		name:"Edit Profile",
		udata:edit_data,
		crfToken:req.csrfToken(),
	});
});
//for upload
var storage =   multer.diskStorage({  
	destination: function (req, file, callback) {  
	  callback(null, './uploads');  
	},  
	filename: function (req, file, callback) {  
	  callback(null, file.originalname);  
	}  
  });  
  var upload = multer({ storage : storage}).single('myfile');  
//update user data
router.post('/update_users',checkAuth,async(req,res)=>{
	console.log(req);
	User.findOne({"_id":req.query._id})
    .then((User) => {
      if (!User) {
        req.flash("error_msg", "user not found");
        //res.redirect("/users/doctor-profile");
      }
      if (typeof req.query.mobile !== "undefined") {
        User.mobile = req.query.mobile;
      }
	  if (typeof req.query.myfile !== "undefined") {
        User.profileimage = req.query.myfile;
      }  
	  User.save(function (err, resolve) {
		if(err)
		  console.log('db error', err)
		   else{
			upload(req,res,function(err) {  
				if(err) {  
					return res.end("Error uploading file.");  
				}  
			});  
			req.flash("success_msg", "details updated successfully");
			res.redirect("get_all_users");
		   }
		 });
     
      })
    .catch((err) => console.log(err));	
});


//wild card roughting
router.get('*',(req,res)=>{
	var reqobj={
		"status" : 400,
		"message" : "URL Not Found for ,Get request Abhinav"
	}
res.send(reqobj);
});
router.put('*',(req,res)=>{
	var reqobj={
		"status" : 400,
		"message" : "URL Not Found for ,Put request Abhinav"
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