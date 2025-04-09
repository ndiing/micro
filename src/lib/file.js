const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/**
 * File class provides methods for reading and writing files,
 * including support for JSON and compressed (.gz) files.
 */
class File {
    /**
     * Reads a file synchronously. If the file is compressed (.gz), it decompresses it.
     * If the file is a JSON file, it parses the contents.
     * @param {string} filename - The file path to read.
     * @returns {Buffer|Object|string} The file content, parsed if JSON, decompressed if .gz.
     */
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

    /**
     * Writes data to a file synchronously. Supports JSON serialization and gzip compression.
     * Creates the necessary directories if they do not exist.
     * @param {string} filename - The file path to write.
     * @param {Buffer|Object|string} data - The data to write, automatically serialized if JSON.
     */
    static write(filename, data) {
        const dirname = path.dirname(filename);
        try {
            fs.readdirSync(dirname);
        } catch (error) {
            fs.mkdirSync(dirname,{
                recursive:true
            });
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
