/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Console } from "@contextjs/system";
import { ParserContext } from "./parser-context.js";

export class Debug {
    private readonly context: ParserContext;

    public constructor(context: ParserContext) {
        this.context = context;
    }

    public log(message: string): void {
        if (this.context.debugMode)
            Console.writeLine(message);
    }

    public error(message: string): void {
        if (this.context.debugMode)
            Console.writeLineError(message);
    }

    public warn(message: string): void {
        if (this.context.debugMode)
            Console.writeLineWarning(message);
    }

    public throw(message: string): void {
        if (this.context.debugMode)
            throw new Error(message);
    }
}