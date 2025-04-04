/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "./console.js";

export class VersionService {
    private static readonly version: string = "0.4.3";
    private static readonly ascii: string = `
  ____            _            _         _ ____  
 / ___|___  _ __ | |_ _____  _| |_      | / ___| 
| |   / _ \\| '_ \\| __/ _ \\ \\/ / __|  _  | \\___ \\ 
| |__| (_) | | | | ||  __/>  <| |_  | |_| |___) |
 \\____\\___/|_| |_|\\__\\___/_/\\_\\\\__|  \\___/|____/ 
                                                       
________________________________________________
         `;

    public static get(): string {
        return this.version;
    }

    public static display(): void {
        Console.writeLineFormatted({ format: 'yellow', text: this.ascii });
        Console.writeLine(`ContextJS: ${this.version}`);
        Console.writeLine(`Node: ${process.version}`);
        Console.writeLine(`OS: ${process.platform} ${process.arch}`);
        Console.writeLine('\n');
    }
}