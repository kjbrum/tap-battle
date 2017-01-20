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

var users = [];

io.on('connection', function(client) {
    console.log('connected');

    // Create a user
    client.on('createUser', function(username) {
        console.log(users);
        var exists = false;
        if (users.length) {
            users.forEach(function(user) {
                if (user.username == username) {
                    exists = true;
                }
            });
        }

        if (!exists) {
            users.push({ username: username });
            console.log('User created: ' + username);
            io.emit('notification', { message: 'Success: User ' + username + ' successfully created!' });
        } else {
            console.log('User exists: ' + username);
            io.emit('notification', { message: 'Error: User ' + username + ' already exists!' });
        }

    });

    // Register a tap event
    client.on('tap', function(tap) {
        io.emit('tap', tap);
    });

    // Remote is connected
    client.on('remoteConnected', function(data) {
        console.log('remoteConnected: ' + data);
        io.emit('remoteConnected', data);
    });

    // Client disconnects
    client.on('disconnect', function(data) {
        console.log('disconnected');
        io.emit('remoteConnected', false);
    });
});
