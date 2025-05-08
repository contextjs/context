/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Transform, TransformCallback } from "stream";
import { BufferExtensions } from "../extensions/buffer.extensions.js";

export class StreamChunker extends Transform {
    private static readonly CRLF = BufferExtensions.create("\r\n");
    private static readonly ZERO_CHUNK = BufferExtensions.create("0\r\n\r\n");

    public override _transform(chunk: Buffer, encoding: BufferEncoding, callback: TransformCallback): void {
        const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        const sizeHex = bufferChunk.length.toString(16);

        this.push(BufferExtensions.create(sizeHex + "\r\n"));
        this.push(bufferChunk);
        this.push(StreamChunker.CRLF);

        callback();
    }

    public override _flush(callback: TransformCallback): void {
        this.push(StreamChunker.ZERO_CHUNK);
        callback();
    }
}