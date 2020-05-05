const express   = require('express'),
    app         = express(),
    socket      = require('socket.io'),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("./routes/passport/setup");

require("dotenv").config();

server = app.listen(process.env.PORT || 3000)
const io = socket(server)

const indexRoute = require("./routes/index")

mongoose.connect(process.env.DATABASEURL,{useUnifiedTopology: true, useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use('/', express.static(__dirname + '/public'))

passport(app);

app.use("/",indexRoute);

io.on('connection', (socket)=>{
    socket.on('chatsend', (data)=>{
        const newMsg={
            from: data.from,
            to: data.to,
            message: data.msg
        }
        console.log(newMsg)
        connectdb('chatApp')
        .then(db => db.collection('messages').insertOne(newMsg))
        .catch(err => {
            console.log(err)
            res.send(err)
        })
        .then(()=>{
            io.emit('chat_display', {
                from: data.from,
                to: data.to,
                message: data.msg
            })
        })
    })
})