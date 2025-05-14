/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { CookieOptions } from '../../src/models/cookie.options.js';
import { SameSiteMode } from '../../src/models/same-site-mode.js';

test('CookieOptions: default constructor values', (context: TestContext) => {
    const opts = new CookieOptions();

    context.assert.strictEqual(opts.domain, null);
    context.assert.strictEqual(opts.path, '/');
    context.assert.strictEqual(opts.expires, null);
    context.assert.strictEqual(opts.secure, true);
    context.assert.strictEqual(opts.sameSite, SameSiteMode.Lax);
    context.assert.strictEqual(opts.httpOnly, true);
    context.assert.strictEqual(opts.maxAge, null);
});

test('CookieOptions: custom constructor values', (context: TestContext) => {
    const domain = 'example.com';
    const path = '/api';
    const expires = new Date(Date.UTC(2025, 4, 13, 12, 0, 0));
    const secure = true;
    const sameSite = SameSiteMode.Strict;
    const httpOnly = true;
    const maxAge = 3600;

    const opts = new CookieOptions(domain, path, expires, secure, sameSite, httpOnly, maxAge);

    context.assert.strictEqual(opts.domain, domain);
    context.assert.strictEqual(opts.path, path);
    context.assert.strictEqual(opts.expires?.getTime(), expires.getTime());
    context.assert.strictEqual(opts.secure, secure);
    context.assert.strictEqual(opts.sameSite, sameSite);
    context.assert.strictEqual(opts.httpOnly, httpOnly);
    context.assert.strictEqual(opts.maxAge, maxAge);
});

test('CookieOptions: toString: default options string', (context: TestContext) => {
    const opts = new CookieOptions();
    const str = opts.toString();
    context.assert.strictEqual(str, "Path=/; Secure; HttpOnly; SameSite=Lax");
});

test('CookieOptions: toString: domain only', (context: TestContext) => {
    const opts = new CookieOptions('example.com');
    const str = opts.toString();
    context.assert.strictEqual(str, 'Domain=example.com; Path=/; Secure; HttpOnly; SameSite=Lax');
});

test('CookieOptions: toString: all options', (context: TestContext) => {
    const expires = new Date(Date.UTC(2025, 4, 13, 12, 0, 0)); // May 13 2025 12:00 UTC
    const opts = new CookieOptions(
        'example.com',
        '/api',
        expires,
        true,
        SameSiteMode.Lax,
        true,
        3600
    );
    const str = opts.toString();
    context.assert.strictEqual(
        str,
        `Domain=example.com; Path=/api; Expires=${expires.toUTCString()}; Max-Age=3600; Secure; HttpOnly; SameSite=Lax`
    );
});