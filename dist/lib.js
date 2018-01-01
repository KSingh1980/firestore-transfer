"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const commander = require("commander");
const FS = require("fs");
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
function isObject(obj) {
    return !isArray(obj) && (obj === Object(obj));
}
exports.isObject = isObject;
function canRead(filename) {
    return FS.existsSync(filename);
}
exports.canRead = canRead;
function loadJson(filename) {
    return JSON.parse(FS.readFileSync(filename).toString());
}
function findFile(filename, dirs) {
    for (let dir of dirs) {
        const path = `${dir}/${filename}`;
        if (FS.existsSync(path))
            return path;
    }
    return undefined;
}
function parseArgs(addOptions) {
    const args = commander
        .usage('--auth ./service-key.json --db my-firestore-db --col some-collection [input / output]')
        .option('-a, --auth <file>', 'Filename of service-key JSON. Default: ./service-key.json')
        .option('-d, --db <name>', 'Name of db. Default: ./.firebaserc[projects.default]')
        .option('-c, --col <name>', 'Name of collection');
    addOptions(args);
    args.parse(process.argv);
    if (!args.key) {
        const serviceKeyFile = findFile('service-key.json', ['.', '..', '../..']);
        if (serviceKeyFile) {
            args.key = serviceKeyFile;
        }
        else {
            console.error('ERROR', 'Missing service-key file');
            args.help();
        }
    }
    if (!args.db) {
        const firebaseFile = findFile('.firebaserc', ['.', '..', '../..']);
        if (firebaseFile) {
            const data = loadJson(firebaseFile);
            args.db = data.projects.default;
        }
        else {
            console.error('ERROR', 'Missing .firebaserc file');
            args.help();
        }
    }
    // if (!args.col) {
    //     console.error('ERROR', 'Missing firestore collection name');
    //     args.help();
    // }
    return args;
}
exports.parseArgs = parseArgs;
function open(name, keyFile) {
    const key = JSON.parse(FS.readFileSync(keyFile).toString());
    admin.initializeApp({
        credential: admin.credential.cert(key),
        databaseURL: `https://${name}.firebaseio.com`
    });
    return admin.firestore();
}
exports.open = open;
function upload(db, collectionName, data) {
    const collectionRef = db.collection(collectionName);
    if (isArray(data)) {
        data.forEach(obj => {
            collectionRef.add(obj)
                .then(_ok => console.info('ok'))
                .catch(err => console.warn('FAILED', err));
        });
    }
    else if (isObject(data)) {
        Object.keys(data).forEach(key => {
            collectionRef.doc(key).set(data[key])
                .then(_ok => console.info(key))
                .catch(err => console.warn('FAILED', err));
        });
    }
    else {
        console.error('not an array nor an object');
        process.exit(1);
    }
}
exports.upload = upload;
function download(db, collectionName, keys = false) {
    db.collection(collectionName).get()
        .then(response => {
        let data = null;
        if (keys) {
            data = [];
            response.forEach(doc => data.push(doc.id));
        }
        else {
            data = {};
            response.forEach(doc => data[doc.id] = doc.data());
        }
        console.log(JSON.stringify(data, null, 2));
    })
        .catch(err => console.error(err));
}
exports.download = download;
//# sourceMappingURL=lib.js.map