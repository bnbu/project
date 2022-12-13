var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var path = require('path');
var fileUpload = require('express-fileupload');
/* var multer = require('multer');
var upload = multer({ dest : 'images/', limits : { fileSize : 10 * 1024 * 1024 }}); */
var fs = require('fs');
var path = require('path');
var app = express();



var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1q2w3e4r!',
    database : 'project',
    timezone: "Asia/Seoul"
})
connection.connect()

var server = app.listen(3001, () => {
    console.log('server is running in port 3001');
})

app.use(express.static(path.join(__dirname, 'project/build')));
/* app.use('/', (req, res, next) => {
    res.sendFile(path.join('index.html'))
}) */
app.use(express.json());
app.use(cors());
app.use(fileUpload({
    limits : { fileSize : 10 * 1024 * 1024 },
}));

var router = require('./routes/main')(app, fs, connection, path);

//connection.end() 끄지말것