# @contextjs/context

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/context?cache=300)](https://www.npmjs.com/package/@contextjs/context)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Base ContextJS package containing commands to create, build, watch and debug your projects and solutions.

### Installation

```
npm i -g @contextjs/context
```

### Displaying ContextJS options

```shell
ctx
```

### Version

```shell
ctx version
```

### New project

These commands are equivalent:

```shell
ctx new api myApi
ctx new api -n myApi
ctx new api --name myApi
```

If no argument is passed for api name, current folder name will be used as the api name:
```shell
ctx new api
```

If no argument is passed at all, the help will be displayed:
```shell
ctx new
```

### Build

```shell
ctx build
```

Pass the name(s) if you want only to build a specific project:
```shell
ctx build myApi1 myApi2 ...
```

### Watch

Watch command is similar to build command with the exception that it watches for the changes and automatically rebuilds the affected projects:
```shell
ctx watch
```

Watch specific projects:
```shell
ctx watch myApi1 myApi2 ...
```