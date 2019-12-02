const webSocketServer = require('websocket').server;
const express = require('express');
let app = express();
let server = app.listen(1337);
app.use(express.static('public'));

let wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', req => {
    let connection = req.accept(null, req.origin);
    console.log(`socket connected ${req.key}`);
    connection.on('message', message => {
        if (message.type === 'utf8') {
            console.log(message.utf8Data);
            console.log(req.eventNames())
            connection.send("hello there!");
        }
    });

    connection.on('close', connection => {
        console.log(`socket closed ${req.key}`);
    });
});