#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const args = lib_1.parseArgs((opts) => {
    opts.option('-k, --keys', 'Just show the keys');
});
if (!args.col) {
    console.error('ERROR', 'Missing firestore collection name');
    args.help();
}
lib_1.download(lib_1.open(args.db, args.key), args.col, args.keys);
//# sourceMappingURL=firestore-export.js.map