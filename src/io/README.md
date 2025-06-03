# @contextjs/io

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/io?cache=300)](https://www.npmjs.com/package/@contextjs/io)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> File system utilities for reading, writing, and inspecting files, directories, and paths — with clean APIs and exception-based error handling.

## ✨ Features

- Create, rename, and delete files and directories
- Automatic parent directory creation for files
- Path utilities: `isFile`, `isDirectory`, `exists`
- Clear and consistent exceptions
- Null-safe input validation
- Zero dependencies

## Installation

```bash
npm i @contextjs/io
```

## Usage

```ts
import { File, Directory, Path } from '@contextjs/io';

if (!Directory.exists("logs"))
    Directory.create("logs");

File.save("logs/app.log", "Application started", true);

const log = File.read("logs/app.log");
File.save("logs/app.log", log + "\nSecond line", true);

File.rename("logs/app.log", "logs/app-archived.log");

if (Path.isFile("logs/app-archived.log"))
    File.delete("logs/app-archived.log");

if (Directory.exists("logs"))
    Directory.delete("logs");
```

These custom exceptions are thrown by the `File` and `Directory` APIs:

| Exception                  | Thrown When                                      |
|---------------------------|--------------------------------------------------|
| `FileExistsException`     | File already exists and `overwrite = false`      |
| `FileNotFoundException`   | File does not exist during read/rename/delete    |
| `DirectoryExistsException`| Directory already exists on rename               |
| `PathNotFoundException`   | Path does not exist for directory/file operations |
| `NullReferenceException`  | Input path is null or whitespace (from system)   |

## API Reference
For detailed API documentation, please refer to the [API Reference](https://contextjs.dev/api/io#api-reference).