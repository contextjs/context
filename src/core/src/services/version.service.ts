/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

export class VersionService {
    private static version = "0.0.6";

    public static get(): string {
        return this.version;
    }

    public static display(): void {
        const asciiArt = `
  ____            _            _         _ ____  
 / ___|___  _ __ | |_ _____  _| |_      | / ___| 
| |   / _ \\| '_ \\| __/ _ \\ \\/ / __|  _  | \\___ \\ 
| |__| (_) | | | | ||  __/>  <| |_  | |_| |___) |
 \\____\\___/|_| |_|\\__\\___/_/\\_\\\\__|  \\___/|____/ 
                                                       
________________________________________________
         `;

        console.info('\x1b[33m%s\x1b[0m', asciiArt);
        console.info(`ContextJS: ${this.version}`);
        console.info(`Node: ${process.version}`);
        console.info(`OS: ${process.platform} ${process.arch}`);
        console.info('\n\n');
    }
}