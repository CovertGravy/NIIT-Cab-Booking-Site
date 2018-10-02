const express = require('express');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./server/routes/route.js');

const app = express();

mongoose.connect('mongodb://localhost/bookcab');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client')));
app.use('/', routes);

const server = http.createServer(app);
const io = require('socket.io')(server);

io.set('heartbeat timeout', 2000);
io.set('heartbeat interval', 500);

io.on('connection', function(socket) {
  console.log('new user');
  socket.on('drivers location', function(data) {
    socket.broadcast.emit('drivers location', {
      lat: data.lat,
      lng: data.lng,
      email: data.email,
      cab: data.cab
    });
  });

  socket.on('user connected', function(data) {
    socket.broadcast.emit('user connected', { user: data.user });
  });

  socket.on('book info', function(data) {
    socket.broadcast.emit('book info', {
      user: data.user,
      pickup: data.pickup,
      fare: data.fare,
      destination: data.destination
    });
  });

  socket.on('driver info', function(data) {
    socket.broadcast.emit('driver info', {
      driver: data.driver,
      pickup: data.pickup,
      destination: data.destination,
      fare: data.fare
    });
  });

  socket.on('ride reject', function(data) {
    socket.broadcast.emit('ride reject', {
      ride: data.ride
    });
  });

  socket.on('disconnect', function(data) {
    console.log('no user');
    socket.broadcast.emit('no driver', { stat: data.stat });
  });
});
server.listen(3000, (req, res) => {
  console.log('Server is running ...');
});
