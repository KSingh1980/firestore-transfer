#!/usr/bin/env node

import {open, parseArgs, loadJson, upload} from './lib';

const args = parseArgs(opts => {
    opts.option('-d, --data <file>', 'Name of JSON data file');
});
if (!args.data) {
    console.error('ERROR', 'Missing JSON data file');
    args.help();
}

upload(open(args.db, args.key), args.col, loadJson(args.data));
