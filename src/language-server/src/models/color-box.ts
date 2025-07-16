/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ColorInformation } from "vscode-languageserver/node.js";

export class ColorBox {
    public label: string;
    public information: ColorInformation;

    public constructor(label: string, information: ColorInformation) {
        this.label = label;
        this.information = information;
    }
}