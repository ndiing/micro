const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync("./env.json"));

for (const name in data) {
    const value = data[name];

    process.env[name] = value;
}
