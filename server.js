const express=require('express')
const svr=express()
const session=require('express-session')
const passport=require('./stratergies')
const http=require('http')
const socket=require('socket.io')
const { connectdb }=require('./database/db')

const server=http.createServer(svr)
const io=socket(server)

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

//middleware function to check if user is logged in
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

svr.post('/signup', (req, res) => {
    console.log(req.body);
    let nuser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    connectdb('chatApp')
        .then(db => db.collection('users').insertOne(nuser))
        .then(() => res.redirect('/login'))
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

//socketio implementation for realtime chat
io.on('connection', (socket)=>{
    socket.on('chatsend', (data)=>{
        const newMsg={
            from: data.from,
            to: data.to,
            message: data.msg
        }
        console.log(newMsg);
        connectdb('chatApp')
        .then(db => db.collection('messages').insertOne(newMsg))
        .catch(err => {
            console.log(err)
            res.send(err)
        })
        io.emit('chat_display', {
            from: data.from,
            to: data.to,
            message: data.msg
        })
    })
})

server.listen(SERVER_PORT, () => {
    console.log('started at http://localhost:3000/');
})