/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class WebServerOptionsBase {
    public enabled!: boolean;
    public port!: number;
    public host?: string;
    public keepAliveTimeout!: number;
}