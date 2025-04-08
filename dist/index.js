function init() {
    const client = new WebSocket("ws://localhost");
    client.addEventListener("close", (event) => {
        console.log(event);
        setTimeout(init, 1000);
    });
    client.addEventListener("error", console.log);
    client.addEventListener("message", (event) => {
        console.log(event);
        // client.close()
    });
    client.addEventListener("open", (event) => {
        console.log(event);
        client.send(JSON.stringify({ message: "from client" }));
    });
}
init();
