var express = require("express");

var router = express.Router();
require("../config/md-connect");
const User = require("../models/users");
const app = express();
//for socket cahting


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
router.get('/',checkAuth,async(req,res,next)=>{
    var userlist=await User.find().lean();
    res.render("chating/index",{
        name:"Start Chating",
        crfToken:req.csrfToken(),
        username:req.user.username,
        userlist:userlist,
      });
    });
    module.exports=router;
