require("./lib/crash.js");
require("./lib/env.js");
const WebSocket = require("./lib/web-socket.js");
const Router = require("./lib/router.js");
const { getCertsForHostname } = require("./lib/certificate.js");
const http = require("http");
const https = require("https");

const app = new Router();

app.use(async (req,res,next) => {
    try {
        if([
            'POST',
            'PUT',
            'PATCH',
        ].includes(req.method)){
            const chunks=[]
            for await (const chunk of req){
                chunks.push(chunk)
            }
            const buffer=Buffer.concat(chunks)
            const contentType = (req.headers['content-type']??'')
            if(contentType.includes('application/json')){
                req.body = JSON.parse(buffer)
            }
        }
        next()
    } catch (error) {
        next(error)
    }
})
app.use("/api", require("./api/index.js"));

const httpServer = http.createServer(app.request);
const httpsServer = https.createServer(getCertsForHostname(), app.request);

const socket = new WebSocket(false);

httpServer.on("upgrade", socket.upgrade);
httpsServer.on("upgrade", socket.upgrade);

httpServer.listen(process.env.HTTP_PORT, "0.0.0.0", () => console.log(httpServer.address()));
httpsServer.listen(process.env.HTTPS_PORT, "0.0.0.0", () => console.log(httpsServer.address()));
