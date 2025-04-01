/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { File } from '@contextjs/io';
import { test, TestContext } from 'node:test';
import { EnvironmentFile } from '../../src/models/environment-file';

test('EnvironmentFile: constructor - success', (context: TestContext) => {
    const filePath = 'src/configuration-json/tests/models/configuration-json';
    context.mock.method(File, 'exists', () => true);
    context.mock.method(File, 'read', () => '{"key":"value"}');

    const environmentFile = new EnvironmentFile(filePath);

    context.assert.strictEqual(environmentFile.file, filePath);
    context.assert.strictEqual(environmentFile.environmentName, null);
    context.assert.deepEqual(environmentFile.content, { key: 'value' });
});