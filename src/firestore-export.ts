#!/usr/bin/env node

import {open, parseArgs, download} from './lib';

const args = parseArgs((opts) => {
    opts.option('-k, --keys', 'Just show the keys');
});

download(open(args.db, args.key), args.col, args.keys);
