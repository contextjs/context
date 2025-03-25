/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleService } from "./console.service.js";

export class VersionService {
    private static version = "0.1.0";

    public static get(): string {
        return this.version;
    }

    public static display(): void {
        const ascii = `
  ____            _            _         _ ____  
 / ___|___  _ __ | |_ _____  _| |_      | / ___| 
| |   / _ \\| '_ \\| __/ _ \\ \\/ / __|  _  | \\___ \\ 
| |__| (_) | | | | ||  __/>  <| |_  | |_| |___) |
 \\____\\___/|_| |_|\\__\\___/_/\\_\\\\__|  \\___/|____/ 
                                                       
________________________________________________
         `;

        ConsoleService.writeLineFormatted({ format: 'yellow', text: ascii });
        console.info(`ContextJS: ${this.version}`);
        console.info(`Node: ${process.version}`);
        console.info(`OS: ${process.platform} ${process.arch}`);
        console.info('\n');
    }
}