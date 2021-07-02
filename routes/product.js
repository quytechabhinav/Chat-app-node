var express = require("express");
var validation =require("validation");
var router =express.Router();

// /product/get_all_product

router.get('/get_all_product',(req,res)=>{
//res.send("get all product page router");
res.render("product/allproduct",{
    name:"Product Summary",
  });
});
//import excell
router.get('/create_salary_slip',(req,res)=>{
	//res.send("get all product page router");
	res.render("sallary/addexcel",{
		name:"Add Excel",
	  });
	});
// /product/products details

router.get('/get_product_details/:id',(req,res)=>{
	res.send("product details page "+req.params.id);
});

router.use('/add_product',function (req,res,next) {
console.log("middleware call");
next();
});
router.post('/add_product',(req,res)=>{
	res.send("add new product");
});

router.post('/add_product_to_catr/:product_id',(req,res)=>{
	res.send("add product to catd "+req.params.product_id);
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
