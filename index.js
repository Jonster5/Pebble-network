/** Class for creating servers, serving static pages, and controlling websockets */
exports.Pebble = {
    /**
     * Creates a new HTTP server and serves a static folder
     * @param {string} static_url 
     * @param {number} port 
     */
    initServer: function(static_url = "", port = 1337) {
        this.staticURL = static_url;
        this.port = 1337;

        this._express = require('express');
        let app = this._express();
        let serv = app.listen(this.port);
        app.use(this._express.static(this.staticURL));
        this.server = serv;
    },
    initSockets: function() {
        if (this.server === undefined) throw new Error('call Pebble.initServer(...) before using this function');
        this.clients = [];
        this.wsServer = new require('websocket').server({
            httpServer: this.server
        });
    },
    request: function(request) {
        if (this.wsServer === undefined) throw new Error('call Pebble.initServer(...) before using this function');
        this.wsServer.on('request', req => {
            this.clients.push({
                connection: req.accept(null, req.origin),
                clientID: req.key,
            });
        });
    }
}

let clients = [];

wsServer.on('request', req => {
    let connection = req.accept(null, req.origin);
    clients.push({
        connection: connection,
        clientID: req.key
    });
    console.log(`client connected: ${clients[clients.length - 1].clientID}`);
    console.log(clients.length);
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