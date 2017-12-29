import * as admin from 'firebase-admin';
import * as commander from 'commander';
import * as FS from 'fs';

export type DB = admin.firestore.Firestore;

export function isArray(obj: any): boolean {
    return Array.isArray(obj);
}

export function isObject(obj: any): boolean {
    return !isArray(obj) && (obj === Object(obj));
}

export function canRead(filename: string): boolean {
    return FS.existsSync(filename);
}

//todo: search for service-key in parent dir(s) as well
//todo: check for .firebaserc file in cur/parent dir (data.projects.default)
export function parseArgs(addOptions: (cmd: commander.CommanderStatic) => void): any {
    const args = commander
        .usage('--auth ./service-key.json --db my-firestore-db --col some-collection [input / output]')
        .option('-a, --auth <file>', 'Filename of service-key JSON. Default: ./service-key.json')
        .option('-d, --db <name>', 'Name of db. Default: ./.firebaserc::projects.default')
        .option('-c, --col <name>', 'Name of collection')
    ;
    addOptions(<commander.CommanderStatic>args);

    args.parse(process.argv);

    if (!args.key) {
        const SERVICE_KEY = './service-key.json';
        if (FS.existsSync(SERVICE_KEY)) {
            args.key = SERVICE_KEY;
        } else {
            console.error('ERROR', 'Missing service-key json file');
            args.help();
        }
    }

    if (!args.db) {
        console.error('ERROR', 'Missing firestore db name');
        args.help();
    }

    if (!args.col) {
        console.error('ERROR', 'Missing firestore collection name');
        args.help();
    }

    return args;
}

export function open(name: string, keyFile: any): admin.firestore.Firestore {
    const key = JSON.parse(FS.readFileSync(keyFile).toString());
    admin.initializeApp({
        credential : admin.credential.cert(key),
        databaseURL: `https://${name}.firebaseio.com`
    });
    return admin.firestore();
}

export function upload(db: DB, collectionName: string, data: any) {
    const collectionRef = db.collection(collectionName);

    if (isArray(data)) {
        data.forEach(obj => {
            collectionRef.add(obj)
                .then(_ok => console.info('ok'))
                .catch(err => console.warn('FAILED', err))
            ;
        });
    } else if (isObject(data)) {
        Object.keys(data).forEach(key => {
            collectionRef.doc(key).set(data[key])
                .then(_ok => console.info(key))
                .catch(err => console.warn('FAILED', err))
            ;
        });
    } else {
        console.error('not an array nor an object');
        process.exit(1);
    }
}

export function download(db: DB, collectionName: string, keys: boolean = false): void {
    db.collection(collectionName).get()
        .then(response => {
            let data = null;
            if (keys) {
                data = [];
                response.forEach(doc => data.push(doc.id));
            } else {
                data = {};
                response.forEach(doc => data[doc.id] = doc.data());
            }
            console.log(JSON.stringify(data, null, 2));
        })
        .catch(err => console.error(err))
    ;
}


