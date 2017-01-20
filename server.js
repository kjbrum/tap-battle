var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/battle', function(req, res, next) {
    res.sendFile(__dirname + '/battle.html');
});

app.get('/remote', function(req, res, next) {
    res.sendFile(__dirname + '/remote.html');
});

server.listen(port);

io.on('connection', function(client) {
    console.log('connected');

    client.on('createUser', function(data) {
        console.log('User created: ' + data);
    });

    client.on('tap', function(data) {
        console.log('tap');
        io.emit('tap', true);
    });

    client.on('remoteConnected', function(data) {
        console.log('remoteConnected: ' + data);
        io.emit('remoteConnected', data);
    });

    client.on('disconnect', function(data) {
        console.log('disconnected');
        io.emit('remoteConnected', false);
    });
});
