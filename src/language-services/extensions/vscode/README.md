# ContextJS Language Support for VSCode

[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/ContextJS.contextjs?label=VSCode%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=ContextJS.contextjs)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

**ContextJS Language Support** brings modern editing, syntax highlighting, and intelligent tooling to `.tshtml` (and other ContextJS view) files in Visual Studio Code, powered by the ContextJS language server and parser.

## Features

- **Syntax Highlighting:**  
  Rich TextMate grammar for `.tshtml` and related files.
- **Intelligent Diagnostics:**  
  Real-time error and warning feedback via the integrated ContextJS language server.
- **Bracket & Comment Support:**  
  Bracket matching, auto-closing, and line/block comment toggling.
- **Auto Completion:**  
  Contextual completions and tooltips provided by the language server.
- **Lightweight & Fast:**  
  Minimal runtime dependencies and efficient packaging.

## Getting Started

### 1. **Install the Extension**

**From VSCode Marketplace:**
1. Open the Extensions sidebar
2. Search for **ContextJS**.
3. Click **Install**.

### 2. **Open a ContextJS View File**
- Open any `.tshtml` file.
- Syntax highlighting and language features are enabled automatically.

## File Types Supported

- `.tshtml`

## How It Works

This extension is part of the [@contextjs](https://github.com/contextjs/context) ecosystem. It provides:

- **TextMate grammar:** For advanced syntax highlighting.
- **Language configuration:** For brackets, comments, and editor behaviors.
- **Integrated language server:** For live parsing, validation, and completions, powered by the ContextJS parser.

## Project Structure

- `package.json` — Extension manifest.
- `out/extension.js` — Main extension entry point (starts the language server).
- `out/language-configuration.json` — Brackets, comments, and editor config.
- `out/contextjs.tmLanguage.json` — Syntax highlighting grammar.

## Development & Contribution

1. **Clone the repo:**
   ```sh
   git clone https://github.com/contextjs/vscode.git
   cd vscode
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Build:**
   ```sh
   npm run build
   ```
4. **Launch Extension Development Host:**
   - Press `F5` in VSCode (with this folder open).
   - Or run:
     ```
     code .
     ```
   - Choose “Run Extension” from the Run and Debug menu.

5. **Package a VSIX:**
   ```sh
   npm run pack
   ```

## Troubleshooting

- **No syntax highlighting or brackets?**  
  - Make sure you’re opening a `.tshtml` file.
  - Reload VSCode after installing or updating the extension.
- **Language server not starting?**  
  - Check `Output > ContextJS Language Server` for logs.
  - Confirm dependencies are present.

## About

**ContextJS for VSCode** is developed and maintained as part of the [@contextjs](https://github.com/contextjs/context) open-source ecosystem, delivering powerful, modern tooling for ContextJS-powered applications.

**Have feedback or want to contribute?**  
Open an issue or pull request at [github.com/contextjs/vscode](https://github.com/contextjs/vscode).