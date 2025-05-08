/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export class GeneralWebServerOptions {
    public maximumHeaderSize!: number;
    public httpContextPoolSize!: number;
    public idleSocketsTimeout!: number;

    public constructor(
        maximumHeaderSize?: number,
        httpContextPoolSize?: number,
        idleSocketsTimeout?: number) {
        this.normalize(maximumHeaderSize, httpContextPoolSize, idleSocketsTimeout);
    }

    private normalize(maximumHeaderSize?: number, httpContextPoolSize?: number, idleSocketsTimeout?: number): void {
        this.maximumHeaderSize = maximumHeaderSize ?? 32 * 1024;
        this.httpContextPoolSize = httpContextPoolSize ?? 1024;
        this.idleSocketsTimeout = idleSocketsTimeout ?? 5000;

        let bytes = this.maximumHeaderSize;
        if (bytes < 1024)
            bytes = 1024;
        const alignedBytes = Math.ceil(bytes / 1024) * 1024;
        this.maximumHeaderSize = alignedBytes;
    }
}