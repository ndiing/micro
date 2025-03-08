const { WebSocketServer } = require("ws");

function createWebSocketServer() {
    const ws = new WebSocketServer({ noServer: true });

    ws.on("connection", (req, client) => {
        client.on("close", console.log);

        client.on("error", console.log);

        client.on("message", (data) => {
            console.log(data.toString());
        });

        client.on("open", console.log);

        client.send("from server");
    });

    return (req, socket, head) => {
        ws.handleUpgrade(req, socket, head, (client) => {
            ws.emit("connection", req, client);
        });
    };
}

module.exports = createWebSocketServer;
