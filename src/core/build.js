import * as fs from 'fs';
import { BUILD_FOLDER } from '../../scripts/config.js';

publishApi();
setVersion();

function publishApi() {
    fs.mkdirSync(`${BUILD_FOLDER}/core/api`, { recursive: true });
    fs.copyFileSync('src/core/src/api/index.d.ts', `${BUILD_FOLDER}/core/api/index.d.ts`);
}

function setVersion() {

    if (!fs.existsSync('src/core/src/services/version.service.ts'))
        throw new Error('Missing version.service.ts in core project.');

    const packageJson = fs.readFileSync('scripts/config.js');

    const version = packageJson
        .toString()
        .match(/export const VERSION = "(.*)";/)[1];

    const file = fs.readFileSync('src/core/src/services/version.service.ts')
        .toString()
        .replace(/private static version = ".*";/, `private static version = "${version}";`);

    fs.writeFileSync('src/core/src/services/version.service.ts', file);
}