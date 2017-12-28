#!/usr/bin/env node

import {open, parseArgs, dump} from './lib';

const args = parseArgs((opts) => {
    opts.option('-j, --json', 'Output json file');
});

dump(open(args.db, args.key), args.col, args.json);
