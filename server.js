const express = require('express');
const svr = express();

svr.get('/', (req, res) => {
    res.send('hello!');
})

svr.listen('3000', () => {
    console.log("Server started at http://localhost:3000/");
})