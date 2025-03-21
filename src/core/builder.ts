import * as fs from 'fs';
import { ActionBase } from '../../actions/action-base.ts';
import Config from '../../actions/config.ts';

export class Builder extends ActionBase {
    public override async runAsync(): Promise<void> {
        await this.publishApiAsync();
        await this.setVersionAsync();
    }

    private async publishApiAsync() {
        fs.mkdirSync(`${Config.buildFolder}/core/api`, { recursive: true });
        fs.copyFileSync('src/core/src/api/index.d.ts', `${Config.buildFolder}/core/api/index.d.ts`);
    }

    private async setVersionAsync() {
        const file = fs.readFileSync('src/core/src/services/version.service.ts')
            .toString()
            .replace(/private static version = ".*";/, `private static version = "${Config.version}";`);

        fs.writeFileSync('src/core/src/services/version.service.ts', file);
    }
}

await new Builder().runAsync();