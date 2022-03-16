const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var logger = require('morgan');
const path = require('path');
//const chalk = require('chalk');

var usersConnected = 0;

app.use(bodyParser.urlencoded({
  extended: true
}));
/*
var userRouter = require('./Routes/userRoutes');
var messageRouter = require('./Routes/messageRoutes');
*/
dotenv.config({path: '.env'});
const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 

 mongoose.connect(process.env.MONGODB_URI);
 mongoose.connection.on('error', (err) => {
   console.error(err);
   console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
   process.exit();
 });
*/

 //Primary app routes 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
});

app.get('/draw.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/draw.js');
});

app.get('/styles.css', (req, res) =>{
  res.sendFile(__dirname + '/public/css/styles.css');
});


app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection', (socket) => {
  console.log('User connected.');
  usersConnected += 1;
  io.emit('user connect', usersConnected);

  socket.on('line draw', (drawCoords) =>
  {
    io.emit('line draw', drawCoords);
  });

  socket.on('change color', (colorInfo) =>
  {
    //console.log(strokeStyle);
    io.emit('change color', colorInfo);
  })

  socket.on('clear canvas', () => io.emit('clear canvas'));
  
  socket.on('disconnect', () => {
    console.log('User disconnected.');
    usersConnected -= 1;
    io.emit('user disconnect', usersConnected);
  });
});
/*
io.on('connection', (socket) => {
  socket.on('chat message', (msg) =>
  {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  })
})

io.on('connection', (socket) => {
  socket.on('message load', (msg) =>
  {
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });
  socket.on('clear messages', (msg) =>
  {
    io.emit('clear messages', msg);
  })
})
*/

server.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', '✓', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});