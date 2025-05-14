/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { StringExtensions } from '@contextjs/system';
import test, { TestContext } from 'node:test';
import { Cookie } from '../../src/models/cookie.js';
import { CookieOptions } from '../../src/models/cookie.options.js';
import { SameSiteMode } from '../../src/models/same-site-mode.js';

test('Cookie: constructor throws if name is null, empty, or whitespace', (context: TestContext) => {
    context.assert.throws(() => { new Cookie(null as any); });
    context.assert.throws(() => { new Cookie(''); });
    context.assert.throws(() => { new Cookie('   '); });
});

test('Cookie: default value and options', (context: TestContext) => {
    const cookie = new Cookie('foo');

    context.assert.strictEqual(cookie.name, 'foo');
    context.assert.strictEqual(cookie.value, StringExtensions.empty);
    context.assert.ok(cookie.options instanceof CookieOptions);
});

test('Cookie: custom value, default options', (context: TestContext) => {
    const cookie = new Cookie('foo', 'bar');

    context.assert.strictEqual(cookie.name, 'foo');
    context.assert.strictEqual(cookie.value, 'bar');
    context.assert.ok(cookie.options instanceof CookieOptions);
});

test('Cookie: custom options are assigned', (context: TestContext) => {
    const customOptions = new CookieOptions(
        'example.com',
        '/api',
        new Date(0),
        true,
        SameSiteMode.Strict,
        true,
        3600
    );
    const cookie = new Cookie('token', 'abc', customOptions);

    context.assert.strictEqual(cookie.name, 'token');
    context.assert.strictEqual(cookie.value, 'abc');
    context.assert.strictEqual(cookie.options, customOptions);
});

test('Cookie: undefined value falls back to empty, custom options apply', (context: TestContext) => {
    const customOptions = new CookieOptions();
    const cookie = new Cookie('sid');
    cookie.options = customOptions;

    context.assert.strictEqual(cookie.value, StringExtensions.empty);
    context.assert.strictEqual(cookie.options, customOptions);
});

test('Cookie: toString: default cookie string', (context: TestContext) => {
    const cookie = new Cookie('foo');
    const str = cookie.toString();
    context.assert.strictEqual(str, 'foo=; Path=/; Secure; HttpOnly; SameSite=Lax');
});

test('Cookie: toString: custom value and default options', (context: TestContext) => {
    const cookie = new Cookie('foo', 'bar');
    const str = cookie.toString();
    context.assert.strictEqual(str, 'foo=bar; Path=/; Secure; HttpOnly; SameSite=Lax');
});

test('Cookie: toString: encodes name and value', (context: TestContext) => {
    const cookie = new Cookie('na me', 'va lue');
    const str = cookie.toString();
    context.assert.strictEqual(str, 'na%20me=va%20lue; Path=/; Secure; HttpOnly; SameSite=Lax');
});

test('Cookie: toString: includes all custom options', (context: TestContext) => {
    const expires = new Date(Date.UTC(2025, 4, 13, 12, 0, 0)); // May 13 2025 12:00 UTC
    const options = new CookieOptions(
        'example.com',
        '/api',
        expires,
        true,
        SameSiteMode.Strict,
        true,
        3600
    );
    const cookie = new Cookie('token', 'abc', options);
    const str = cookie.toString();
    context.assert.strictEqual(str, `token=abc; Domain=example.com; Path=/api; Expires=${expires.toUTCString()}; Max-Age=3600; Secure; HttpOnly; SameSite=Strict`);
});