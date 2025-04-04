/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export interface IHttpResponse {
    statusCode: number;

    end(): void;
    write(text: string, encoding?: BufferEncoding): void;
    streamAsync(filePath: string): Promise<void>
    setHeader(name: string, value: number | string | string[]): void;
}