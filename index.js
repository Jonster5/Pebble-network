const webSocketServer = require('websocket').server;
const express = require('express');
let app = express();
let server = app.listen(1337);
app.use(express.static('public'));

let wsServer = new webSocketServer({
    httpServer: server
});

let clients = [];

wsServer.on('request', req => {
    let connection = req.accept(null, req.origin);
    clients.push({
        connection: connection,
        clientID: req.key
    });
    console.log(`client connected: ${clients[clients.length - 1].clientID}`);
    connection.on('message', message => {
        if (message.type === 'utf8') {
            clients.forEach(client => {
                client.connection.send(message.utf8Data);
            });
            console.log(clients.length);
        }
    });

    connection.on('close', connection => {
        console.log(`socket closed ${req.key}`);

        clients.splice(clients.length - 1, 1);
        if (clients > 0) {
            for (const client of clients) {
                console.log(client.clientID);
            }
        }
    });
});