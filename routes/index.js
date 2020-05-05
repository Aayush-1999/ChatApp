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

router.get('/home',middleware.isLoggedIn, (req, res) => {
    // Messages.find().where()
    connectdb('chatApp')
        .then(db => db.collection('messages').find( { $or: [ {to : req.user[0].username}, { from: req.user[0].username } ] }            ))
        .then(msgs => msgs.toArray())
        .then((msgs) => {
            console.log(msgs) 
            res.render('home', {username: req.user[0].username, msgs: msgs})
    })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

module.exports=router;