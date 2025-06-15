/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { Path } from '@contextjs/io';
import { RouteDefinition, RouteInfo } from '@contextjs/routing';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { TestContext } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ControllerDiscoveryService } from '../../src/services/controller-discovery-service.js';
import { VerbRouteDiscoveryService } from '../../src/services/verb-route-discovery-service.js';

async function withTempDirAsync<T>(action: (dir: string) => Promise<T> | T): Promise<T> {
    const tempRoot = os.tmpdir();
    const tempDir = fs.mkdtempSync(path.join(tempRoot, 'cds-'));
    let result: T | undefined;
    try {
        result = await action(tempDir);
        return result;
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

test('ControllerDiscoveryService: getProjectOutputDirectory throws when tsconfig.json missing', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        context.assert.throws(() => ControllerDiscoveryService['getProjectOutputDirectory'](workingDirectory));
    });
});

test('ControllerDiscoveryService: getProjectOutputDirectory returns config dir when outDir is missing', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { module: "ESNext" } }));
        const outputDirectory = ControllerDiscoveryService['getProjectOutputDirectory'](workingDirectory);

        context.assert.strictEqual(path.resolve(outputDirectory), path.resolve(workingDirectory));
    });
});

test('ControllerDiscoveryService: getProjectOutputDirectory returns outDir absolute if set absolute', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        const absOutDir = path.join(os.tmpdir(), 'some-absolute-path');
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { outDir: absOutDir } }));
        const outputDirectory = ControllerDiscoveryService['getProjectOutputDirectory'](workingDirectory);
        context.assert.strictEqual(outputDirectory, Path.normalize(absOutDir));
    });
});

test('ControllerDiscoveryService: getProjectOutputDirectory resolves outDir relative to tsconfig.json', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { outDir: './build' } }));
        const outputDirectory = ControllerDiscoveryService['getProjectOutputDirectory'](workingDirectory);
        context.assert.strictEqual(outputDirectory, Path.normalize(path.join(workingDirectory, 'build')));
    });
});

test('ControllerDiscoveryService: getProjectOutputDirectory returns config dir when outDir not set', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({}));
        const outputDirectory = ControllerDiscoveryService['getProjectOutputDirectory'](workingDirectory);

        context.assert.strictEqual(path.resolve(outputDirectory), path.resolve(workingDirectory));
    });
});

test('ControllerDiscoveryService: discoverAsync finds no controllers when no files', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
            compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
            include: ["./build/**/*"]
        }));
        const outputDirectory = path.join(workingDirectory, 'build');
        fs.mkdirSync(outputDirectory, { recursive: true });

        const discoveryResult = await ControllerDiscoveryService.discoverAsync();

        context.assert.strictEqual(discoveryResult.controllers.length, 0);
        context.assert.strictEqual(discoveryResult.routes.length, 0);
    });
});

test('ControllerDiscoveryService: discoverAsync imports files and discovers controllers/routes', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
            compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
            include: ["./build/**/*"]
        }));

        fs.writeFileSync(path.join(workingDirectory, 'package.json'), JSON.stringify({ type: "module" }));
        const outputDirectory = path.join(workingDirectory, 'build');
        fs.mkdirSync(outputDirectory, { recursive: true });

        const testFilePath = fileURLToPath(import.meta.url);
        const decoratorAbsolutePath = path.resolve(path.dirname(testFilePath), '../../src/decorators/controller.decorator.js');
        const decoratorImportUrl = pathToFileURL(decoratorAbsolutePath).href;

        const controllerSource = `
            import { Controller } from '${decoratorImportUrl}';
            class TestController {}
            Controller('templ')(TestController);
            export { TestController };
        `;
        const controllerFilePath = path.join(outputDirectory, 'test-controller.mjs');
        fs.writeFileSync(controllerFilePath, controllerSource);

        await new Promise(r => setTimeout(r, 50)); // use longer for CI

        context.mock.method(VerbRouteDiscoveryService, 'discoverAsync', async () => [{
            route: new RouteInfo('templ/action'),
            className: 'TestController',
            methodName: 'action'
        } as RouteDefinition]);

        const fileUrl = pathToFileURL(controllerFilePath).href;
        try {
            await import(fileUrl);
            const registeredControllers = (await import('../../src/decorators/controller.decorator.js')).getRegisteredControllers();
        }
        catch (e) {

        }

        const discoveryResult = await ControllerDiscoveryService.discoverAsync();

        context.assert.strictEqual(discoveryResult.controllers.length, 1, 'Should discover one controller');
        context.assert.strictEqual(discoveryResult.controllers[0].name, 'TestController');
        context.assert.strictEqual(discoveryResult.routes.length, 1, 'Should discover one route');
        context.assert.strictEqual(discoveryResult.routes[0].className, 'TestController');
    });
});

test('ControllerDiscoveryService: discoverAsync skips files on import errors', async (context: TestContext) => {
    await withTempDirAsync(async (workingDirectory) => {
        fs.writeFileSync(path.join(workingDirectory, 'tsconfig.json'), JSON.stringify({
            compilerOptions: { module: "ESNext", target: "ES2022", outDir: "./build" },
            include: ["./build/**/*"]
        }));
        const outputDirectory = path.join(workingDirectory, 'build');
        fs.mkdirSync(outputDirectory, { recursive: true });

        const invalidModuleFilePath = path.join(outputDirectory, 'bad-controller.mjs');
        fs.writeFileSync(invalidModuleFilePath, 'invalid js syntax');

        const discoveryResult = await ControllerDiscoveryService.discoverAsync();

        context.assert.strictEqual(discoveryResult.controllers.length, 0);
        context.assert.strictEqual(discoveryResult.routes.length, 0);
    });
});