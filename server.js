// MODULES
let express = require('express');
let app = express();
let server = require('http').createServer(app)
let http = require('http');
let io = require('socket.io').listen(server);
let moment = require("moment");
let hour = moment().format('h:mm:ss');
console.log(hour);

// USER NUMBER & CONNECTIONS
users = [];
connections = [];

// SERVER 
server.listen(process.env.PORT || 3000);
console.log('System online');

// ROUTE 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

// SOCKET IO
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected : %s Simplonien connecté', connections.length)

    // DISCONNECTED
    socket.on('disconnect', function (data) {
        // if (!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1)
        console.log('Disconnected : %s Simplonien connecté', connections.length);
    });

    // SEND MESSAGE
    socket.on('send message', function (data) {
        io.sockets.emit('new message', { msg: data, user: socket.username, hour: hour });
        console.log(data);
    });

    // NEW SIMPLONIEN
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
});


