console.log('Hola, Mundo!');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/cu.usbmodem1411', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Read the port data
port.on("open", () => {
  console.log('serial port open');
});

parser.on('data', data =>{
	console.log('got word from arduino:', data);
	io.emit('chat message', data);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});