const  Mongoose  = require("mongoose");
//mongodb connection code 
Mongoose.connect("mongodb://localhost:27017/chatting",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("connected successfully");
}).catch((e)=>{
    console.log(e);
});

