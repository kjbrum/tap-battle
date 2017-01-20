var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/battle', function(req, res, next) {
    res.sendFile(__dirname + '/battle.html');
});

app.get('/remote', function(req, res, next) {
    res.sendFile(__dirname + '/remote.html');
});

server.listen(3000);

io.on('connection', function(client) {
    client.on('createUser', function(data) {
        console.log('User created: ' + data);
    });

    client.on('tap', function(client) {
        io.emit('tap', true);
    });

    io.emit('remoteConnected', { connected: true });

    client.on('disconnect', function(client) {
        console.log('disconnected');
        io.emit('remoteConnected', { connected: false });
    });
});
