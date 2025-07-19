/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ServerContext } from "../models/server-context.js";
import { Settings } from "../models/settings.js";

const DEFAULT_SETTINGS: Settings = {
    autocomplete: {
        mode: "Completion",
        cursorPosition: "Between"
    }
};

export class SettingsService {
    public settings: Settings = { ...DEFAULT_SETTINGS };

    public constructor(private readonly context: ServerContext) { }

    public async update() {
        if (this.context.connectionService.hasConfigurationCapability) {
            const settings = await this.context.connectionService.connection.workspace.getConfiguration('contextjs');
            
            if (settings && settings.autocomplete) {
                this.settings.autocomplete.mode = settings.autocomplete.mode || DEFAULT_SETTINGS.autocomplete.mode;
                this.settings.autocomplete.cursorPosition = settings.autocomplete.cursorPosition || "Between";
            }
        }
    }

    public handleDidChangeConfiguration(change: any) {
        if (change.settings && change.settings.contextjs && change.settings.contextjs.autocomplete) {
            this.settings.autocomplete.mode = change.settings.contextjs.autocomplete.mode || "Completion";
            this.settings.autocomplete.cursorPosition = change.settings.contextjs.autocomplete.cursorPosition || "Between";
        }
    }
}