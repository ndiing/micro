const http = require("http");
const crypto = require("crypto");
const EventEmitter = require("events");

/**
 * WebSocket class responsible for handling WebSocket connections.
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
    /**
     * Creates an instance of the WebSocket class.
     * @param {http.Server} [server] - The HTTP server to attach the WebSocket upgrade handler to.
     */
    constructor(server) {
        super();
        this.setMaxListeners(0);
        this.clients = new Map();
        this.upgrade = this.upgrade.bind(this);

        if (server===undefined||server===null) {
            server = http.createServer((req, res) => res.end(null));
            server.on("upgrade", this.upgrade);
            server.listen(80, () => console.log(server.address()));
        }
    }

    /**
     * Handles the WebSocket upgrade request.
     * @param {http.IncomingMessage} req - The HTTP request object.
     * @param {net.Socket} socket - The network socket between the server and client.
     * @param {Buffer} head - The first packet of the upgraded stream.
     */
    upgrade(req, socket, head) {
        const hash = crypto
            .createHash("sha1")
            .update(req.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
            .digest("base64");
        socket.write(["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", "Sec-WebSocket-Accept: " + hash].join("\r\n") + "\r\n\r\n");
        const id = crypto.randomUUID();
        const client = new EventEmitter();
        client.setMaxListeners(0);

        client.send = (data) => {
            const frame = this.encode(data);
            socket.write(frame);
        };

        client.close = () => {
            socket.end();
        };
        this.clients.set(id, client);
        this.emit("connection", client);
        client.emit("open");

        socket.on("data", (chunk) => {
            const message = this.decode(chunk);

            if (message === null) {
                socket.end();

                return;
            }
            client.emit("message", message);
        });

        socket.on("close", () => {
            this.clients.delete(id);
            client.emit("close");
        });

        socket.on("error", (err) => {
            client.emit("error", err);
        });
    }

    /**
     * Encodes data into a WebSocket frame.
     * @param {string|Buffer} data - The data to encode.
     * @returns {Buffer} The encoded WebSocket frame.
     */
    encode(data) {
        let payloadBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
        const length = payloadBuffer.length;
        let frame;
        let opcode = Buffer.isBuffer(data) ? 0x2 : 0x1;

        if (length < 126) {
            frame = Buffer.alloc(2 + length);
            frame[1] = length;
        } else if (length < 65536) {
            frame = Buffer.alloc(4 + length);
            frame[1] = 126;
            frame.writeUInt16BE(length, 2);
        } else {
            frame = Buffer.alloc(10 + length);
            frame[1] = 127;
            frame.writeBigUInt64BE(BigInt(length), 2);
        }
        frame[0] = 0b10000000 | opcode;
        payloadBuffer.copy(frame, frame.length - length);

        return frame;
    }

    /**
     * Decodes a WebSocket frame into data.
     * @param {Buffer} frame - The WebSocket frame to decode.
     * @returns {string|Buffer|null} The decoded data or null if the frame is a close frame.
     */
    decode(frame) {
        if (frame.length < 2) return null;
        const firstByte = frame[0];
        const opcode = firstByte & 0b00001111;
        const secondByte = frame[1];
        const masked = (secondByte & 0b10000000) !== 0;
        let payloadLength = secondByte & 0b01111111;
        let offset = 2;

        if (payloadLength === 126) {
            payloadLength = frame.readUInt16BE(offset);
            offset += 2;
        } else if (payloadLength === 127) {
            payloadLength = Number(frame.readBigUInt64BE(offset));
            offset += 8;
        }
        let payload = frame.slice(offset);

        if (masked) {
            const maskKey = payload.slice(0, 4);
            payload = payload.slice(4).map((byte, i) => byte ^ maskKey[i % 4]);
        }

        if (opcode === 0x8) {
            return null;
        }

        return opcode === 0x1 ? Buffer.from(payload).toString("utf8") : Buffer.from(payload);
    }
}

module.exports = WebSocket;
