require('dotenv').config();
const express=require("express");
const path=require("path");
const {json}=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const Register=require("../src/models/register");
const auth=require("./middleware/auth");
const cookieparser=require("cookie-parser");
const app=express();
const hbs=require("hbs");
const {urlencoded}=require("body-parser");
const bodyParser = require("body-parser");
const { static } = require("express");
const { dirname } = require("path");
const port =process.env.PORT ||4000;
const templates_path=path.join(__dirname,'../templates/views');
const partial_path=path.join(__dirname,'../templates/partials');
app.use(cookieparser());
 app.use(urlencoded({extended:false}));
 app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));
app.set('view engine','hbs');
app.set('views',templates_path);
hbs.registerPartials(partial_path);
require("./db/conn");
app.get("/home",function(req,res){
    res.render('home');
});
app.get("/marketplace",(req,res)=>{
    res.render('marketplace');
});
app.get("/login",(req,res)=>{
   res.render('login');
});
app.post("/login",async (req,res)=>{
   try{
   const email=req.body.email;
   const password=req.body.password;
   const usermail=await Register.findOne({email:email});
   const isMatch=await bcrypt.compare(password,usermail.password);
   console.log(isMatch);
   const token=await usermail.generateAuthToken();
   console.log(token);
   if(isMatch){
      
      res.status(201).render('home');
   }else{
      res.send("invalid login or password");
   }
   }catch(error){
      res.status(400).send(error);
      console.log(error);
   }
})
app.get("/signup",(req,res)=>{
   res.render('signup');
});
app.post("/signup",async (req,res)=>{
try{
  const password=req.body.password;
  const confirm_password=req.body.confirm_password;
  if(password==confirm_password){
     const kisan_Register=new Register({
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        password:password,
        confirm_password:confirm_password,
     })
    const token=await kisan_Register.generateAuthToken();
    console.log(token);
     const registered=await kisan_Register.save();
     res.status(201).render('home')
  }
  else{
     res.send("Password not matching");
  }
}catch(error){
   res.status(400).send(error);
   console.log(error);
}
});
app.get("/logout",auth,async (req,res)=>{
   try{
     res.clearCookie("jwt");
     req.user.token=req.user.tokens.filter((currentelement)=>{
      return currentelement.clearElement.token !=req.element
     });
        console.log("log-out");
        await req.user.save();
   } catch(error){
     res.status(500).send(error);
   }
 });
app.get("/items",(req,res)=>{
   res.render('items');
});
app.get("/crop",(req,res)=>{
   res.render('crop');
});
app.get("/request",(req,res)=>{
    res.render('request');
});
app.listen(port,function(req,res){
   console.log(`${port}`);
});

