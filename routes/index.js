const express    = require("express"),
      router     = express.Router(),
      middleware = require("../middleware/index"),
      User       = require("../models/user"),
      Messages   = require("../models/message"),
      bcrypt     = require("bcryptjs"),
      passport   = require("passport");

router.get('/', (req, res) => {
    res.render('login');
})

router.get("/signup",(req,res)=>{
    res.render('register');
})

router.post("/signup",async (req,res)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashcode = bcrypt.hashSync(req.body.password, salt);    
        let user = await User.create({
            userName:req.body.username,
            email:req.body.email,
            password:hashcode,
        }); 
        req.logIn(user,function(err){  
            res.redirect("/home");
        });                   
    }
    catch(err){
        console.log(err);
        res.redirect("/signup");
    }    
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}))

router.get('/signout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

router.get('/home',middleware.isLoggedIn, async(req, res) => {
    try{
        let sentMessages= await Messages.find().where("from.id").equals(req.user._id);
        let receivedMessages=await Messages.find().where("to.id").equals(req.user._id);
        const messages = sentMessages.concat(receivedMessages)
        console.log(messages)
        res.render('home',{messages,userName:req.user.userName})
    
    }
    catch(err){
        console.log(err)
        res.redirect("/")
    }
})

module.exports=router;