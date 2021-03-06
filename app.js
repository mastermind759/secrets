require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");
const swal = require('sweetalert2');


console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
const userSchema = new mongoose.Schema({
    email : String,
    password : String
});


userSchema.plugin(encrypt,{secret : process.env.SECRET , encryptedFeilds:['password']});
const User = new mongoose.model("User",userSchema);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));


app.route("/")
.get(function(req,res){
    res.render("home");
});

app.route("/login")
.get(function(req,res){
    res.render("login");
})
.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username,password : password},function(err,foundItem){
      
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
            
        }
    });
});

app.route("/register")
.get(function(req,res){
    res.render("register");
})
.post(function(req,res) {
    const newuser = new User ({
        email : req.body.username,
        password : req.body.password
    });
    newuser.save(function(err){
        if(err){
            console.log(err);
        }else{
             res.render("login");
        }
    });

});


app.listen(3000,function() {
    console.log("server is started on on port 3000");
});