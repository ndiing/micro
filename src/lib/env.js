const fs = require("fs");
const path = require("path");

global.env={}

const data = JSON.parse(fs.readFileSync("./env.json"));

for (const name in data) {
    const value = data[name];

    global.env[name] = value;
}
