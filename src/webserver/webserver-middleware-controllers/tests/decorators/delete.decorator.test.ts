/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { HttpVerb } from '@contextjs/webserver';
import test, { TestContext } from 'node:test';
import 'reflect-metadata';
import { Delete } from '../../src/decorators/delete.decorator.js';
import { VERB_ROUTE_META } from '../../src/decorators/verb-decorator.js';

test('DeleteDecorator: metadata is undefined for undecorated method', (context: TestContext) => {
    class PlainClass { method() { } }

    const meta = Reflect.getMetadata(VERB_ROUTE_META, PlainClass.prototype.method);
    context.assert.strictEqual(meta, undefined);
});

test('DeleteDecorator: sets correct template and DELETE verb metadata', (context: TestContext) => {
    const template = '/delete-path';
    class DecoratedClass { action() { } }
    const descriptor = Object.getOwnPropertyDescriptor(DecoratedClass.prototype, 'action');
    Delete(template)(DecoratedClass.prototype, 'action', descriptor as TypedPropertyDescriptor<any>);
    const handler = (descriptor as TypedPropertyDescriptor<any>).value!;
    const meta: { template: string; verb: HttpVerb } | undefined = Reflect.getMetadata(VERB_ROUTE_META, handler);

    context.assert.ok(descriptor, 'Descriptor should exist');
    context.assert.ok(meta, 'Metadata should be defined');
    context.assert.strictEqual(meta.template, template);
    context.assert.strictEqual(meta.verb, 'DELETE');
});