const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');

const ejs=require('ejs');
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(session({
    secret:"our little secret",
    resave:false,
    saveUninitialized:false
  }))
  app.use(passport.initialize());
  app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDb",{useNewUrlParser:true});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);

const user=new mongoose.model("user",userSchema);
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get("/",function (req,res) {
    res.render('home');
})
app.get("/login",function (req,res) {
    res.render('login');
})
app.get("/register",function (req,res) {
    res.render('register');
});
app.post("/login",function (req,res) {
 
})
app.get("/secrets",function (req,res) {
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
})
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
})
app.post("/register",function (req,res) {
    user.register({username:req.body.username},req.body.password,function(err,result){
        if(err){
            console.log('error');
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/secrets');
            })
        }
    })
    app.post("/login",function (req,res) {
        const user=new user({
            username:req.body.username,
            password:req.body.passowrd
        })
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })


})
app.listen(3000,function () {
    console.log('server has started at port 3000');
})

