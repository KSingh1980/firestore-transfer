#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const STDIN = require("get-stdin");
const YAML = require("yamljs");
const FS = require("fs");
const args = lib_1.parseArgs(opts => {
    opts.option('-j, --json [file]', 'Name of JSON data file or read it from stdin');
    opts.option('-y, --yaml [file]', 'Name of YaML data file or read it from stdin');
});
if (!args.json && !args.yaml) {
    console.error('ERROR', 'Specify either JSON or YaML file');
    args.help();
}
if (args.json && args.yaml) {
    console.error('ERROR', 'Specify only one of JSON or YaML file');
    args.help();
}
const db = lib_1.open(args.db, args.key);
if (args.json && typeof args.json === 'boolean') {
    STDIN().then(jsonData => {
        const data = JSON.parse(jsonData);
        lib_1.upload(db, args.col, data);
    });
}
if (args.yaml && typeof args.yaml === 'boolean') {
    STDIN().then(yamlData => {
        const data = YAML.parse(yamlData);
        lib_1.upload(db, args.col, data);
    });
}
if (args.json && typeof args.json === 'string' && lib_1.canRead(args.json)) {
    FS.readFile(args.json, 'utf8', (err, jsonData) => {
        if (err)
            throw err;
        const data = JSON.parse(jsonData);
        lib_1.upload(db, args.col, data);
    });
}
if (args.yaml && typeof args.yaml === 'string' && lib_1.canRead(args.yaml)) {
    FS.readFile(args.yaml, 'utf8', (err, yamlData) => {
        if (err)
            throw err;
        const data = YAML.parse(yamlData);
        lib_1.upload(db, args.col, data);
    });
}
//# sourceMappingURL=firestore-import.js.map