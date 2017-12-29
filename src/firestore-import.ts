#!/usr/bin/env node

import {parseArgs, canRead, loadJson, open, upload} from './lib';
import * as STDIN from 'get-stdin';
import * as YAML from 'yamljs';
import * as FS from 'fs';


const args = parseArgs(opts => {
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

const db = open(args.db, args.key);

if (args.json && typeof args.json === 'boolean') {
    STDIN().then(jsonData => {
        const data = JSON.parse(jsonData);
        upload(db, args.col, data);
    });
}

if (args.yaml && typeof args.yaml === 'boolean') {
    STDIN().then(yamlData => {
        const data = YAML.parse(yamlData);
        upload(db, args.col, data);
    });
}

if (args.json && typeof args.json === 'string' && canRead(args.json)) {
    FS.readFile(args.json, 'utf8', (err, jsonData) => {
        if (err) throw err;
        const data = JSON.parse(jsonData);
        upload(db, args.col, data);
    });
}

if (args.yaml && typeof args.yaml === 'string' && canRead(args.yaml)) {
    FS.readFile(args.yaml, 'utf8', (err, yamlData) => {
        if (err) throw err;
        const data = YAML.parse(yamlData);
        upload(db, args.col, data);
    });
}
