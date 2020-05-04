const express=require('express')
const svr=express()
const session=require('express-session')
const passport=require('./stratergies')
const { connectdb }=require('./database/db')

const SERVER_PORT = process.env.PORT || 3000

svr.set('view engine', 'hbs')
svr.use('/', express.static(__dirname + '/public'))
svr.use(express.urlencoded({extended: true}))
svr.use(express.json())

svr.use(session({
    secret: 'kamehameha',
    resave: false,
    saveUninitialized: true,
}))

svr.use(passport.initialize())
svr.use(passport.session())

function checkLogin(req, res, next) {
    if(req.user) {
        return next()
    }
    else {
        res.send('<h1>Error 403</h1><h3>Login First!!<h3>')
    }
}

svr.get('/', (req, res) => {
    res.render('signup');
})

svr.get('/home', checkLogin, (req, res) => {
    res.render('home')
})

svr.post('/signup', (req, res) => {
    console.log(req.body);
    let nuser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    connectdb('chatApp')
        .then(db => db.collection('users').insertOne(nuser))
        .then(() => res.redirect('/'))
        .catch(err => {
            console.log(err)
            res.send(err)
        })
})

svr.get('/login', (req, res) => {
    res.render('login')
})

svr.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
}))

svr.get('/signout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

svr.listen(SERVER_PORT, () => {
    console.log('started at http://localhost:3000/');
})