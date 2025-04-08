const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class File {
    static read(filename) {
        let data;
        try {
            data = fs.readFileSync(filename);
            if (/\b\.gz\b/.test(filename)) {
                data = zlib.gunzipSync(data);
            }
            if (/\b\.json\b/.test(filename)) {
                data = JSON.parse(data);
            }
        } catch (error) {}
        return data;
    }

    static write(filename, data) {
        const dirname = path.dirname(filename);
        try {
            fs.readdirSync(dirname);
        } catch (error) {
            fs.mkdirSync(dirname);
        }
        if (/\b\.json\b/.test(filename)) {
            data = JSON.stringify(data);
        }
        if (/\b\.gz\b/.test(filename)) {
            data = zlib.gzipSync(data);
        }
        fs.writeFileSync(filename, data);
    }
}

module.exports = File;
